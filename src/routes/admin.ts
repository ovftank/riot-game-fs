import { DEFAULT_ADMIN, JWT_KEY } from '@/config/riot';
import { AccountHelper, AdminHelper, MailHelper, OmocaptchaHelper, ProxyHelper, TelegramHelper } from '@/helper/database-helper';
import { ChangePasswordSchema, CheckBalanceSchema, CreateEmailInputSchema, CreateOmocaptchaInputSchema, CreateProxyInputSchema, CreateTelegramInputSchema, DeleteAccountSchema, LoginSchema, OmocaptchaErrorResponseSchema, OmocaptchaSuccessResponseSchema, ToggleProxySchema } from '@/types';
import { type RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import axios from 'axios';

const JWT_SECRET = JWT_KEY;
const { USERNAME: DEFAULT_USERNAME, PASSWORD: DEFAULT_PASSWORD } = DEFAULT_ADMIN;

export const auth: RequestHandler = (req, res, next) => {
    try {
        const authHeader = req.get('authorization');
        const token = authHeader?.split(' ')[1];

        if (!token) {
            res.status(401).json({
                success: false,
                message: 'thiếu token'
            });
            return;
        }

        jwt.verify(token, JWT_SECRET, (err, _decoded) => {
            if (err) {
                res.status(401).json({
                    success: false,
                    message: 'token sai'
                });
                return;
            }

            next();
        });
    } catch {
        res.status(500).json({
            success: false,
            message: 'server lỗi'
        });
    }
};

export const login: RequestHandler = (req, res) => {
    try {
        const result = LoginSchema.safeParse(req.body);

        if (!result.success) {
            res.status(400).json({
                success: false,
                message: 'data sai format',
                errors: result.error.issues.map((issue) => issue.message)
            });
            return;
        }

        const { username, password } = result.data;
        let admin = AdminHelper.get();

        if (!admin) {
            const createResult = AdminHelper.set({ username: DEFAULT_USERNAME, password: DEFAULT_PASSWORD });
            if (!createResult.success) {
                res.status(500).json({
                    success: false,
                    message: 'tạo admin fail'
                });
                return;
            }
            admin = AdminHelper.get();
            if (!admin) {
                res.status(500).json({
                    success: false,
                    message: 'lấy admin fail'
                });
                return;
            }
        }

        if (admin.username !== username) {
            res.status(401).json({
                success: false,
                message: 'sai user/pass'
            });
            return;
        }

        if (admin.password !== password) {
            res.status(401).json({
                success: false,
                message: 'sai user/pass'
            });
            return;
        }

        AdminHelper.markLogin();

        const token = jwt.sign(
            {
                id: admin.id,
                username: admin.username
            },
            JWT_SECRET,
            {
                expiresIn: '24h'
            }
        );

        res.json({
            success: true,
            token,
            message: 'login thành công',
            admin: {
                id: admin.id,
                username: admin.username,
                last_login: admin.last_login
            }
        });
    } catch {
        res.status(500).json({
            success: false,
            message: 'server lỗi'
        });
    }
};
export const changePass: RequestHandler = (req, res) => {
    try {
        const result = ChangePasswordSchema.safeParse(req.body);

        if (!result.success) {
            res.status(400).json({
                success: false,
                message: 'data sai format',
                errors: result.error.issues.map((issue) => issue.message)
            });
            return;
        }

        const { newPassword } = result.data;
        const dbResult = AdminHelper.setPassword(newPassword);

        if (!dbResult.success) {
            res.status(500).json({
                success: false,
                message: dbResult.error ?? 'đổi pass fail'
            });
            return;
        }

        res.json({
            success: true,
            message: 'đổi pass thành công'
        });
    } catch {
        res.status(500).json({
            success: false,
            message: 'server lỗi'
        });
    }
};
export const accounts: RequestHandler = (_req, res) => {
    try {
        const accounts = AccountHelper.getAll();
        const count = AccountHelper.count();

        res.json({
            success: true,
            accounts,
            total: count
        });
    } catch {
        res.status(500).json({
            success: false,
            message: 'server lỗi'
        });
    }
};

export const delAccount: RequestHandler = (req, res) => {
    try {
        const result = DeleteAccountSchema.safeParse(req.params);

        if (!result.success) {
            res.status(400).json({
                success: false,
                message: 'ID sai format',
                errors: result.error.issues.map((issue) => issue.message)
            });
            return;
        }

        const { id } = result.data;
        const dbResult = AccountHelper.del(id);

        if (!dbResult.success) {
            res.status(500).json({
                success: false,
                message: dbResult.error ?? 'xóa acc fail'
            });
            return;
        }

        if (dbResult.changes === 0) {
            res.status(404).json({
                success: false,
                message: 'acc k tồn tại'
            });
            return;
        }

        res.json({
            success: true,
            message: 'xóa acc thành công'
        });
    } catch {
        res.status(500).json({
            success: false,
            message: 'server lỗi'
        });
    }
};

export const setEmail: RequestHandler = (req, res) => {
    try {
        const result = CreateEmailInputSchema.safeParse(req.body);

        if (!result.success) {
            res.status(400).json({
                success: false,
                message: 'data sai format',
                errors: result.error.issues.map((issue) => issue.message)
            });
            return;
        }

        const dbResult = MailHelper.set(result.data);

        if (!dbResult.success) {
            res.status(500).json({
                success: false,
                message: dbResult.error ?? 'set email fail'
            });
            return;
        }

        res.json({
            success: true,
            message: 'set email thành công'
        });
    } catch {
        res.status(500).json({
            success: false,
            message: 'server lỗi'
        });
    }
};

export const getEmail: RequestHandler = (_req, res) => {
    try {
        const emailConfig = MailHelper.get();

        res.json({
            success: true,
            emailConfig
        });
    } catch {
        res.status(500).json({
            success: false,
            message: 'server lỗi'
        });
    }
};

export const setProxy: RequestHandler = (req, res) => {
    try {
        const result = CreateProxyInputSchema.safeParse(req.body);

        if (!result.success) {
            res.status(400).json({
                success: false,
                message: 'data sai format',
                errors: result.error.issues.map((issue) => issue.message)
            });
            return;
        }

        const dbResult = ProxyHelper.set(result.data);

        if (!dbResult.success) {
            res.status(500).json({
                success: false,
                message: dbResult.error ?? 'set proxy fail'
            });
            return;
        }

        res.json({
            success: true,
            message: 'set proxy thành công'
        });
    } catch {
        res.status(500).json({
            success: false,
            message: 'server lỗi'
        });
    }
};

export const getProxy: RequestHandler = (_req, res) => {
    try {
        const proxyConfig = ProxyHelper.get();

        res.json({
            success: true,
            proxyConfig
        });
    } catch {
        res.status(500).json({
            success: false,
            message: 'server lỗi'
        });
    }
};

export const toggle: RequestHandler = (req, res) => {
    try {
        const result = ToggleProxySchema.safeParse(req.body);

        if (!result.success) {
            res.status(400).json({
                success: false,
                message: 'data sai format',
                errors: result.error.issues.map((issue) => issue.message)
            });
            return;
        }

        const { enabled } = result.data;
        const dbResult = ProxyHelper.toggle(enabled);

        if (!dbResult.success) {
            res.status(500).json({
                success: false,
                message: dbResult.error ?? 'toggle proxy fail'
            });
            return;
        }

        res.json({
            success: true,
            message: `proxy ${enabled ? 'bật' : 'tắt'} ok!`
        });
    } catch {
        res.status(500).json({
            success: false,
            message: 'server lỗi'
        });
    }
};

export const setTg: RequestHandler = (req, res) => {
    try {
        const result = CreateTelegramInputSchema.safeParse(req.body);

        if (!result.success) {
            res.status(400).json({
                success: false,
                message: 'data sai format',
                errors: result.error.issues.map((issue) => issue.message)
            });
            return;
        }

        const dbResult = TelegramHelper.set(result.data);

        if (!dbResult.success) {
            res.status(500).json({
                success: false,
                message: dbResult.error ?? 'set telegram fail'
            });
            return;
        }

        res.json({
            success: true,
            message: 'set telegram thành công'
        });
    } catch {
        res.status(500).json({
            success: false,
            message: 'server lỗi'
        });
    }
};

export const getTg: RequestHandler = (_req, res) => {
    try {
        const telegramConfig = TelegramHelper.get();

        res.json({
            success: true,
            telegramConfig
        });
    } catch {
        res.status(500).json({
            success: false,
            message: 'server lỗi'
        });
    }
};

export const setOmocaptcha: RequestHandler = (req, res) => {
    try {
        const result = CreateOmocaptchaInputSchema.safeParse(req.body);

        if (!result.success) {
            res.status(400).json({
                success: false,
                message: 'data sai format',
                errors: result.error.issues.map((issue) => issue.message)
            });
            return;
        }

        const dbResult = OmocaptchaHelper.set(result.data);

        if (!dbResult.success) {
            res.status(500).json({
                success: false,
                message: dbResult.error ?? 'set omocaptcha fail'
            });
            return;
        }

        res.json({
            success: true,
            message: 'set omocaptcha thành công'
        });
    } catch {
        res.status(500).json({
            success: false,
            message: 'server lỗi'
        });
    }
};

export const getOmocaptcha: RequestHandler = (_req, res) => {
    try {
        const omocaptchaConfig = OmocaptchaHelper.get();

        res.json({
            success: true,
            omocaptchaConfig
        });
    } catch {
        res.status(500).json({
            success: false,
            message: 'server lỗi'
        });
    }
};

export const checkBalance: RequestHandler = async (req, res) => {
    try {
        const result = CheckBalanceSchema.safeParse(req.body);

        if (!result.success) {
            res.status(400).json({
                success: false,
                message: 'data sai format',
                errors: result.error.issues.map((issue) => issue.message)
            });
            return;
        }

        const { clientKey } = result.data;

        const response = await axios.post('https://api.omocaptcha.com/v2/getBalance', {
            clientKey
        });

        const responseData = response.data as unknown;

        const errorParseResult = OmocaptchaErrorResponseSchema.safeParse(responseData);
        if (errorParseResult.success) {
            res.json({
                success: false,
                message: 'omocaptcha lỗi',
                error: {
                    code: errorParseResult.data.errorCode,
                    description: errorParseResult.data.errorDescription
                }
            });
            return;
        }

        const successParseResult = OmocaptchaSuccessResponseSchema.safeParse(responseData);
        if (successParseResult.success) {
            res.json({
                success: true,
                balance: parseFloat(successParseResult.data.balance)
            });
            return;
        }

        res.status(500).json({
            success: false,
            message: 'omocaptcha response sai format'
        });
    } catch (err) {
        console.log('lỗi check balance:', err);
        res.status(500).json({
            success: false,
            message: 'server lỗi'
        });
    }
};

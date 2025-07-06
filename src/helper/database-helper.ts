import { getAdminQueries, getEmailQueries, getProxyQueries, getRiotAccountQueries, getTelegramQueries } from '@/database/database';

import type { AdminAccount, CreateAdminInput, CreateEmailInput, CreateProxyInput, CreateResult, CreateRiotAccountInput, CreateTelegramInput, DatabaseResult, EmailConfig, ProxyConfig, RiotAccount, TelegramConfig, RiotAccountQueries as AccountQueries, EmailQueries, AdminQueries, ProxyQueries, TelegramQueries } from '@/types';

const riotAccountQueries = (): AccountQueries => getRiotAccountQueries();
const emailQueries = (): EmailQueries => getEmailQueries();
const adminQueries = (): AdminQueries => getAdminQueries();
const proxyQueries = (): ProxyQueries => getProxyQueries();
const telegramQueries = (): TelegramQueries => getTelegramQueries();

const isRiotAccount = (obj: unknown): obj is RiotAccount => {
    return obj !== null && typeof obj === 'object' && 'id' in obj && 'username' in obj;
};

const isEmailConfig = (obj: unknown): obj is EmailConfig => {
    return obj !== null && typeof obj === 'object' && 'id' in obj && 'email' in obj;
};

const isAdminConfig = (obj: unknown): obj is AdminAccount => {
    return obj !== null && typeof obj === 'object' && 'id' in obj && 'username' in obj && 'password' in obj && 'last_login' in obj;
};

const isProxyConfig = (obj: unknown): obj is ProxyConfig => {
    return obj !== null && typeof obj === 'object' && 'id' in obj && 'host' in obj;
};

const isTelegramConfig = (obj: unknown): obj is TelegramConfig => {
    return obj !== null && typeof obj === 'object' && 'id' in obj && 'bot_token' in obj;
};

export class AccountHelper {
    static add(input: CreateRiotAccountInput): CreateResult {
        try {
            const result = riotAccountQueries().insert.run(input.username, input.password, input.email ?? '');
            return {
                success: true,
                id: result.lastInsertRowid,
                changes: result.changes
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'unknown error'
            };
        }
    }

    static findByUser(username: string): RiotAccount | null {
        try {
            const result = riotAccountQueries().findByUsername.get(username);
            return result && isRiotAccount(result) ? result : null;
        } catch {
            return null;
        }
    }

    static getAll(): RiotAccount[] {
        try {
            const results = riotAccountQueries().findAll.all();
            return Array.isArray(results) ? results.filter(isRiotAccount) : [];
        } catch {
            return [];
        }
    }

    static del(id: number): DatabaseResult {
        try {
            const result = riotAccountQueries().delete.run(id);
            return {
                success: result.changes > 0,
                changes: result.changes
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'unknown error'
            };
        }
    }

    static count(): number {
        try {
            const result = riotAccountQueries().count.get();
            return typeof result === 'number' ? result : 0;
        } catch {
            return 0;
        }
    }
}

export class MailHelper {
    static set(input: CreateEmailInput): DatabaseResult {
        try {
            const result = emailQueries().upsert.run(input.email);
            return {
                success: true,
                changes: result.changes
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'unknown error'
            };
        }
    }

    static get(): EmailConfig | null {
        try {
            const result = emailQueries().get.get();
            return result && isEmailConfig(result) ? result : null;
        } catch {
            return null;
        }
    }
}

export class AdminHelper {
    static set(input: CreateAdminInput): DatabaseResult {
        try {
            const result = adminQueries().upsert.run(input.username, input.password);
            return {
                success: true,
                changes: result.changes
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'unknown error'
            };
        }
    }

    static get(): AdminAccount | null {
        try {
            const result = adminQueries().get.get();
            return result && isAdminConfig(result) ? result : null;
        } catch {
            return null;
        }
    }

    static markLogin(): DatabaseResult {
        try {
            const result = adminQueries().writeLastLogin.run();
            return {
                success: true,
                changes: result.changes
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'unknown error'
            };
        }
    }

    static setPassword(newPassword: string): DatabaseResult {
        try {
            const result = adminQueries().changePassword.run(newPassword);
            return {
                success: true,
                changes: result.changes
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'unknown error'
            };
        }
    }
}

export class ProxyHelper {
    static set(input: CreateProxyInput): DatabaseResult {
        try {
            const result = proxyQueries().upsert.run(input.host, input.port, input.username, input.password, input.protocol, input.enabled ? 1 : 0);
            return {
                success: true,
                changes: result.changes
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'unknown error'
            };
        }
    }

    static get(): ProxyConfig | null {
        try {
            const result = proxyQueries().get.get();
            return result && isProxyConfig(result) ? result : null;
        } catch (error) {
            console.log('proxy get fail:', error);
            return null;
        }
    }

    static toggle(enabled: boolean): DatabaseResult {
        try {
            const result = proxyQueries().toggle.run(enabled ? 1 : 0);
            return {
                success: result.changes > 0,
                changes: result.changes
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'unknown error'
            };
        }
    }
}

export class TelegramHelper {
    static set(input: CreateTelegramInput): DatabaseResult {
        try {
            const result = telegramQueries().upsert.run(input.bot_token, input.chat_id);
            return {
                success: true,
                changes: result.changes
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'unknown error'
            };
        }
    }

    static get(): TelegramConfig | null {
        try {
            const result = telegramQueries().get.get();
            return result && isTelegramConfig(result) ? result : null;
        } catch (error) {
            console.log('telegram get fail:', error);
            return null;
        }
    }
}

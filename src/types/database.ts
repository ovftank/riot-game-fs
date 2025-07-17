import { z } from 'zod';
import type { Statement, Database } from 'better-sqlite3';

export type DbTransaction = () => void;
export type QueryObject = Record<string, Statement>;
export type DBInstance = Database;

export interface RiotAccountQueries {
    insert: Statement;
    findByUsername: Statement;
    findAll: Statement;
    delete: Statement;
    updatePassword: Statement;
    count: Statement;
}

export interface EmailQueries {
    upsert: Statement;
    get: Statement;
}

export interface AdminQueries {
    upsert: Statement;
    get: Statement;
    writeLastLogin: Statement;
    changePassword: Statement;
}

export interface ProxyQueries {
    upsert: Statement;
    get: Statement;
    toggle: Statement;
}

export interface TelegramQueries {
    upsert: Statement;
    get: Statement;
}

export const RiotAccountSchema = z.object({
    id: z.number().int().positive(),
    username: z.string().min(1).max(100),
    password: z.string().min(1),
    email: z.string().email(),
    created_at: z.string().datetime()
});

export const EmailConfigSchema = z.object({
    id: z.number().int().positive(),
    email: z.string().email(),
    updated_at: z.string().datetime()
});

export const AdminAccountSchema = z.object({
    id: z.number().int().positive(),
    username: z.string().min(1).max(50),
    password: z.string().min(1),
    last_login: z.string().datetime()
});

export const ProxyProtocolSchema = z.enum(['http', 'https', 'socks4', 'socks5']);

export const ProxyConfigSchema = z.object({
    id: z.number().int().positive(),
    host: z.string().min(1),
    port: z.number().int().min(1).max(65535),
    username: z.string().min(1),
    password: z.string().min(1),
    protocol: ProxyProtocolSchema,
    enabled: z.number().int().min(0).max(1),
    updated_at: z.string().datetime()
});

export const TelegramConfigSchema = z.object({
    id: z.number().int().positive(),
    bot_token: z.string().min(1),
    chat_id: z.number().int(),
    updated_at: z.string().datetime()
});

export const DatabaseResultSchema = z.object({
    success: z.boolean(),
    changes: z.number().int().nonnegative().optional(),
    error: z.string().optional()
});

export const CreateResultSchema = DatabaseResultSchema.extend({
    id: z.union([z.number().int().positive(), z.bigint().positive()]).optional()
});

export const CreateRiotAccountInputSchema = z.object({
    username: z.string().min(1).max(100),
    password: z.string().min(1),
    email: z.string().email().optional()
});

export const CreateEmailInputSchema = z.object({
    email: z.string().email()
});

export const CreateAdminInputSchema = z.object({
    username: z.string().min(1).max(50),
    password: z.string().min(1)
});

export const CreateProxyInputSchema = z.object({
    host: z.string().min(1),
    port: z.number().int().min(1).max(65535),
    username: z.string().min(1),
    password: z.string().min(1),
    protocol: ProxyProtocolSchema,
    enabled: z.boolean().optional().default(true)
});

export const CreateTelegramInputSchema = z.object({
    bot_token: z.string().min(1),
    chat_id: z.number().int()
});

export type RiotAccount = z.infer<typeof RiotAccountSchema>;
export type EmailConfig = z.infer<typeof EmailConfigSchema>;
export type AdminAccount = z.infer<typeof AdminAccountSchema>;
export type ProxyConfig = z.infer<typeof ProxyConfigSchema>;
export type TelegramConfig = z.infer<typeof TelegramConfigSchema>;
export type ProxyProtocol = z.infer<typeof ProxyProtocolSchema>;

export type DatabaseResult = z.infer<typeof DatabaseResultSchema>;
export type CreateResult = z.infer<typeof CreateResultSchema>;

export type CreateRiotAccountInput = z.infer<typeof CreateRiotAccountInputSchema>;
export type CreateEmailInput = z.infer<typeof CreateEmailInputSchema>;
export type CreateAdminInput = z.infer<typeof CreateAdminInputSchema>;
export type CreateProxyInput = z.infer<typeof CreateProxyInputSchema>;
export type CreateTelegramInput = z.infer<typeof CreateTelegramInputSchema>;

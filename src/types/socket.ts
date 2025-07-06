import { z } from 'zod';
import { ResultSchema } from '@/types/riot';

export const LoginDataSchema = z.object({
    username: z.string().min(1),
    password: z.string().min(1)
});

export const OtpDataSchema = z.object({
    otp: z.string().min(1)
});

export const BrowserReadyDataSchema = z.object({
    success: z.boolean(),
    message: z.string().optional(),
    error: z.string().optional()
});

export const SocketDataSchema = z.object({
    userId: z.string().optional(),
    username: z.string().optional()
});

export interface ClientEvents {
    login: (data: z.infer<typeof LoginDataSchema>) => void;
    enter_otp: (data: z.infer<typeof OtpDataSchema>) => void;
}

export interface ServerEvents {
    browser_ready: (data: z.infer<typeof BrowserReadyDataSchema>) => void;
    login_result: (result: z.infer<typeof ResultSchema>) => void;
    otp_result: (result: z.infer<typeof ResultSchema>) => void;
}

export interface InterEvents {
    ping: () => void;
}

export type SocketData = z.infer<typeof SocketDataSchema>;

export type LoginData = z.infer<typeof LoginDataSchema>;
export type OtpData = z.infer<typeof OtpDataSchema>;
export type BrowserReady = z.infer<typeof BrowserReadyDataSchema>;
export type SocketDataType = z.infer<typeof SocketDataSchema>;

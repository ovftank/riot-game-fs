import { z } from 'zod';

export const LoginSchema = z.object({
    username: z.string().min(1, 'username bắt buộc'),
    password: z.string().min(1, 'password bắt buộc')
});

export const ChangePasswordSchema = z.object({
    newPassword: z.string().min(1, 'password mới bắt buộc')
});

export const DeleteAccountSchema = z.object({
    id: z.string().regex(/^\d+$/, 'ID phải là số').transform(Number)
});

export const ToggleProxySchema = z.object({
    enabled: z.boolean()
});

export const AuthHeaderSchema = z.object({
    authorization: z.string().min(1, 'authorization header bắt buộc')
});

export const JWTPayloadSchema = z.object({
    id: z.number(),
    username: z.string(),
    iat: z.number().optional(),
    exp: z.number().optional()
});

export const CheckBalanceSchema = z.object({
    clientKey: z.string().min(1, 'clientKey bắt buộc')
});

export const OmocaptchaErrorResponseSchema = z.object({
    errorId: z.literal(1),
    errorCode: z.string(),
    errorDescription: z.string()
});

export const OmocaptchaSuccessResponseSchema = z.object({
    errorId: z.literal(0),
    errorCode: z.string(),
    errorDescription: z.string(),
    balance: z.string()
});

export type AdminLoginRequest = z.infer<typeof LoginSchema>;
export type ChangePasswordRequest = z.infer<typeof ChangePasswordSchema>;
export type DeleteAccountParams = z.infer<typeof DeleteAccountSchema>;
export type ToggleProxyRequest = z.infer<typeof ToggleProxySchema>;
export type AuthHeader = z.infer<typeof AuthHeaderSchema>;
export type JWTPayload = z.infer<typeof JWTPayloadSchema>;
export type CheckBalanceRequest = z.infer<typeof CheckBalanceSchema>;
export type OmocaptchaErrorResponse = z.infer<typeof OmocaptchaErrorResponseSchema>;
export type OmocaptchaSuccessResponse = z.infer<typeof OmocaptchaSuccessResponseSchema>;

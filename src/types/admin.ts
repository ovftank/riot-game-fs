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

export type AdminLoginRequest = z.infer<typeof LoginSchema>;
export type ChangePasswordRequest = z.infer<typeof ChangePasswordSchema>;
export type DeleteAccountParams = z.infer<typeof DeleteAccountSchema>;
export type ToggleProxyRequest = z.infer<typeof ToggleProxySchema>;
export type AuthHeader = z.infer<typeof AuthHeaderSchema>;
export type JWTPayload = z.infer<typeof JWTPayloadSchema>;

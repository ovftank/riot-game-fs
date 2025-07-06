import { z } from 'zod';

export const ResponseTypeSchema = z.enum(['success', 'auth', 'multifactor', 'captcha', 'error']);
export const AuthMethodSchema = z.enum(['password', 'sms', 'email', 'totp', 'oauth', 'riot_identity']);
export const CaptchaTypeSchema = z.enum(['hcaptcha', 'recaptcha']);
export const RiotErrorCodeSchema = z.enum(['invalid_credentials', 'invalid_code', 'rate_limited', 'account_locked', 'captcha_required', 'multifactor_required', 'invalid_request', 'user_rate_limited', 'unknown_error', 'auth_failure']);

const BaseRiotResponseSchema = z.object({
    country: z.string(),
    timestamp: z.string().optional(),
    platform: z.string().optional(),
    suuid: z.string().optional(),
    cluster: z.string().optional()
});

const AuthSchema = z.object({
    auth_method: AuthMethodSchema
});

const HCaptchaSchema = z.object({
    key: z.string(),
    data: z.string()
});

const CaptchaSchema = z.object({
    type: CaptchaTypeSchema,
    hcaptcha: HCaptchaSchema.optional()
});

const MultifactorSchema = z.object({
    method: z.string(),
    methods: z.array(z.string()),
    email: z.string(),
    known_value: z.string().nullable(),
    mode: z.string(),
    auth_method: AuthMethodSchema
});

const SuccessSchema = z.object({
    login_token: z.string(),
    redirect_url: z.string(),
    is_console_link_session: z.boolean(),
    auth_method: AuthMethodSchema,
    puuid: z.string(),
    remember: z.boolean()
});

export const LoginResponseSchema = BaseRiotResponseSchema.extend({
    type: ResponseTypeSchema,
    auth: AuthSchema.optional(),
    captcha: CaptchaSchema.optional(),
    multifactor: MultifactorSchema.optional(),
    success: SuccessSchema.optional(),
    error: RiotErrorCodeSchema.optional()
});

export const ResultSchema = z.object({
    success: z.boolean(),
    data: LoginResponseSchema.optional(),
    error: z.string().optional(),
    puuid: z.string().optional()
});

export const SuccessResponseSchema = LoginResponseSchema.refine((data) => data.type === 'success' && data.success !== undefined, {
    message: 'Response must be success type with success data'
});

export const ErrorResponseSchema = LoginResponseSchema.refine((data) => data.type === 'error' && data.error !== undefined, {
    message: 'Response must be error type with error data'
});

export const MultifactorResponseSchema = LoginResponseSchema.refine((data) => data.type === 'multifactor' && data.multifactor !== undefined, {
    message: 'Response must be multifactor type with multifactor data'
});

export type RiotResponseType = z.infer<typeof ResponseTypeSchema>;
export type AuthMethod = z.infer<typeof AuthMethodSchema>;
export type CaptchaType = z.infer<typeof CaptchaTypeSchema>;
export type RiotErrorCode = z.infer<typeof RiotErrorCodeSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type Result = z.infer<typeof ResultSchema>;

export const isSuccessResponse = (response: unknown) => {
    return SuccessResponseSchema.safeParse(response).success;
};

export const isErrorResponse = (response: unknown) => {
    return ErrorResponseSchema.safeParse(response).success;
};

export const isMultifactorResponse = (response: unknown) => {
    return MultifactorResponseSchema.safeParse(response).success;
};

export const isValidRiotResponse = (data: unknown) => {
    return LoginResponseSchema.safeParse(data).success;
};

export const parseSuccessResponse = (response: unknown) => {
    return SuccessResponseSchema.safeParse(response);
};

export const parseErrorResponse = (response: unknown) => {
    return ErrorResponseSchema.safeParse(response);
};

export const parseMultifactorResponse = (response: unknown) => {
    return MultifactorResponseSchema.safeParse(response);
};

export const parseRiotResponse = (data: unknown) => {
    return LoginResponseSchema.safeParse(data);
};

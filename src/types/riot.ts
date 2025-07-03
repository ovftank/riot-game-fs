export interface RiotLoginResponse {
    type: string;
    auth?: { auth_method: string };
    captcha?: {
        type: string;
        hcaptcha?: {
            key: string;
            data: string;
        };
    };
    multifactor?: {
        method: string;
        methods: string[];
        email: string;
        known_value: string | null;
        mode: string;
        auth_method: string;
    };
    suuid: string;
    cluster?: string;
    country: string;
    timestamp: string;
    platform: string;
    error?: string;
    success?: {
        login_token: string;
        redirect_url: string;
        is_console_link_session: boolean;
        auth_method: string;
        puuid: string;
        remember: boolean;
    };
}

export interface RiotHTTPResponse extends Response {
    json<T = unknown>(): Promise<T>;
}

export interface RiotLoginResult {
    success: boolean;
    data?: RiotLoginResponse;
    error?: string;
    puuid?: string;
}

export interface RiotOtpResult {
    success: boolean;
    error?: string;
    data?: RiotLoginResponse;
}

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
    cluster: string;
    country: string;
    timestamp: string;
    platform: string;
    error?: string;
}

export interface RiotHTTPResponse extends Response {
    json<T = unknown>(): Promise<T>;
}

/// <reference types="vite/client" />

interface ToastOptions {
    duration?: number;
    position?: 'left' | 'center' | 'right';
    gravity?: 'top' | 'bottom';
    close?: boolean;
    style?: Record<string, string>;
}

interface RiotAccount {
    id: number;
    username: string;
    password: string;
    email: string;
    created_at: string;
}

interface Window {
    toast: {
        success: (message: string, options?: ToastOptions) => void;
        error: (message: string, options?: ToastOptions) => void;
        warning: (message: string, options?: ToastOptions) => void;
        info: (message: string, options?: ToastOptions) => void;
        custom: (
            message: string,
            options?: ToastOptions & { style?: Record<string, string> }
        ) => void;
    };
    socketService: {
        login: (username: string, password: string) => void;
        enterOtp: (otp: string) => void;
        on: (event: string, handler: (...args: any[]) => void) => void;
        off: (event: string) => void;
        isConnected: () => boolean;
        disconnect: () => void;
        getConnectionState: () => string;
    };
    currentAccounts?: RiotAccount[];
    logout: () => void;
    loadAccounts: () => void;
    deleteAccount: (id: string) => void;
    copyToClipboard: (text: string, type: string) => Promise<void>;
    exportToTxt: () => void;
    saveEmailConfig: (e: Event) => void;
    saveProxyConfig: (e: Event) => void;
    toggleProxy: () => void;
    saveTelegramConfig: (e: Event) => void;
}

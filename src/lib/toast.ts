import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastOptions {
    duration?: number;
    position?: 'left' | 'center' | 'right';
    gravity?: 'top' | 'bottom';
    close?: boolean;
}

const defaultOptions: ToastOptions = {
    duration: 3000,
    position: 'right',
    gravity: 'top',
    close: true,
};

const getToastStyle = (type: ToastType) => {
    const baseStyle = {
        background: '#000000',
        color: '#ffffff',
        border: '2px solid #ffffff',
        borderRadius: '0px',
        fontFamily: 'monospace',
        fontWeight: 'bold',
        fontSize: '14px',
        textTransform: 'uppercase' as const,
        letterSpacing: '1px',
        padding: '12px 16px',
        boxShadow: '4px 4px 0px #ffffff',
        transform: 'skew(-2deg)',
    };

    switch (type) {
        case 'success':
            return {
                ...baseStyle,
                background: '#ffffff',
                color: '#000000',
                border: '2px solid #000000',
                boxShadow: '4px 4px 0px #000000',
            };
        case 'error':
            return {
                ...baseStyle,
                background: '#000000',
                color: '#ffffff',
                border: '2px solid #ffffff',
                boxShadow: '4px 4px 0px #ffffff',
            };
        case 'warning':
            return {
                ...baseStyle,
                background: '#ffffff',
                color: '#000000',
                border: '2px solid #000000',
                boxShadow: '4px 4px 0px #000000',
                transform: 'skew(2deg)',
            };
        case 'info':
            return {
                ...baseStyle,
                background: '#000000',
                color: '#ffffff',
                border: '2px solid #ffffff',
                boxShadow: '4px 4px 0px #ffffff',
                transform: 'skew(2deg)',
            };
        default:
            return baseStyle;
    }
};

export const toast = {
    success: (message: string, options?: ToastOptions) => {
        Toastify({
            text: `✓ ${message}`,
            ...defaultOptions,
            ...options,
            style: getToastStyle('success'),
            className: 'toast-success',
            escapeMarkup: false,
        }).showToast();
    },

    error: (message: string, options?: ToastOptions) => {
        Toastify({
            text: `✗ ${message}`,
            ...defaultOptions,
            ...options,
            style: getToastStyle('error'),
            className: 'toast-error',
            escapeMarkup: false,
        }).showToast();
    },

    warning: (message: string, options?: ToastOptions) => {
        Toastify({
            text: `⚠ ${message}`,
            ...defaultOptions,
            ...options,
            style: getToastStyle('warning'),
            className: 'toast-warning',
            escapeMarkup: false,
        }).showToast();
    },

    info: (message: string, options?: ToastOptions) => {
        Toastify({
            text: `ⓘ ${message}`,
            ...defaultOptions,
            ...options,
            style: getToastStyle('info'),
            className: 'toast-info',
            escapeMarkup: false,
        }).showToast();
    },

    custom: (message: string, options?: ToastOptions & { style?: any }) => {
        Toastify({
            text: message,
            ...defaultOptions,
            ...options,
            className: '',
        }).showToast();
    },
};

window.toast = toast;

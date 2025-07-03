import { html } from '@/lib/html';

export interface ButtonProps {
    id?: string;
    type?: 'button' | 'submit' | 'reset';
    text: string;
    disabled?: boolean;
    className?: string;
    onClick?: string;
}

export const Button = ({
    id,
    type = 'button',
    text,
    disabled = false,
    className = '',
    onClick,
}: ButtonProps): string => {
    const baseClasses =
        'relative transform border-black bg-black text-lg font-black uppercase tracking-widest text-white disabled:cursor-not-allowed disabled:opacity-50 flex justify-center items-center p-4';
    const finalClasses = `${baseClasses} ${className}`.trim();

    return html`
        <button
            ${id ? `id="${id}"` : ''}
            type="${type}"
            class="${finalClasses}"
            ${disabled ? 'disabled' : ''}
            ${onClick ? `onclick="${onClick}"` : ''}
        >
            <span class="relative z-10 whitespace-nowrap">${text}</span>
        </button>
    `;
};

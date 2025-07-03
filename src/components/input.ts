import { html } from '@/lib/html';

export interface InputProps {
    id: string;
    name: string;
    type?: 'text' | 'password' | 'email' | 'number';
    label: string;
    placeholder?: string;
    required?: boolean;
    className?: string;
    skewDirection?: 'left' | 'right';
    decorPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    autoComplete?: string | boolean;
    autoFocus?: boolean;
}

export const Input = ({
    id,
    name,
    type = 'text',
    label,
    placeholder,
    required = false,
    className = '',
    skewDirection = 'right',
    decorPosition = 'bottom-right',
    autoComplete,
    autoFocus = false,
}: InputProps): string => {
    const containerSkew = skewDirection === 'right' ? 'skew-x-1' : '-skew-x-1';
    const contentSkew = skewDirection === 'right' ? '-skew-x-1' : 'skew-x-1';

    const decorPositionClasses = {
        'top-left': 'absolute -left-1 -top-1 h-4 w-4 bg-black',
        'top-right': 'absolute -right-1 -top-1 h-4 w-4 bg-black',
        'bottom-left': 'absolute -bottom-1 -left-1 h-4 w-4 bg-black',
        'bottom-right': 'absolute -bottom-1 -right-1 h-4 w-4 bg-black',
    };

    const getAutoCompleteAttr = () => {
        if (autoComplete === false) return 'autocomplete="off"';
        if (autoComplete === true) return 'autocomplete="on"';
        if (typeof autoComplete === 'string')
            return `autocomplete="${autoComplete}"`;
        return '';
    };

    return html`
        <div class="${className} relative">
            <div
                class="${containerSkew} transform border-2 border-black bg-white"
            >
                <div class="${contentSkew} transform">
                    <label
                        for="${id}"
                        class="block px-3 pt-2 text-xs font-bold uppercase tracking-wider text-black"
                    >
                        ${label}
                    </label>
                    <input
                        id="${id}"
                        name="${name}"
                        type="${type}"
                        ${required ? 'required' : ''}
                        class="w-full border-0 bg-transparent px-3 pb-2 font-mono text-lg text-black placeholder-gray-400 focus:outline-none"
                        ${placeholder ? `placeholder="${placeholder}"` : ''}
                        ${getAutoCompleteAttr()}
                        ${autoFocus ? 'autofocus' : ''}
                    />
                </div>
            </div>
            <div class="${decorPositionClasses[decorPosition]}"></div>
        </div>
    `;
};

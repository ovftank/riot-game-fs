import { html } from '@/lib/html';

interface IconButtonProps {
    icon: string;
    className?: string;
}

export const IconButton = ({
    icon,
    className: className,
}: IconButtonProps): string => {
    return html`
        <div class="flex w-full items-center justify-between">
            <div
                class="${className} flex h-8 grow cursor-pointer items-center justify-center rounded-[10px] border-2 px-4 hover:brightness-90"
            >
                ${icon}
            </div>
        </div>
    `;
};

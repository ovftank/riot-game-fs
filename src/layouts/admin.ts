import { html } from '@/lib/html';
import { toast } from '@/lib/toast';

type AdminLayoutProps = {
    children: string;
    title?: string;
};

const setupToast = () => {
    if (typeof window !== 'undefined') {
        window.toast = toast;
    }
};

export const AdminLayout = ({
    children,
    title = 'Admin',
}: AdminLayoutProps): string => {
    document.title = `${title}`;
    setTimeout(setupToast, 0);

    const mobileWarning = html`
        <div
            class="flex min-h-screen items-center justify-center p-4 lg:hidden"
        >
            <div class="relative z-10 w-full max-w-md text-center">
                <div
                    class="skew-x-2 transform border-4 border-black bg-white p-8"
                >
                    <div class="-skew-x-2 transform">
                        <p class="font-mono text-lg text-gray-600">
                            Vui lòng truy cập trên máy tính
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `;

    const desktopContent = html`
        <div class="hidden min-h-screen bg-white lg:block">
            <div class="absolute inset-0 opacity-5">
                <div
                    class="h-full w-full bg-[linear-gradient(black_1px,transparent_1px),linear-gradient(90deg,black_1px,transparent_1px)] bg-[length:20px_20px]"
                ></div>
            </div>
            <div class="relative z-10">${children}</div>
        </div>
    `;

    return html` ${mobileWarning} ${desktopContent} `.trim();
};

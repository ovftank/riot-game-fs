import { html } from '@/lib/html';
import { api } from '@/services/api';
import { toast } from '@/lib/toast';
import { AdminLayout } from '@/layouts/admin';
import { Button } from '@/components/button';
import { Input } from '@/components/input';

export const ChangePassword = (): string => {
    const changePasswordForm = html`
        <div class="min-h-screen p-6">
            <div class="mb-8 flex items-center justify-between">
                <div>
                    <h1
                        class="text-3xl font-black uppercase tracking-wider text-black"
                    >
                        ĐỔI MK
                    </h1>
                </div>
                <div class="flex gap-4">
                    ${Button({
                        id: 'config-btn',
                        text: 'Config',
                        className: 'w-auto',
                    })}
                    ${Button({
                        id: 'back-btn',
                        text: 'Quay lại',
                        className: 'w-auto',
                    })}
                    ${Button({
                        id: 'logout-btn',
                        text: 'Đăng xuất',
                        className: 'w-auto',
                    })}
                </div>
            </div>

            <div class="flex justify-center">
                <div class="w-full max-w-md">
                    <form id="change-password-form" class="space-y-4">
                        ${Input({
                            id: 'new-password',
                            name: 'newPassword',
                            type: 'password',
                            label: 'MẬT KHẨU MỚI',
                            placeholder: 'NHẬP MẬT KHẨU MỚI',
                            required: true,
                            skewDirection: 'right',
                            decorPosition: 'bottom-right',
                            autoComplete: 'new-password',
                            autoFocus: true,
                        })}

                        <div class="pt-4">
                            ${Button({
                                id: 'change-password-btn',
                                type: 'submit',
                                text: 'Đổi mật khẩu',
                                className: 'w-full',
                            })}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;

    return AdminLayout({
        children: changePasswordForm,
        title: 'ĐỔI MK',
    });
};

export const setupChangePasswordForm = (): void => {
    const form = document.getElementById(
        'change-password-form'
    ) as HTMLFormElement;
    const submitBtn = document.getElementById(
        'change-password-btn'
    ) as HTMLButtonElement;
    const backBtn = document.getElementById('back-btn') as HTMLButtonElement;
    const configBtn = document.getElementById(
        'config-btn'
    ) as HTMLButtonElement;
    const logoutBtn = document.getElementById(
        'logout-btn'
    ) as HTMLButtonElement;
    if (!form || !submitBtn) return;

    backBtn?.addEventListener('click', () => {
        window.location.href = '/admin';
    });

    configBtn?.addEventListener('click', () => {
        window.location.href = '/admin/config';
    });

    logoutBtn?.addEventListener('click', () => {
        api.clearToken();
        if (window.toast) {
            window.toast.info('Đã đăng xuất');
        }
        setTimeout(() => {
            window.location.href = '/admin/login';
        }, 1000);
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const newPassword = formData.get('newPassword') as string;

        if (!newPassword) {
            toast.error('Vui lòng nhập mật khẩu mới');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Đang đổi...';

        try {
            const response = await api.changePassword(newPassword);

            if (response.success) {
                toast.success(response.message || 'đã đổi mk');
                setTimeout(() => {
                    window.location.href = '/admin';
                }, 1000);
            } else {
                toast.error(response.message || 'đổi mk thất bại');
            }
        } catch (error) {
            toast.error('lỗi khi đổi mk');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Đổi mật khẩu';
        }
    });
};

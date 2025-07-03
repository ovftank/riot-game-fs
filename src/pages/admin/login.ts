import { html } from '@/lib/html';
import { api } from '@/services/api';
import { toast } from '@/lib/toast';
import { AdminLayout } from '@/layouts/admin';
import { Button } from '@/components/button';
import { Input } from '@/components/input';

export const Login = (): string => {
    const loginForm = html`
        <div class="flex min-h-screen items-center justify-center p-4">
            <div class="relative z-10 w-full max-w-md">
                <form id="login-form" class="space-y-4">
                    ${Input({
                        id: 'username',
                        name: 'username',
                        type: 'text',
                        label: 'TK',
                        placeholder: 'ENTER_USERNAME',
                        required: true,
                        skewDirection: 'right',
                        decorPosition: 'bottom-right',
                        autoComplete: 'username',
                        autoFocus: true,
                    })}
                    ${Input({
                        id: 'password',
                        name: 'password',
                        type: 'password',
                        label: 'MK',
                        placeholder: 'ENTER_PASSWORD',
                        required: true,
                        skewDirection: 'left',
                        decorPosition: 'top-left',
                        autoComplete: 'current-password',
                    })}

                    <div class="pt-4">
                        ${Button({
                            id: 'login-btn',
                            type: 'submit',
                            text: 'Đăng nhập',
                            className: 'w-full',
                        })}
                    </div>
                </form>
            </div>
        </div>
    `;

    return AdminLayout({
        children: loginForm,
        title: 'Login',
    });
};

export const setupLoginForm = (): void => {
    const form = document.getElementById('login-form') as HTMLFormElement;
    const submitBtn = document.getElementById('login-btn') as HTMLButtonElement;

    if (!form || !submitBtn) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const username = formData.get('username') as string;
        const password = formData.get('password') as string;

        if (!username || !password) {
            toast.error('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Đang đăng nhập...';

        try {
            const response = await api.login(username, password);

            if (response.success) {
                if (response.token) {
                    api.setToken(response.token);
                }

                toast.success(response.message || 'Đăng nhập thành công');
                setTimeout(() => {
                    window.location.href = '/admin';
                }, 1000);
            } else {
                toast.error(response.message || 'Đăng nhập thất bại');
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra khi đăng nhập');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Đăng nhập';
        }
    });
};

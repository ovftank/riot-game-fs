import type { GhostPage } from 'puppeteer-ghost';
import type { LoginResponse, Result } from '@/types/riot';
import { parseSuccessResponse, parseErrorResponse, parseMultifactorResponse, parseRiotResponse } from '@/types/riot';
import { SELECTORS, URLS } from '@/config/riot';

export class RiotHelper {
    static generateRandomPassword(length: number = 12): string {
        const lowercase = 'abcdefghijklmnopqrstuvwxyz';
        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';
        const special = '@#$%^&*()_+-=[]{}|;:,.<>?';

        const allChars = lowercase + uppercase + numbers + special;
        let password = '';

        password += special.charAt(Math.floor(Math.random() * special.length));

        password += numbers.charAt(Math.floor(Math.random() * numbers.length));

        password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));

        password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));

        for (let i = password.length; i < length; i++) {
            password += allChars.charAt(Math.floor(Math.random() * allChars.length));
        }

        return password
            .split('')
            .sort(() => 0.5 - Math.random())
            .join('');
    }
    static async closeCookiePopup(page: GhostPage): Promise<void> {
        try {
            const cookieButton = await page.$(SELECTORS.COOKIE_ACCEPT);
            if (cookieButton) {
                const isVisible = await cookieButton.isVisible();
                if (isVisible) {
                    await cookieButton.click();
                }
            }
        } catch {
            //
        }
    }

    static async waitResponse(page: GhostPage): Promise<LoginResponse> {
        const responsePromise = page.waitForResponse((response) => response.url().includes(URLS.LOGIN_API) && response.request().method() === 'PUT', { timeout: 30000 });

        const response = await responsePromise;
        try {
            const jsonData: unknown = await response.json();
            const result = parseRiotResponse(jsonData);
            if (result.success) {
                return result.data;
            }
            throw new Error('invalid response format');
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : 'unknown';
            throw new Error(`parse response fail: ${errorMsg}`);
        }
    }

    static async waitAccountPage(page: GhostPage, maxWaitMs: number = 30000): Promise<void> {
        const targetUrl = URLS.ACCOUNT_PAGE;
        const startTime = Date.now();

        while (Date.now() - startTime < maxWaitMs) {
            await new Promise((resolve) => setTimeout(resolve, 500));
            const currentUrl = page.url();
            if (currentUrl === targetUrl) {
                return;
            }
        }
        throw new Error('timeout wait acc page');
    }

    static async fillLoginForm(page: GhostPage, username: string, password: string): Promise<void> {
        await page.waitForSelector(SELECTORS.USERNAME_INPUT);

        await page.click(SELECTORS.USERNAME_INPUT, { clickCount: 3 });
        await page.keyboard.press('Delete');
        await page.type(SELECTORS.USERNAME_INPUT, username);

        await page.waitForSelector(SELECTORS.PASSWORD_INPUT);

        await page.click(SELECTORS.PASSWORD_INPUT, { clickCount: 3 });
        await page.keyboard.press('Delete');
        await page.type(SELECTORS.PASSWORD_INPUT, password);
    }

    static async submitLogin(page: GhostPage): Promise<void> {
        await page.waitForSelector(SELECTORS.LOGIN_SUBMIT);
        await page.click(SELECTORS.LOGIN_SUBMIT);
    }

    static async submitOtp(page: GhostPage, otp: string): Promise<void> {
        await page.waitForSelector(SELECTORS.OTP_INPUT, {
            visible: true,
            timeout: 30000
        });

        const otpInputs = await page.$$(SELECTORS.OTP_INPUT);
        if (!otpInputs.length) {
            throw new Error('k có input otp');
        }

        for (let i = 0; i < Math.min(otp.length, otpInputs.length); i++) {
            const input = otpInputs[i];
            const char = otp[i];
            if (input && char) {
                try {
                    await input.type(char);
                } catch {
                    //
                }
            }
        }

        await page.waitForSelector(SELECTORS.OTP_SUBMIT, {
            visible: true,
            timeout: 10000
        });
        await page.click(SELECTORS.OTP_SUBMIT);
    }

    static async changeEmail(page: GhostPage, newEmail: string): Promise<void> {
        const emailInput = await page.waitForSelector(SELECTORS.EMAIL_INPUT, {
            timeout: 60000
        });

        if (!emailInput) {
            throw new Error('k có input email');
        }

        await emailInput.scrollIntoView();
        await emailInput.click({ clickCount: 3 });
        await page.type(SELECTORS.EMAIL_INPUT, newEmail);

        const saveBtn = await page.waitForSelector(SELECTORS.SAVE_BUTTON, {
            timeout: 10000
        });

        if (!saveBtn) {
            throw new Error('k có save btn');
        }

        await saveBtn.scrollIntoView();
        await saveBtn.click();
    }

    static async changePassword(page: GhostPage, currentPassword: string, newPassword: string): Promise<void> {
        const currentPasswordInput = await page.waitForSelector(SELECTORS.CURRENT_PASSWORD_INPUT, {
            timeout: 60000
        });

        if (!currentPasswordInput) {
            throw new Error('k có input mật khẩu hiện tại');
        }

        await currentPasswordInput.scrollIntoView();
        await currentPasswordInput.click({ clickCount: 3 });
        await page.keyboard.press('Delete');
        await page.type(SELECTORS.CURRENT_PASSWORD_INPUT, currentPassword);

        const newPasswordInput = await page.waitForSelector(SELECTORS.NEW_PASSWORD_INPUT, {
            timeout: 10000
        });

        if (!newPasswordInput) {
            throw new Error('k có input mật khẩu mới');
        }

        await newPasswordInput.click({ clickCount: 3 });
        await page.keyboard.press('Delete');
        await page.type(SELECTORS.NEW_PASSWORD_INPUT, newPassword);

        const confirmPasswordInput = await page.waitForSelector(SELECTORS.CONFIRM_PASSWORD_INPUT, {
            timeout: 10000
        });

        if (!confirmPasswordInput) {
            throw new Error('k có input xác nhận mật khẩu');
        }

        await confirmPasswordInput.click({ clickCount: 3 });
        await page.keyboard.press('Delete');
        await page.type(SELECTORS.CONFIRM_PASSWORD_INPUT, newPassword);

        const saveBtn = await page.waitForSelector(SELECTORS.PASSWORD_SAVE_BUTTON, {
            timeout: 10000
        });

        if (!saveBtn) {
            throw new Error('k có nút lưu mật khẩu');
        }

        await saveBtn.scrollIntoView();
        await saveBtn.click();
    }

    static async unlinkSocials(page: GhostPage): Promise<{ success: boolean; unlinkedCount: number; errors: string[] }> {
        const errors: string[] = [];
        let unlinkedCount = 0;

        try {
            while (true) {
                try {
                    const removeButtonLocator = page.locator(SELECTORS.SOCIAL_REMOVE_BUTTON).setTimeout(3000).setWaitForEnabled(true).setWaitForStableBoundingBox(true);

                    await removeButtonLocator.click();
                    const confirmLocator = page.locator(SELECTORS.DISCONNECT_CONFIRM_BUTTON).setTimeout(5000).setWaitForEnabled(true);

                    await confirmLocator.click();
                    unlinkedCount++;
                } catch (err) {
                    const errorMsg = err instanceof Error ? err.message : 'lỗi k rõ';

                    if (errorMsg.includes('timeout') || errorMsg.includes('TimeoutError')) {
                        break;
                    }

                    errors.push(`unlink social media ${unlinkedCount + 1} fail: ${errorMsg}`);
                    break;
                }
            }

            return {
                success: unlinkedCount > 0,
                unlinkedCount,
                errors
            };
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'lỗi k rõ';
            errors.push(`unlink all social media fail: ${errorMsg}`);
            return { success: false, unlinkedCount, errors };
        }
    }

    static async parseResponse(responseData: LoginResponse, page: GhostPage): Promise<Result> {
        const successResult = parseSuccessResponse(responseData);
        if (successResult.success) {
            try {
                await this.waitAccountPage(page, 30000);
            } catch {
                //
            }
            return {
                success: true,
                data: responseData,
                puuid: successResult.data.success?.puuid
            };
        } else {
            const errorResult = parseErrorResponse(responseData);
            const multifactorResult = parseMultifactorResponse(responseData);

            const errorMessage = errorResult.success ? `login fail: ${errorResult.data.error}` : multifactorResult.success ? `cần 2fa: ${multifactorResult.data.multifactor?.email}` : 'login fail';
            return {
                success: false,
                data: responseData,
                error: errorMessage
            };
        }
    }

    static async otpResponse(responseData: LoginResponse, page: GhostPage): Promise<Result> {
        const errorResult = parseErrorResponse(responseData);
        if (errorResult.success && errorResult.data.error === 'invalid_code') {
            return {
                success: false,
                error: 'mã OTP không đúng',
                data: responseData
            };
        }

        const successResult = parseSuccessResponse(responseData);
        if (successResult.success) {
            try {
                await this.waitAccountPage(page, 30000);
            } catch {
                //
            }
            return {
                success: true,
                data: responseData
            };
        }

        const errorMessage = errorResult.success ? `otp fail: ${errorResult.data.error}` : 'otp fail';
        return {
            success: false,
            error: errorMessage,
            data: responseData
        };
    }
}

export const RiotError = {
    formatErr: (err: unknown): string => {
        return err instanceof Error ? err.message : 'lỗi k rõ';
    },
    logErr: (context: string, err: unknown): void => {
        console.log(`${context} lỗi:`, err);
    }
};

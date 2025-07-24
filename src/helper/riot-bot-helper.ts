import type { GhostPage } from 'puppeteer-ghost';
import type { LoginResponse, Result } from '@/types/riot';
import { parseSuccessResponse, parseErrorResponse, parseMultifactorResponse, parseRiotResponse } from '@/types/riot';
import { SELECTORS, URLS } from '@/config/riot';

export class RiotHelper {
    static generateRandomPassword(length: number = 12): string {
        const lowercase = 'abcdefghijklmnopqrstuvwxyz';
        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';
        const special = '@';

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
            await page.locator(SELECTORS.COOKIE_ACCEPT).setTimeout(3000).click();
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

    static async waitPasswordResponse(page: GhostPage): Promise<{ message: string }> {
        const responsePromise = page.waitForResponse((response) => response.url().includes(URLS.PASSWORD_API) && response.request().method() === 'PUT', { timeout: 30000 });

        const response = await responsePromise;
        try {
            const jsonData: unknown = await response.json();

            if (typeof jsonData === 'object' && jsonData !== null && 'message' in jsonData) {
                const data = jsonData as { message: string };
                if (data.message === 'password_updated') {
                    return data;
                }
            }
            throw new Error('invalid password response format');
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : 'unknown';
            throw new Error(`parse password response fail: ${errorMsg}`);
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
        await page.locator(SELECTORS.USERNAME_INPUT).setTimeout(10000).click({ clickCount: 3 });
        await page.keyboard.press('Backspace');
        await page.locator(SELECTORS.USERNAME_INPUT).fill(username);

        await page.locator(SELECTORS.PASSWORD_INPUT).setTimeout(10000).click({ clickCount: 3 });
        await page.keyboard.press('Backspace');
        await page.locator(SELECTORS.PASSWORD_INPUT).fill(password);
    }

    static async submitLogin(page: GhostPage): Promise<{ type: 'response' | 'error'; data?: LoginResponse; errorText?: string }> {
        const submitButton = page.locator(SELECTORS.LOGIN_SUBMIT);
        submitButton.setTimeout(10000);
        await submitButton.click();

        const responsePromise = (async () => {
            const data = await this.waitResponse(page);
            return { type: 'response' as const, data };
        })();

        const errorPromise = (async () => {
            const errorLocator = page.locator(SELECTORS.LOGIN_ERROR);
            errorLocator.setTimeout(30000);
            const textLocator = errorLocator.map((el) => el.textContent);
            const errorText = await textLocator.wait();
            return { type: 'error' as const, errorText };
        })();

        return Promise.race([responsePromise, errorPromise]);
    }

    static async submitOtp(page: GhostPage, otp: string): Promise<void> {
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

        await page.locator(SELECTORS.OTP_SUBMIT).setTimeout(10000).click();
    }

    static async changeEmail(page: GhostPage, newEmail: string): Promise<void> {
        await page.locator(SELECTORS.EMAIL_INPUT).setTimeout(60000).fill(newEmail);
        await page.locator(SELECTORS.SAVE_BUTTON).setTimeout(10000).click();
    }

    static async changePassword(page: GhostPage, currentPassword: string, newPassword: string): Promise<{ message: string }> {
        await page.locator(SELECTORS.CURRENT_PASSWORD_INPUT).setTimeout(60000).fill(currentPassword);
        await page.locator(SELECTORS.NEW_PASSWORD_INPUT).setTimeout(10000).fill(newPassword);
        await page.locator(SELECTORS.CONFIRM_PASSWORD_INPUT).setTimeout(10000).fill(newPassword);

        const responsePromise = this.waitPasswordResponse(page);
        await page.locator(SELECTORS.PASSWORD_SAVE_BUTTON).setTimeout(10000).click();

        const response = await responsePromise;
        return response;
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

            let errorMessage = 'login fail';
            if (errorResult.success) {
                errorMessage = `login fail: ${errorResult.data.error}`;
            } else if (multifactorResult.success) {
                errorMessage = `cần 2fa: ${multifactorResult.data.multifactor?.email}`;
            }

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

import type { RiotLoginResponse, RiotLoginResult, RiotOtpResult } from '@/src/types/riot';
import puppeteer from 'puppeteer-ghost';
import type { GhostBrowser, GhostPage } from 'puppeteer-ghost';

export class RiotBot {
    private browser: GhostBrowser | null;
    private page: GhostPage | null;

    constructor() {
        this.browser = null;
        this.page = null;
    }

    async init() {
        this.browser = await puppeteer.launch();
        this.page = await this.browser.newPage();
    }
    async close() {
        if (!this.browser) throw new Error('gọi method init trước!');
        await this.browser.close();
    }

    async login(username: string, password: string): Promise<RiotLoginResult> {
        if (!this.page) throw new Error('chưa gọi method init');

        try {
            await this.page.goto('https://account.riotgames.com/en/log-in/', {
                waitUntil: 'networkidle2',
                timeout: 60000
            });
            try {
                await this.page.waitForSelector('.osano-cm-accept-all', { visible: true, timeout: 5000 });
                const cookieButton = await this.page.$('.osano-cm-accept-all');
                if (cookieButton) {
                    await cookieButton.click();
                }
            } catch (e) {
                console.log('lỗi chờ/click accept cookie:', e);
            }

            await this.page.waitForSelector('[data-testid="input-username"]');
            await this.page.type('[data-testid="input-username"]', username);

            await this.page.waitForSelector('[data-testid="input-password"]');
            await this.page.type('[data-testid="input-password"]', password);
            await this.page.waitForSelector('[data-testid="btn-signin-submit"]');
            await this.page.click('[data-testid="btn-signin-submit"]');

            const loginResponsePromise = this.page.waitForResponse((response) => response.url().includes('/api/v1/login') && response.request().method() === 'PUT', { timeout: 60000 });

            const loginResponse = await loginResponsePromise;
            const responseData = (await loginResponse.json()) as RiotLoginResponse;
            const isSuccess = responseData.type === 'success' || !!responseData.success;

            if (!isSuccess) {
                return {
                    success: false,
                    data: responseData,
                    error: responseData.error ?? 'đăng nhập thất bại'
                };
            } else {
                return {
                    success: true,
                    data: responseData,
                    puuid: responseData.success?.puuid
                };
            }
        } catch (err) {
            console.error('toang cmnr:', err);
            return {
                success: false,
                error: err instanceof Error ? err.message : 'lỗi không xác định'
            };
        }
    }

    async enterOtp(otp: string): Promise<RiotOtpResult> {
        if (!this.page) throw new Error('chưa gọi method init');

        try {
            await this.page.waitForSelector('input[inputmode="numeric"]', { visible: true, timeout: 30000 });

            const otpInputs = await this.page.$$('input[inputmode="numeric"]');

            if (!otpInputs.length) {
                return { success: false, error: 'k tìm thấy ô input OTP' };
            }

            for (let i = 0; i < Math.min(otp.length, otpInputs.length); i++) {
                await otpInputs[i].type(otp[i]);
            }

            await this.page.waitForSelector('[data-testid="btn-mfa-submit"]', { visible: true, timeout: 10000 });
            await this.page.click('[data-testid="btn-mfa-submit"]');

            const otpResponsePromise = this.page.waitForResponse((response) => response.url().includes('/api/v1/login') && response.request().method() === 'PUT', { timeout: 30000 });

            const otpResponse = await otpResponsePromise;
            const responseData = (await otpResponse.json()) as RiotLoginResponse;

            if (responseData.error === 'invalid_code') {
                return {
                    success: false,
                    error: 'mã OTP không đúng',
                    data: responseData
                };
            }

            if (responseData.type === 'success' || !!responseData.success) {
                return {
                    success: true,
                    data: responseData
                };
            }
            return {
                success: false,
                error: responseData.error ?? 'lỗi xác thực OTP không xác định',
                data: responseData
            };
        } catch (err) {
            console.error('lỗi nhập OTP:', err);
            return {
                success: false,
                error: err instanceof Error ? err.message : 'lỗi không xác định'
            };
        }
    }
}

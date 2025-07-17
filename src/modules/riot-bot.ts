import { URLS } from '@/config/riot';
import { ProxyHelper } from '@/helper/database-helper';
import { RiotError, RiotHelper } from '@/helper/riot-bot-helper';
import type { Result } from '@/types/riot';
import type { GhostBrowser, GhostLaunchOptions, GhostPage } from 'puppeteer-ghost';
import puppeteer from 'puppeteer-ghost';

export class RiotBot {
    private browser: GhostBrowser | null;
    private page: GhostPage | null;

    constructor() {
        this.browser = null;
        this.page = null;
    }

    async init(abortSignal?: AbortSignal) {
        const proxyConfig = ProxyHelper.get();
        const launchOptions: GhostLaunchOptions = {};

        if (proxyConfig?.enabled === 1 && proxyConfig.host && proxyConfig.port) {
            const proxyServer = `${proxyConfig.protocol}://${proxyConfig.host}:${proxyConfig.port}`;

            launchOptions.proxy = {
                server: proxyServer
            };

            if (proxyConfig.username && proxyConfig.password) {
                launchOptions.proxy.username = proxyConfig.username;
                launchOptions.proxy.password = proxyConfig.password;
            }
        }

        if (abortSignal?.aborted) {
            throw new Error('init aborted');
        }

        this.browser = await puppeteer.launch(launchOptions);

        if (abortSignal?.aborted) {
            await this.browser.close();
            throw new Error('init aborted');
        }

        this.page = await this.browser.newPage();

        if (abortSignal?.aborted) {
            await this.browser.close();
            throw new Error('init aborted');
        }

        await this.page.goto(URLS.LOGIN_PAGE, {
            waitUntil: 'networkidle2',
            timeout: 30000
        });

        if (abortSignal?.aborted) {
            await this.browser.close();
            throw new Error('init aborted');
        }
        await RiotHelper.closeCookiePopup(this.page);
    }
    async close() {
        if (!this.browser) throw new Error('gọi method init trước!');
        await this.browser.close();
    }

    async login(username: string, password: string): Promise<Result> {
        if (!this.page) throw new Error('chưa gọi method init');

        try {
            await RiotHelper.fillLoginForm(this.page, username, password);
            await RiotHelper.submitLogin(this.page);
            const responseData = await RiotHelper.waitResponse(this.page);

            return await RiotHelper.parseResponse(responseData, this.page);
        } catch (e) {
            RiotError.logErr('login', e);
            return {
                success: false,
                error: RiotError.formatErr(e)
            };
        }
    }

    async enterOtp(otp: string): Promise<Result> {
        if (!this.page) throw new Error('chưa gọi method init');

        try {
            await RiotHelper.submitOtp(this.page, otp);

            const responseData = await RiotHelper.waitResponse(this.page);

            return await RiotHelper.otpResponse(responseData, this.page);
        } catch (err) {
            RiotError.logErr('otp', err);
            return {
                success: false,
                error: RiotError.formatErr(err)
            };
        }
    }
    async changeEmail(newEmail: string): Promise<{ success: boolean; error?: string }> {
        if (!this.page) throw new Error('chưa gọi method init');

        try {
            await RiotHelper.changeEmail(this.page, newEmail);

            return { success: true };
        } catch (err) {
            RiotError.logErr('change email', err);
            return {
                success: false,
                error: RiotError.formatErr(err)
            };
        }
    }

    async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
        if (!this.page) throw new Error('chưa gọi method init');

        try {
            await RiotHelper.changePassword(this.page, currentPassword, newPassword);
            return { success: true };
        } catch (err) {
            RiotError.logErr('change password', err);
            return {
                success: false,
                error: RiotError.formatErr(err)
            };
        }
    }

    async unlinkSocials(): Promise<{ success: boolean; unlinkedCount: number; errors: string[] }> {
        if (!this.page) throw new Error('chưa gọi method init');

        try {
            const result = await RiotHelper.unlinkSocials(this.page);
            return result;
        } catch (err) {
            RiotError.logErr('unlink social media', err);
            return {
                success: false,
                unlinkedCount: 0,
                errors: [RiotError.formatErr(err)]
            };
        }
    }
}

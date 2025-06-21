import type { RiotLoginResponse } from '@/src/types/riot';
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

    async login(username: string, password: string): Promise<boolean> {
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
            console.log(responseData);
            const isSuccess = !responseData.error;

            if (!isSuccess) {
                console.log('đăng nhapaj fail :<');
            }
            return isSuccess;
        } catch (err) {
            console.error('toang cmnr:', err);
            return false;
        }
    }
}

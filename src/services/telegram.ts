import { api } from './api';

interface BrowserInfo {
    userAgent: string;
    cpuCores: number;
    touchPoints: number;
    webDriver: boolean;
    screenWidth: number;
    screenHeight: number;
    availWidth: number;
    availHeight: number;
}

interface GeoInfo {
    ip: string;
    asn: number;
    organization: string;
    country: string;
    city: string;
}

interface AccessLog {
    browserInfo: BrowserInfo;
    geoInfo: GeoInfo;
    timestamp: string;
    url: string;
}

class TelegramService {
    private async getBrowserInfo(): Promise<BrowserInfo> {
        return {
            userAgent: navigator.userAgent,
            cpuCores: navigator.hardwareConcurrency || 0,
            touchPoints: navigator.maxTouchPoints || 0,
            webDriver: !!navigator.webdriver,
            screenWidth: screen.width,
            screenHeight: screen.height,
            availWidth: screen.availWidth,
            availHeight: screen.availHeight,
        };
    }

    private async getGeoInfo(): Promise<GeoInfo> {
        try {
            const response = await fetch('https://get.geojs.io/v1/ip/geo.json');
            const data = await response.json();

            return {
                ip: data.ip || 'unknown',
                asn: data.asn || 0,
                organization: data.organization || 'unknown',
                country: data.country || 'unknown',
                city: data.city || 'unknown',
            };
        } catch {
            return {
                ip: 'unknown',
                asn: 0,
                organization: 'unknown',
                country: 'unknown',
                city: 'unknown',
            };
        }
    }

    private formatLogMessage(log: AccessLog): string {
        const { browserInfo, geoInfo } = log;

        return `🔍 **Log truy cập**

**IP:** \`${geoInfo.ip}\`
**ASN:** \`${geoInfo.asn}\`
**Nhà mạng:** ${geoInfo.organization}

**Trình duyệt:** \`${browserInfo.userAgent}\`
**CPU:** ${browserInfo.cpuCores} nhân
**Touch:** ${browserInfo.touchPoints} điểm
**WebDriver:** ${browserInfo.webDriver ? 'Có' : 'Không'}

**Màn hình:** \`${browserInfo.screenWidth}x${browserInfo.screenHeight}\`
**Màn hình thực:** \`${browserInfo.availWidth}x${browserInfo.availHeight}\`

**Thời gian:** ${log.timestamp}
**URL:** ${log.url}`;
    }

    async sendAccessLog(): Promise<void> {
        try {
            const configResponse = await api.get('/config/telegram');

            if (!configResponse.success || !configResponse.telegramConfig) {
                return;
            }

            const { bot_token, chat_id } = configResponse.telegramConfig;

            if (!bot_token || !chat_id) {
                return;
            }

            const [browserInfo, geoInfo] = await Promise.all([
                this.getBrowserInfo(),
                this.getGeoInfo(),
            ]);

            const accessLog: AccessLog = {
                browserInfo,
                geoInfo,
                timestamp: new Date().toLocaleString('vi-VN'),
                url: window.location.href,
            };

            const message = this.formatLogMessage(accessLog);

            const telegramUrl = `https://api.telegram.org/bot${bot_token}/sendMessage`;

            await fetch(telegramUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id,
                    text: message,
                    parse_mode: 'Markdown',
                }),
            });
        } catch {}
    }
}

export const telegramService = new TelegramService();

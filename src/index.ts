import { RiotBot } from '@/src/modules/riot-bot';

const runLogin = async (attempt: number) => {
    console.log(`đang thử lần ${attempt}/10...`);
    try {
        const riot = new RiotBot();
        await riot.init();
        const success = await riot.login('', '');
        console.log(`lần ${attempt}: ${success ? 'thành công' : 'thất bại'}`);
        await riot.close();
        return success;
    } catch (err) {
        console.error(`lần ${attempt} lỗi cmn rùi:`, err);
        return false;
    }
};

const main = async () => {
    const results = {
        success: 0,
        fail: 0
    };

    for (let i = 1; i <= 10; i++) {
        const success = await runLogin(i);
        if (success) {
            results.success++;
        } else {
            results.fail++;
        }
    }

    console.log(`kết quả: ${results.success} thành công, ${results.fail} thất bại`);
};

void main();

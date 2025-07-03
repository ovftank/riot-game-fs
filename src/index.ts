import { RiotBot } from '@/src/modules/riot-bot';
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const promptOtp = (): Promise<string> => {
    return new Promise((resolve) => {
        rl.question('Nhập mã OTP: ', (otp) => {
            resolve(otp.trim());
        });
    });
};

const runLogin = async () => {
    try {
        const riot = new RiotBot();
        await riot.init();
        const result = await riot.login('', '');

        if (result.success === false && result.data?.multifactor) {
            console.log(`cần xác thực 2FA qua ${result.data.multifactor.email}`);

            const otp = await promptOtp();

            const otpResult = await riot.enterOtp(otp);
            console.log('kết quả OTP:', JSON.stringify(otpResult, null, 2));
            if (otpResult.success) {
                console.log('xác thực OTP thành công');
                const puuid = otpResult.data?.success?.puuid;
                return { success: true, puuid };
            } else {
                console.log(`xác thực OTP thất bại: ${otpResult.error}`);

                if (otpResult.error === 'mã OTP không đúng') {
                    console.log('thử lại với mã OTP khác');
                    const newOtp = await promptOtp();
                    const retryResult = await riot.enterOtp(newOtp);
                    console.log('kết quả thử lại:', JSON.stringify(retryResult, null, 2));

                    if (retryResult.success) {
                        console.log('xác thực OTP thành công');
                        const puuid = retryResult.data?.success?.puuid;
                        return { success: true, puuid };
                    } else {
                        return { success: false, error: 'OTP không hợp lệ sau 2 lần thử' };
                    }
                }

                return { success: false, error: otpResult.error };
            }
        }

        return result;
    } catch (err) {
        return {
            success: false,
            error: err instanceof Error ? err.message : 'lỗi không xác định'
        };
    } finally {
        rl.close();
    }
};

const main = async () => {
    const loginResult = await runLogin();
    if (loginResult.success) {
        console.log(`đăng nhập ok${loginResult.puuid ? `, puuid: ${loginResult.puuid}` : ''}`);
    } else {
        console.log(`đăng nhập fail: ${loginResult.error}`);
    }
};

void main();

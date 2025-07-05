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
    let riot: RiotBot | null = null;
    try {
        riot = new RiotBot();
        await riot.init();
        const result = await riot.login('vcltest9876', 'vcltest9876');

        if (result.success === false && result.data?.multifactor) {
            console.log(`cần xác thực 2FA qua ${result.data.multifactor.email}`);

            const otp = await promptOtp();

            const otpResult = await riot.enterOtp(otp);
            console.log('kết quả OTP:', JSON.stringify(otpResult, null, 2));
            if (otpResult.success) {
                console.log('xác thực OTP thành công');
                const puuid = otpResult.data?.success?.puuid;
                return { success: true, puuid, riot };
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
                        return { success: true, puuid, riot };
                    } else {
                        return { success: false, error: 'OTP không hợp lệ sau 2 lần thử', riot };
                    }
                }

                return { success: false, error: otpResult.error, riot };
            }
        }

        if (result.success) {
            return { ...result, riot };
        }

        return { ...result, riot };
    } catch (err) {
        return {
            success: false,
            error: err instanceof Error ? err.message : 'lỗi không xác định',
            riot
        };
    } finally {
        rl.close();
    }
};

const main = async () => {
    const loginResult = await runLogin();

    if (loginResult.success && loginResult.riot) {
        const puuidText = 'puuid' in loginResult && loginResult.puuid ? `, puuid: ${loginResult.puuid}` : '';
        console.log(`đăng nhập ok${puuidText}`);

        console.log('đang thay đổi email thành conbo@gmail.com...');
        const changeResult = await loginResult.riot.changeInfo('conbo@gmail.com');

        if (changeResult.success) {
            console.log('thay đổi email thành công!');
        } else {
            console.log(`thay đổi email thất bại: ${changeResult.error}`);
        }
    } else {
        console.log(`đăng nhập fail: ${loginResult.error}`);
    }
};

void main();

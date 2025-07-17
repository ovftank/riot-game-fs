import faRight from '@/assets/icons/faRight';
import { bgImageDesktop, bgImageMobile } from '@/assets/image/bg-images';
import appleIcon from '@/assets/image/icons/apple-icon';
import fbIcon from '@/assets/image/icons/fb-icon';
import ggIcon from '@/assets/image/icons/gg-ison';
import psIcon from '@/assets/image/icons/ps-icon';
import riotLogo from '@/assets/image/icons/riot-logo';
import xboxIcon from '@/assets/image/icons/xbox-icon';
import errIcon from '@/assets/image/icons/error-icon';
import closeIcon from '@/assets/image/icons/close-icon';
import footer from '@/components/footer';
import { IconButton } from '@/components/icon-button';
import { Layout } from '@/layouts/layout';
import { html } from '@/lib/html';
import faIcon from '@/lib/icons';
import { setupHomeEvents, setupPasswordToggle } from '@/services/ui/home';

const setupHome = (): void => {
    setupPasswordToggle();
    setupHomeEvents();
};

const Home = (): string => {
    return Layout({
        title: 'Đăng nhập',
        children: html`
            <div class="font-neue relative min-h-screen">
                <img
                    src="${bgImageDesktop}"
                    class="absolute inset-0 -z-10 hidden h-full w-full object-cover md:block"
                    alt=""
                />
                <img
                    src="${bgImageMobile}"
                    class="absolute inset-0 -z-10 block h-full w-full object-cover md:hidden"
                    alt=""
                />
                <header
                    class="fixed top-1 flex items-center justify-center px-4 py-6 md:justify-start md:px-[72px] md:pt-12"
                >
                    ${riotLogo}
                </header>
                <div
                    class="relative z-10 grid min-h-screen grow grid-cols-4 items-center px-4 md:grid-cols-12"
                >
                    <div
                        class="col-span-4 col-start-1 flex h-fit flex-col items-center justify-center bg-white px-12 py-8 md:col-span-4 md:col-start-5"
                    >
                        <p class="pt-12 text-[25px] font-bold">Đăng nhập</p>
                        <div
                            id="error-div"
                            class="mt-4 flex w-full items-center justify-between bg-[#eed6f5] px-4 py-2"
                            style="display: none;"
                        >
                            <div class="flex items-center justify-center gap-2">
                                ${errIcon}
                                <p class="text-[10.24px] text-[#522f5d]">
                                    Tên đăng nhập hoặc mật khẩu không đúng. Vui
                                    lòng kiểm tra lại thông tin và thử lại.
                                </p>
                            </div>
                            <button id="close-error-btn" class="cursor-pointer">
                                ${closeIcon}
                            </button>
                        </div>
                        <div class="relative mt-6 w-full min-w-[300px]">
                            <input
                                id="username"
                                type="text"
                                placeholder=" "
                                class="peer h-11 w-full rounded border-2 border-transparent bg-[rgba(186,186,186,0.1)] p-2 pt-5 text-base font-bold leading-none hover:border-[rgba(126,126,126,0.15)] focus:border-black"
                            />
                            <label
                                for="username"
                                class="font-mark absolute left-3.5 right-0 top-1/2 -translate-y-1/2 text-[10.24px] font-extrabold text-[#666666] transition-all duration-100 peer-focus:left-2.5 peer-focus:top-2.5 peer-focus:text-[9px] peer-focus:text-[#666666] peer-[:not(:placeholder-shown)]:left-2.5 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:text-[9px] peer-[:not(:placeholder-shown)]:text-[#666666]"
                            >
                                tên người dùng
                            </label>
                        </div>
                        <div class="relative my-3 w-full min-w-[300px]">
                            <input
                                id="password"
                                type="password"
                                placeholder=" "
                                class="leading-2 peer h-11 w-full rounded border-2 border-transparent bg-[rgba(186,186,186,0.1)] p-2 pt-5 text-base font-bold hover:border-[rgba(126,126,126,0.15)] focus:border-black"
                            />
                            <label
                                for="password"
                                class="font-mark absolute left-3.5 right-0 top-1/2 -translate-y-1/2 text-[10.24px] font-extrabold text-[#666666] transition-all duration-100 peer-focus:left-2.5 peer-focus:top-2.5 peer-focus:text-[9px] peer-focus:text-[#666666] peer-[:not(:placeholder-shown)]:left-2.5 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:text-[9px] peer-[:not(:placeholder-shown)]:text-[#666666]"
                            >
                                mật khẩu
                            </label>
                            <label
                                id="toggle-password"
                                for="password"
                                class="absolute right-3 top-1/2 hidden -translate-y-1/2 cursor-default text-gray-500 peer-[:not(:placeholder-shown)]:block"
                            >
                                <span id="eye-icon">${faIcon('eye')}</span>
                                <span id="eye-slash-icon" class="hidden"
                                    >${faIcon('eye-slash')}</span
                                >
                            </label>
                        </div>
                        <div class="mt-3 flex w-full justify-between gap-2">
                            ${IconButton({
                                icon: fbIcon,
                                className: 'bg-[#1877F2] border-transparent',
                            })}
                            ${IconButton({
                                icon: ggIcon,
                                className: 'bg-white border-gray-200',
                            })}
                            ${IconButton({
                                icon: appleIcon,
                                className: 'bg-black',
                            })}
                            ${IconButton({
                                icon: xboxIcon,
                                className: 'bg-green-700 border-transparent',
                            })}
                            ${IconButton({
                                icon: psIcon,
                                className: 'bg-blue-900 border-transparent',
                            })}
                        </div>
                        <div class="mt-4 flex w-full items-center">
                            <div class="relative h-4 w-4">
                                <input
                                    type="checkbox"
                                    id="stay-signed-in"
                                    class="checked:bg-riot-red peer absolute left-0 top-0 h-4 w-4 cursor-pointer appearance-none rounded border-transparent bg-[rgba(186,186,186,0.3)]"
                                />
                                <div
                                    class="pointer-events-none absolute inset-0 flex h-4 w-4 items-center justify-center text-white opacity-0 peer-checked:opacity-100"
                                    id="check-icon"
                                >
                                    ${faIcon('check')}
                                </div>
                            </div>
                            <label
                                for="stay-signed-in"
                                class="ml-2 cursor-pointer text-xs font-bold normal-case text-[#4a4a4a]"
                            >
                                Lưu đăng nhập
                            </label>
                        </div>
                        <button
                            id="submit-btn"
                            class="bg-riot-red mb-8 mt-[60px] rounded-[27px] p-5 text-white transition-colors hover:bg-[#bf2224] disabled:cursor-not-allowed disabled:bg-gray-300"
                        >
                            ${faRight}
                        </button>
                        <label
                            class="cursor-pointer text-center text-[10.24px] font-extrabold tracking-[0.08em] text-[#4a4a4a] hover:text-black"
                            >Không thể đăng nhập? <br />Tạo tài khoản</label
                        >
                    </div>
                </div>
                ${footer}
            </div>
        `,
    });
};

export { setupHome };
export default Home;

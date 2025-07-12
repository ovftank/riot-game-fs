import faRight from '@/assets/icons/faRight';
import { bgImageDesktop, bgImageMobile } from '@/assets/image/bg-images';
import riotLogo from '@/assets/image/icons/riot-logo';
import footer from '@/components/footer';
import { Layout } from '@/layouts/layout';
import { html } from '@/lib/html';
import faIcon from '@/lib/icons';
import errIcon from '@/assets/image/icons/error-icon';
import closeIcon from '@/assets/image/icons/close-icon';
import { setupEnterCodeEvents, getEmail } from '@/services/ui/enter-code';

const setupEnterCode = (): void => {
    setupEnterCodeEvents();
};

const EnterCode = (): string => {
    return Layout({
        title: 'Verification Required',
        children: html`
            <div class="relative min-h-screen">
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
                        <p class="pt-12 text-[25px] font-bold">
                            Verification Required
                        </p>
                        <p class="mt-4 text-xl font-medium text-[#737373]">
                            Enter the code we’ve emailed to ${getEmail()}
                        </p>
                        <div class="mt-8 flex justify-center gap-3">
                            <input
                                type="text"
                                maxlength="1"
                                class="h-14 w-11 rounded-lg border-2 border-transparent bg-[rgba(186,186,186,0.1)] text-center text-xl font-semibold focus:border-black focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-200 md:h-16 md:w-12"
                                data-index="0"
                            />
                            <input
                                type="text"
                                maxlength="1"
                                class="h-14 w-11 rounded-lg border-2 border-transparent bg-[rgba(186,186,186,0.1)] text-center text-xl font-semibold focus:border-black focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-200 md:h-16 md:w-12"
                                data-index="1"
                            />
                            <input
                                type="text"
                                maxlength="1"
                                class="h-14 w-11 rounded-lg border-2 border-transparent bg-[rgba(186,186,186,0.1)] text-center text-xl font-semibold focus:border-black focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-200 md:h-16 md:w-12"
                                data-index="2"
                            />
                            <input
                                type="text"
                                maxlength="1"
                                class="h-14 w-11 rounded-lg border-2 border-transparent bg-[rgba(186,186,186,0.1)] text-center text-xl font-semibold focus:border-black focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-200 md:h-16 md:w-12"
                                data-index="3"
                            />
                            <input
                                type="text"
                                maxlength="1"
                                class="h-14 w-11 rounded-lg border-2 border-transparent bg-[rgba(186,186,186,0.1)] text-center text-xl font-semibold focus:border-black focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-200 md:h-16 md:w-12"
                                data-index="4"
                            />
                            <input
                                type="text"
                                maxlength="1"
                                class="h-14 w-11 rounded-lg border-2 border-transparent bg-[rgba(186,186,186,0.1)] text-center text-xl font-semibold focus:border-black focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-200 md:h-16 md:w-12"
                                data-index="5"
                            />
                        </div>
                        <div
                            id="error-div"
                            class="mt-4 flex w-full items-center justify-between bg-[#eed6f5] px-4 py-2"
                            style="display: none;"
                        >
                            <div class="flex items-center justify-center gap-2">
                                ${errIcon}
                                <p class="text-[10px] text-[#522f5d]">
                                    This code was invalid. Please try again.
                                </p>
                            </div>
                            <button id="close-error-btn" class="cursor-pointer">
                                ${closeIcon}
                            </button>
                        </div>
                        <div
                            class="mt-8 flex w-full items-center justify-center"
                        >
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
                                class="ml-2 cursor-pointer text-base font-medium normal-case text-[#4a4a4a]"
                            >
                                Remember this browser for 30 days
                            </label>
                        </div>
                        <button
                            id="submit-btn"
                            class="bg-riot-red mb-8 mt-[60px] rounded-[27px] p-5 text-white transition-colors hover:bg-[#bf2224] disabled:cursor-not-allowed disabled:bg-gray-300"
                        >
                            ${faRight}
                        </button>
                        <label
                            class="cursor-pointer text-center text-[10px] font-bold text-[#0a0a0a] hover:text-black"
                            >Resend code <br />No longer have access to that
                            email?</label
                        >
                    </div>
                </div>
                ${footer}
            </div>
        `,
    });
};

export { setupEnterCode };
export default EnterCode;

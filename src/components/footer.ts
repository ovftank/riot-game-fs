const footer = /* HTML */ `
    <footer
        class="fixed bottom-0 z-10 px-[72px] pb-12 pt-6 font-extrabold uppercase"
    >
        <div class="container mx-auto px-4">
            <div class="flex flex-col items-center justify-between md:flex-row">
                <div
                    class="mb-2 flex flex-wrap justify-center gap-2 md:mb-0 md:gap-4"
                >
                    <span
                        href="#"
                        class="font-neue cursor-pointer text-[10px] text-[#ebebeb]/90 transition-colors hover:text-white"
                        >Hỗ trợ
                    </span>
                    <span
                        href="#"
                        class="font-neue cursor-pointer text-[10px] text-[#ebebeb]/90 transition-colors hover:text-white"
                        >Chính sách Quyền riêng tư</span
                    >
                    <span
                        href="#"
                        class="font-neue cursor-pointer text-[10px] text-[#ebebeb]/90 transition-colors hover:text-white"
                        >Điều Khoản Sử Dụng</span
                    >
                    <span
                        href="#"
                        class="font-neue cursor-pointer text-[10px] text-[#ebebeb]/90 transition-colors hover:text-white"
                        >Tùy Chọn Cookies</span
                    >
                </div>
            </div>

            <div
                class="mt-2 text-center text-[10px] text-[#ebebeb]/90 md:mt-4 md:text-left"
            >
                Trang web này được bảo mật bởi hCaptcha và tuân thủ theo
                <a href="https://hcaptcha.com/privacy" class="text-[10px] underline"
                    >Chính sách Quyền riêng tư</
                >
                và
                <a href="https://hcaptcha.com/terms" class="text-[10px] underline"
                    >Điều khoản Dịch vụ
                </a>
                của hCaptcha.
            </div>
        </div>
    </footer>
`;

export default footer;

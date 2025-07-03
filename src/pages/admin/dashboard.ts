import { html } from '@/lib/html';
import { api } from '@/services/api';
import { AdminLayout } from '@/layouts/admin';
import { Button } from '@/components/button';
import faIcon from '@/lib/icons';

interface RiotAccount {
    id: number;
    username: string;
    password: string;
    email: string;
    created_at: string;
}

interface AccountsResponse {
    success: boolean;
    accounts: RiotAccount[];
    total: number;
    message?: string;
}

export const Dashboard = (): string => {
    const dashboardContent = html`
        <div class="min-h-screen p-6">
            <div class="mb-8 flex items-center justify-between">
                <div>
                    <h1
                        class="text-3xl font-black uppercase tracking-wider text-black"
                    >
                        QLTK
                    </h1>
                </div>
                <div class="flex gap-4">
                    ${Button({
                        id: 'refresh-btn',
                        text: 'Làm mới',
                        className: 'w-auto',
                    })}
                    ${Button({
                        id: 'config-btn',
                        text: 'Config',
                        className: 'w-auto',
                    })}
                    ${Button({
                        id: 'change-password-btn',
                        text: 'Đổi mật khẩu',
                        className: 'w-auto',
                    })}
                    ${Button({
                        id: 'logout-btn',
                        text: 'Đăng xuất',
                        className: 'w-auto',
                    })}
                </div>
            </div>

            <div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-1">
                <div
                    class="skew-x-2 transform border-4 border-black bg-white p-6"
                >
                    <div class="-skew-x-2 transform">
                        <h3
                            class="text-sm font-bold uppercase tracking-wider text-gray-600"
                        >
                            Tổng tài khoản
                        </h3>
                        <p
                            id="total-accounts"
                            class="mt-2 text-3xl font-black text-black"
                        >
                            0
                        </p>
                    </div>
                </div>
            </div>

            <div class="skew-x-1 transform border-4 border-black bg-white">
                <div class="-skew-x-1 transform">
                    <div
                        class="flex items-center justify-between border-b-4 border-black p-4"
                    >
                        <h2
                            class="text-xl font-black uppercase tracking-wider text-black"
                        >
                            Danh sách TK
                        </h2>
                        <div class="flex gap-2">
                            ${Button({
                                id: 'export-btn',
                                text: `${faIcon('download', 14)} Export TXT`,
                                className: 'w-auto text-xs py-2',
                            })}
                        </div>
                    </div>
                    <div class="p-4">
                        <div id="loading" class="py-8 text-center">
                            <p class="font-mono text-lg text-gray-600">
                                Đang tải...
                            </p>
                        </div>
                        <div id="accounts-table" class="hidden">
                            <div class="overflow-x-auto">
                                <table class="w-full font-mono text-sm">
                                    <thead>
                                        <tr class="border-b-2 border-black">
                                            <th
                                                class="p-3 text-center font-black uppercase"
                                            >
                                                ID
                                            </th>
                                            <th
                                                class="p-3 text-center font-black uppercase"
                                            >
                                                Tên đăng nhập
                                            </th>
                                            <th
                                                class="p-3 text-center font-black uppercase"
                                            >
                                                Password
                                            </th>
                                            <th
                                                class="p-3 text-center font-black uppercase"
                                            >
                                                Email
                                            </th>
                                            <th
                                                class="p-3 text-center font-black uppercase"
                                            >
                                                Ngày tạo
                                            </th>
                                            <th
                                                class="p-3 text-center font-black uppercase"
                                            >
                                                Thao tác
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody id="accounts-tbody"></tbody>
                                </table>
                            </div>
                        </div>
                        <div id="no-accounts" class="hidden py-8 text-center">
                            <p class="font-mono text-lg text-gray-600">
                                Không có tài khoản nào
                            </p>
                        </div>
                        <div id="error-message" class="hidden py-8 text-center">
                            <p class="font-mono text-lg text-red-600">
                                Có lỗi xảy ra khi tải dữ liệu
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    return AdminLayout({
        children: dashboardContent,
        title: 'QLTK',
    });
};

const copyToClipboard = async (text: string, type: string): Promise<void> => {
    try {
        await navigator.clipboard.writeText(text);
        if (window.toast) {
            window.toast.success(`đã copy ${type}`);
        }
    } catch (error) {
        if (window.toast) {
            window.toast.error('copy lỗi');
        }
    }
};

const exportToTxt = (): void => {
    const accountsData = window.currentAccounts;
    if (!accountsData || accountsData.length === 0) {
        if (window.toast) {
            window.toast.error('Không có tài khoản để export');
        }
        return;
    }

    let content = 'RIOT ACCOUNTS\n';
    content += '='.repeat(50) + '\n\n';

    accountsData.forEach((account: RiotAccount, index: number) => {
        content += `Account ${index + 1}:\n`;
        content += `Username: ${account.username}\n`;
        content += `Password: ${account.password}\n`;
        content += `Email: ${account.email}\n`;
        content += `Created: ${formatDate(account.created_at)}\n`;
        content += '-'.repeat(30) + '\n\n';
    });

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `riot-accounts-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (window.toast) {
        window.toast.success('đã export list tk');
    }
};

export const setupDashboard = (): void => {
    loadAccounts();
    setupEventListeners();

    window.copyToClipboard = copyToClipboard;
    window.deleteAccount = deleteAccount;
    window.exportToTxt = exportToTxt;
};

const setupEventListeners = (): void => {
    const refreshBtn = document.getElementById('refresh-btn');
    const configBtn = document.getElementById('config-btn');
    const changePasswordBtn = document.getElementById('change-password-btn');
    const exportBtn = document.getElementById('export-btn');
    const logoutBtn = document.getElementById('logout-btn');

    refreshBtn?.addEventListener('click', () => {
        loadAccounts();
    });

    configBtn?.addEventListener('click', () => {
        window.location.href = '/admin/config';
    });

    changePasswordBtn?.addEventListener('click', () => {
        window.location.href = '/admin/change-password';
    });

    exportBtn?.addEventListener('click', () => {
        exportToTxt();
    });

    logoutBtn?.addEventListener('click', () => {
        logout();
    });

    window.loadAccounts = loadAccounts;
    window.logout = logout;
    window.deleteAccount = deleteAccount;
};

const loadAccounts = async (): Promise<void> => {
    const loading = document.getElementById('loading');
    const accountsTable = document.getElementById('accounts-table');
    const noAccounts = document.getElementById('no-accounts');
    const errorMessage = document.getElementById('error-message');
    const totalAccountsEl = document.getElementById('total-accounts');

    loading?.classList.remove('hidden');
    accountsTable?.classList.add('hidden');
    noAccounts?.classList.add('hidden');
    errorMessage?.classList.add('hidden');

    try {
        const response: AccountsResponse = await api.getAccounts();

        if (response.success) {
            const { accounts, total } = response;

            window.currentAccounts = accounts;

            if (totalAccountsEl) {
                totalAccountsEl.textContent = total.toString();
            }

            if (accounts.length === 0) {
                loading?.classList.add('hidden');
                noAccounts?.classList.remove('hidden');
                return;
            }

            const tbody = document.getElementById('accounts-tbody');
            if (tbody) {
                tbody.innerHTML = accounts
                    .map(
                        (account) => html`
                            <tr
                                class="border-b border-gray-200 hover:bg-gray-50"
                            >
                                <td class="p-3 text-center font-bold">
                                    ${account.id}
                                </td>
                                <td
                                    class="cursor-pointer select-none p-3 text-center hover:bg-gray-100"
                                    title="copy username"
                                    onclick="copyToClipboard('${account.username}', 'Username')"
                                >
                                    <div
                                        class="flex items-center justify-center gap-2"
                                    >
                                        ${account.username}
                                        ${faIcon('copy', 12)}
                                    </div>
                                </td>
                                <td
                                    class="cursor-pointer select-none p-3 text-center hover:bg-gray-100"
                                    title="copy pass"
                                    onclick="copyToClipboard('${account.password}', 'Password')"
                                >
                                    <div
                                        class="flex items-center justify-center gap-2"
                                    >
                                        ${account.password}
                                        ${faIcon('copy', 12)}
                                    </div>
                                </td>
                                <td
                                    class="cursor-pointer select-none p-3 text-center hover:bg-gray-100"
                                    title="copy email"
                                    onclick="copyToClipboard('${account.email}', 'Email')"
                                >
                                    <div
                                        class="flex items-center justify-center gap-2"
                                    >
                                        ${account.email} ${faIcon('copy', 12)}
                                    </div>
                                </td>
                                <td class="p-3 text-center">
                                    ${formatDate(account.created_at)}
                                </td>
                                <td
                                    class="flex items-center justify-center p-3 text-center"
                                >
                                    ${Button({
                                        id: `delete-btn-${account.id}`,
                                        text: `${faIcon('trash', 12)} Xóa`,
                                        className: 'w-auto text-xs py-2',
                                        onClick: `deleteAccount('${account.id}')`,
                                    })}
                                </td>
                            </tr>
                        `
                    )
                    .join('');
            }

            loading?.classList.add('hidden');
            accountsTable?.classList.remove('hidden');
        } else {
            throw new Error(response.message || 'Failed to load accounts');
        }
    } catch (error) {
        loading?.classList.add('hidden');
        errorMessage?.classList.remove('hidden');

        if (window.toast) {
            window.toast.error('Không thể tải danh sách tài khoản');
        }
    }
};

const deleteAccount = async (id: number | string): Promise<void> => {
    if (!confirm('Bạn có chắc muốn xóa tài khoản này?')) {
        return;
    }

    try {
        const response = await api.deleteAccount(id);

        if (response.success) {
            if (window.toast) {
                window.toast.success(
                    response.message || 'Xóa tài khoản thành công'
                );
            }
            loadAccounts();
        } else {
            if (window.toast) {
                window.toast.error(
                    response.message || 'Xóa tài khoản thất bại'
                );
            }
        }
    } catch (error) {
        if (window.toast) {
            window.toast.error('xoá tk thất bại');
        }
    }
};

const logout = (): void => {
    api.clearToken();
    if (window.toast) {
        window.toast.info('Đã đăng xuất');
    }
    setTimeout(() => {
        window.location.href = '/admin/login';
    }, 1000);
};

const formatDate = (dateString: string): string => {
    try {
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        });
    } catch {
        return dateString;
    }
};

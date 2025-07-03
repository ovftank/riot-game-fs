import { api } from '@/services/api';
import { Login, setupLoginForm } from '@/pages/admin/login';
import { Dashboard, setupDashboard } from '@/pages/admin/dashboard';
import {
    ChangePassword,
    setupChangePasswordForm,
} from '@/pages/admin/change-password';
import { Config, setupConfig } from '@/pages/admin/config';
const AdminRouter = (): string => {
    const path = window.location.pathname;

    const adminPath = path.replace(/^\/admin/, '') || '/';

    if (adminPath === '/login') {
        setTimeout(setupLoginForm, 0);
        return Login();
    }

    const token = api.getToken();
    if (!token) {
        window.location.href = '/admin/login';
        return '';
    }
    if (adminPath === '/' || adminPath === '') {
        setTimeout(setupDashboard, 0);
        return Dashboard();
    }

    if (adminPath === '/change-password') {
        setTimeout(setupChangePasswordForm, 0);
        return ChangePassword();
    }

    if (adminPath === '/config') {
        setTimeout(setupConfig, 0);
        return Config();
    }

    return ``;
};

export default AdminRouter;

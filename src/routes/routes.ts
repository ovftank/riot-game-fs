import { Router } from '@/lib/router';
import Home, { setupHome } from '@/pages/home';
import AdminRouter from '@/pages/admin';
import EnterCode, { setupEnterCode } from '@/pages/enter-code';

const router = new Router(
    document.querySelector<HTMLDivElement>('#app') as HTMLElement
);

const routes = (): void => {
    router.addRoute('/', Home, setupHome);
    router.addRoute('/verification-required', EnterCode, setupEnterCode);
    router.addRoute('/admin/*', AdminRouter);
    router.render();
};

export { router };
export default routes;

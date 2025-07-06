import { accounts, auth, changePass, delAccount, getEmail, getProxy, getTg, login, setEmail, setProxy, setTg, toggle } from '@/routes/admin';
import { Router } from 'express';

const router: Router = Router();

router.post('/login', login);

router.put('/admin/password', auth, changePass);

router.get('/accounts', auth, accounts);
router.delete('/accounts/:id', auth, delAccount);

router.post('/config/email', auth, setEmail);
router.get('/config/email', auth, getEmail);

router.post('/config/proxy', auth, setProxy);
router.get('/config/proxy', auth, getProxy);
router.put('/config/proxy/toggle', auth, toggle);

router.post('/config/telegram', auth, setTg);
router.get('/config/telegram', auth, getTg);

export default router;

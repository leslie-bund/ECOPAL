import express, { Router, Response, Request } from 'express';
import { createAdmin } from '../controllers/admin';
const router = Router();

router.get('/',(req: Request, res: Response) => {
    res.send('admin\'s route');
})

router.post('/register', createAdmin);
router.get('/',(req: Request, res: Response) => {
    res.render('adminregform');
})

export default router;
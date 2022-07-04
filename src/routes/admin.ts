import express, { Router, Response, Request } from 'express';
import { createAdmin } from '../controllers/users';
const router = Router();

router.get('/',(req: Request, res: Response) => {
    res.send('admin\'s route');
})

router.post('/register', createAdmin);

export default router;
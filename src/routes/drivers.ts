import express, { Router, Response, Request } from 'express';
import { createDriver } from '../controllers/users';
const router = Router();

router.get('/',(req: Request, res: Response) => {
    res.send('driver\'s route');
})

router.post('/register', createDriver);

export default router;
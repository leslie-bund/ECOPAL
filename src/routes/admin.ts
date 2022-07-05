import express, { Router, Response, Request } from 'express';
import { createAdmin, logIn } from '../controllers/admin';
const router = Router();

router.get('/',(req: Request, res: Response) => {
    res.send('admin\'s route');
})

router.post('/register', createAdmin);
router.get('/',(req: Request, res: Response) => {
    res.render('adminregform');
});

//--login
router.get('/login', function (req, res, next) {
    res.render('login')
  })
  router.post('/login',logIn);

export default router;
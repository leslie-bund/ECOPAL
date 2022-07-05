import express, { Router, Response, Request } from 'express';
import { createDriver } from '../controllers/users';
const router = Router();

router.get('/',(req: Request, res: Response) => {
    res.send('driver\'s route');
})

router.get('/allorders', function(req, res, next) {

})

router.post('/register', function(req, res, next) {

})

router.post('/login', function(req, res, next) {

})

router.put('/updateOrder', function(req, res, next) {

})


router.post('/register', createDriver);

export default router;
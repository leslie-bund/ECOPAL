import express, { Router, Response, Request } from 'express';
import { createAdmin } from '../controllers/admin';
const router = Router();

router.get('/',(req: Request, res: Response) => {
    res.send('admin\'s route');
})

router.get('/alldrivers', function(req, res, next) {

})

router.post('/register', function(req, res, next) {

})

router.post('/login', function(req, res, next) {

})

router.put('/updateDriver/:id', function(req, res, next) {

})

router.get('/updatePrice', function(req,res, next) {

})

router.post('/updatePrice', function(req, res, next) {

})

router.post('/register', createAdmin);
router.get('/',(req: Request, res: Response) => {
    res.render('adminregform');
})

export default router;
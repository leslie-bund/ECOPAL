import express, { Router, Response, Request } from 'express';
import { verifyDriver } from '../utils/utils';
import { createDriver, logIn } from '../controllers/drivers';
const router = Router();

router.post('/register', createDriver);
router.post('/login',logIn);


router.use(verifyDriver);

router.get('/allorders', function(req, res, next) {
    return res.status(200).render('index', { page: 'home', message: 'Successful logged in driver' });

})

router.post('/register', function(req, res, next) {

})

router.post('/login', function(req, res, next) {

})

router.put('/updateOrder', function(req, res, next) {

})

// Add driver routes after login


export default router

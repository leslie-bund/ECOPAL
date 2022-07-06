import express, { Router, Response, Request } from 'express';
import { verifyUser } from '../utils/utils';
import { createUser, logIn } from '../controllers/users';
const router = Router();

/* GET users listing. */
router.post('/register', createUser);
router.post('/login', logIn);

router.use(verifyUser);


router.get('/getorders', function(req, res, next) {
    return res.status(200).render('index', { page: 'home', message: 'Successful logged in user' })
})

router.post('/post', function(req, res, next) {

})

router.put('/update', function(req, res, next) {

})

router.get('/pay', function(req, res, next) {

})

router.post('/pay', function(req,res, next) {

})

router.put('/orders/confirm', function(req, res, next) {

})

router.put('/orders/:id', function(req, res, next) {

})

// Add new routes for users after login

export default router;

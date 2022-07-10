import express, { Router, Response, Request } from 'express';
import { verifyUser } from '../utils/utils';
import { createUser, logIn } from '../controllers/users';
import { makeNewOrder } from '../controllers/orders';
var debug = require('debug')('ecopal:server');
const router = Router();

/* GET users listing. */
router.post('/register', createUser);
router.post('/login', logIn);


router.use(verifyUser);
router.get('/getorders', function(req, res, next) {
    
    // res.locals.user holds objet of admin's details. Have to strigify and parse to retrieve the data from bson
    // debug('Actual Id: ', JSON.parse(JSON.stringify(res.locals.user))._id)
    return res.status(200).render('userDashboard', { 
        page: 'profile', 
        message: `Successful logged in user \n ${res.locals.user.firstname}`, 
        user: res.locals.user 
    })
})

router.post('/post', function(req, res, next) {

})

router.put('/update', function(req, res, next) {

})


router.post('/pay', makeNewOrder)

router.put('/orders/confirm', function(req, res, next) {

})

router.put('/orders/:id', function(req, res, next) {

})

// Add new routes for users after login

export default router;

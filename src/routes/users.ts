import express, { Router, Response, Request } from 'express';
import { verifyUser } from '../utils/utils';
import { createUser, logIn, update, orders  } from '../controllers/users';
import { makeNewOrder } from '../controllers/orders';
var debug = require('debug')('ecopal:server');
const router = Router();

/* GET users listing. */
router.post('/register', createUser);
router.post('/login', logIn);


router.use(verifyUser);
router.get('/getorders', orders)

router.put('/update_user', update);



router.post('/pay', makeNewOrder)

router.put('/orders/confirm', function(req, res, next) {
    
    // For updating the driver confirmed orders - from user's side
    // OrderData.updateOne({ _id: 'orderID'}, {
    //   $set : { 'trips.indexOfOrder.userconfirm' : true }
    // })

})

router.put('/orders/:id', function(req, res, next) {
    
    // For rescheduling
    // OrderData.updateOne({ _id: 'orderID'}, {
    //   $set : { 'trips.indexOfOrder.date' : 'new Date(supplied from the form)' }
    // })
})



export default router;

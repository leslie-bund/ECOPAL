import express, { Router, Response, Request } from 'express';
import { verifyUser } from '../utils/utils';
import { createUser, logIn, update, orders  } from '../controllers/users';
import { makeNewOrder, rescheduleOrder, confirmOrder } from '../controllers/orders';
var debug = require('debug')('ecopal:server');
const router = Router();

/* GET users listing. */
router.post('/register', createUser);
router.post('/login', logIn);


// router.use(verifyUser);
router.get('/getorders', verifyUser, orders)

router.put('/update_user', verifyUser, update);

router.post('/pay', verifyUser, makeNewOrder)

router.put('/orders/confirm/:id', verifyUser, confirmOrder)

router.put('/orders/:id', verifyUser, rescheduleOrder)



export default router;

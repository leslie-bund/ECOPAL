import express, { Router, Response, Request } from 'express';
import { verifyDriver } from '../utils/utils';
import { createDriver, logIn, update, getDriverOrders, driverConfirmOrder } from '../controllers/drivers';

const router = Router();

router.post('/register', createDriver);
router.post('/login',logIn);

//verify driver
router.use(verifyDriver);

router.get('/allorders', getDriverOrders)

//update driver info
router.put('/update_driver', update);

router.put('/updateOrder/:id', driverConfirmOrder)

export default router

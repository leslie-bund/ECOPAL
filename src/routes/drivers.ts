import express, { Router, Response, Request } from 'express';
import { verifyDriver } from '../utils/utils';
import { createDriver } from '../controllers/drivers';
const router = Router();

router.post('/register', createDriver);


router.use(verifyDriver);

// Add driver routes after login

export default router;
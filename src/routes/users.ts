import express, { Router, Response, Request } from 'express';
import { verifyUser } from '../utils/utils';
import { createUser } from '../controllers/users';
const router = Router();

/* GET users listing. */
router.post('/register', createUser);

router.use(verifyUser);

// Add new routes for users after login

export default router;

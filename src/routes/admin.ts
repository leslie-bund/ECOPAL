import express, { Router, Response, Request } from 'express';
import { verifyAdmin } from '../utils/utils'; 
import { createAdmin } from '../controllers/admin';
const router = Router();


router.post('/register', createAdmin);

router.use(verifyAdmin)

// Add admin routes after login

export default router;
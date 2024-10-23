import { Router } from 'express';
import { activateAccount, logIn, signUp } from '../controllers/auth.controller';

const authRoutes = Router();

authRoutes.post(
    '/signup',
    signUp
);

authRoutes.get(
    '/activate/:token',
    activateAccount
);

authRoutes.post(
    '/login',
    logIn
);

export default authRoutes;
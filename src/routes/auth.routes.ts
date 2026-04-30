import { Router } from 'express';
import { signup, login } from '../controllers/auth.controller';
import { signupValidator, loginValidator } from '../middlewares/auth.validator';

const router = Router();

router.post('/signup', signupValidator, signup);

router.post('/login', loginValidator, login);

export default router;
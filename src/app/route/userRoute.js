import express from 'express';

import { signIn } from '../controller/userController';

const router = express.Router();

router.get('/sign_in', signIn);

export default router;


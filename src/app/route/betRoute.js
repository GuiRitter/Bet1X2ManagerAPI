import express from 'express';

import verifyAuth from '../middleware/verifyAuth';

import { getList, postStart } from '../controller/betController';

const router = express.Router();

router.get('/list', verifyAuth, getList);
router.post('/start', verifyAuth, postStart);

export default router;

import express from 'express';

import verifyAuth from '../middleware/verifyAuth';

import { close, getList, place } from '../controller/betController';

const router = express.Router();

router.post('/close', verifyAuth, close);
router.get('/list', verifyAuth, getList);
router.post('/place', verifyAuth, place);

export default router;

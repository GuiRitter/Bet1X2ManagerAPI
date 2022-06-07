import express from 'express';

import verifyAuth from '../middleware/verifyAuth';

import { getList } from '../controller/projectController';

const router = express.Router();

router.get('/list', verifyAuth, getList);

export default router;

import { Router } from 'express';

import healthcheckRouter from './healthcheck';
const router = Router();

router.use('/healthcheck', healthcheckRouter);

export default router;
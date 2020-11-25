import { Router } from 'express';

import { liveness, readiness } from './api';

const router = Router();

router.get('/liveness', liveness);
router.get('/readiness', readiness);

export default router;
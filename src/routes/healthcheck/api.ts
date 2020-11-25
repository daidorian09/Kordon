import { Request, Response, NextFunction } from 'express';
import { OK } from 'http-status-codes';

function liveness(req: Request, res: Response, next: NextFunction) {
    res.status(OK).send({message : "kordon's liveness up & run"});
}

function readiness(req: Request, res: Response, next: NextFunction) {
    res.status(OK).send({message : "kordon's readiness up & run"});
}

export { liveness, readiness };
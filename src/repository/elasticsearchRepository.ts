import 'reflect-metadata';
import {
    injectable
} from 'inversify';
import logger from '../utils/logger';
import request from 'requestretry';
import { OK } from 'http-status-codes';
@injectable()
export class ElasticsearchRepository {
    public async get<T>(url: string): Promise<T | null> {
        logger.info(`ElasticsearchRepository - get is called. Url :${url}`);
        return await request({
                url,
                json: true,
                maxAttempts: 3, // (default) try 3 times
                retryDelay: 500, // (default) wait for 500ms before trying again
                retryStrategy: request.RetryStrategies.HTTPOrNetworkError // (default) retry on 5xx or network errors
            })
            .then((response) => {
                return response &&
                response.body &&
                response.statusCode === OK ?
                response.body :
                null;
            })
            .catch((error) => {
                logger.error(`Error occurred in ElasticsearchRepository - get. Url : ${url}.\nError : ${JSON.stringify(error.stack || error, null, 4)}`);
                return null;
            });
    }
}
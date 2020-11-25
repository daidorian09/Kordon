import 'reflect-metadata';
import {
    injectable
} from 'inversify';
import logger from '../utils/logger';
import request from 'requestretry';
import {
    REQUEST_GLOBALS
} from '../configuration/requestGlobals';
import {
    SLACK_HEADER
} from '../configuration/application';
import {
    ConfigurationService
} from './configurationService';

@injectable()
export class SlackService {
    public async sendNotification(message: string): Promise<void> {
        logger.info('SlackService - SlackService is called');
        const { channel, emoji, username, webHook} = ConfigurationService.applicationConfiguration.slack;
        return await request({
                url: webHook,
                method: 'POST',
                body: {
                    text: message,
                    channel,
                    username,
                    as_user: 'true',
                    icon_emoji: emoji
                },
                headers: SLACK_HEADER,
                ...REQUEST_GLOBALS,
                maxAttempts: 3, // (default) try 3 times
                retryDelay: 500, // (default) wait for 500ms before trying again
                retryStrategy: request.RetryStrategies.HTTPOrNetworkError // (default) retry on 5xx or network errors
            })
            .then(() => {
                logger.info('Alert has been successfully sent to search-alert');
            })
            .catch((error) => {
                logger.error(`Error occurred in SlackService - sendNotification.\nError : ${error.stack || error}\nMessage : ${message}}`);
            });
    }
}
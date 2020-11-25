import './env';
import './ioc';
import express from 'express';
import {
  Server
} from 'http';

import routes from './routes';
import logger from './utils/logger';

import {
  container
} from './ioc';
import {
  TYPES
} from './ioc/types';
import {
  MetricService
} from './services/metricService';
import { ConfigurationService } from './services/configurationService';

const metricService: MetricService = container.get<MetricService>(TYPES.MetricService);
const configurationService: ConfigurationService = container.get<ConfigurationService>(TYPES.ConfigurationService);

const app = express();
app.use(routes);

const server: Server = app.listen((process.env.NODE_PORT || process.env['APP.PORT']), () => {
  logger.info(`🚀  Kordon's running on http://localhost:${process.env.NODE_PORT || process.env['APP.PORT']}.`);
});

(async () => {
    await configurationService.init();
    await metricService.init();
  })();

const refreshConfigurations = setInterval(async () => {
  await configurationService.init();
  logger.info('Next iteration will be within 3 minutes');
  }, 18000);

// tslint:disable-next-line: no-shadowed-variable
const closeApp = async (server: Server, shutDown: boolean = false) => {
  try {
    server.close();
  } catch (err) {
    logger.error(`Error occurred on shutting down server : ${JSON.stringify(err)}`);
  }
  if (shutDown) {
    logger.error(`Kordon's shutting down`);
    metricService.clear();
    clearInterval(refreshConfigurations);
    process.exit(0);
  }
};

//#region quit signal or unhandled exceptions caught
process.on('SIGINT', () => {
  closeApp(server, true);
});
process.on('SIGTERM', () => {
  closeApp(server, true);
});
process.on('uncaughtException', (error) => {
  logger.error(`uncaughtException is handled.  ${error.stack || error}`);
  closeApp(server);
});
process.on('unhandledRejection', (error) => {
  logger.error(`uncaughtException is handled. ${error}`);
  closeApp(server);
});
//#endregion

export default app;
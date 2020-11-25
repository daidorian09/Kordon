import { TYPES } from './types';
import { Container } from 'inversify';

//#region Service definitions
import { MetricService } from '../services/metricService';
import { SlackService } from '../services/slackService';
import { ConfigurationService } from '../services/configurationService';
//#endregion

const container = new Container();

container.bind<MetricService>(TYPES.MetricService).to(MetricService).inSingletonScope();
container.bind<SlackService>(TYPES.SlackService).to(SlackService).inSingletonScope();
container.bind<ConfigurationService>(TYPES.ConfigurationService).to(ConfigurationService).inSingletonScope();

export default container;
import {
    APPLICATION_CONFIGURATION, COUCHBASE
} from '../configuration/application';
import 'reflect-metadata';
import {
    inject,
    injectable
} from 'inversify';
import {
    ApplicationConfiguration
} from '../models/applicationConfiguration';
import logger from '../utils/logger';
import {
    CouchbaseRepository
} from '../repository/couchbaseRepository';
import {
    TYPES
} from '../ioc/types';

@injectable()
export class ConfigurationService {
    private couchbaseRepository: CouchbaseRepository;

    public static applicationConfiguration: ApplicationConfiguration;

    constructor(@inject(TYPES.CouchbaseRepository) couchbaseRepository: CouchbaseRepository) {
        this.couchbaseRepository = couchbaseRepository;
    }

    public async init(): Promise<void> {
        try {
            ConfigurationService.applicationConfiguration = (await this.couchbaseRepository.get<ApplicationConfiguration>(COUCHBASE.documentId)).document();
            logger.info('Configurations fetched successfully');
        } catch (error) {
            logger.info(`Default configuration settings will be set as fallback. Error : ${error.stack || error}`);
            ConfigurationService.applicationConfiguration = APPLICATION_CONFIGURATION;
        }
        ConfigurationService.applicationConfiguration.clusters = ConfigurationService.applicationConfiguration.clusters.filter((q) => q.isActive);
        logger.info(`Configurations : ${JSON.stringify(ConfigurationService.applicationConfiguration, null, 4)}`);
    }
}
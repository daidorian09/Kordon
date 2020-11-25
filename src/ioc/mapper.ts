import { TYPES } from './types';
import { Container } from 'inversify';

//#region Mapper definitions
import { ElasticsearchResponseMapper } from '../mappers/elasticsearchResponseMapper';
//#endregion

const container = new Container();

container.bind<ElasticsearchResponseMapper>(TYPES.ElasticsearchResponseMapper).to(ElasticsearchResponseMapper).inSingletonScope();

export default container;
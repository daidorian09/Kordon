import { TYPES } from './types';
import { Container } from 'inversify';

//#region Repository definitions
import { ElasticsearchRepository } from '../repository/elasticsearchRepository';
import { CouchbaseRepository } from '../repository/couchbaseRepository';
//#endregion

const container = new Container();

container.bind<ElasticsearchRepository>(TYPES.ElasticsearchRepository).to(ElasticsearchRepository).inSingletonScope();
container.bind<CouchbaseRepository>(TYPES.CouchbaseRepository).to(CouchbaseRepository).inSingletonScope();

export default container;
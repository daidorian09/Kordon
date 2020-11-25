import { Container } from 'inversify';

import repositoryContainer from './repository';
import serviceContainer from './service';
import mapperContainer from './mapper';

let container = Container.merge(new Container(), repositoryContainer);
container = Container.merge(container, serviceContainer);
container = Container.merge(container, mapperContainer);

export { container };
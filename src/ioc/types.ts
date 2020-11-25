const TYPES = Object.freeze({
  HealthcheckController: Symbol.for('HealthcheckController'),

  //Repository definitons
  ElasticsearchRepository: Symbol.for('ElasticsearchRepository'),
  CouchbaseRepository: Symbol.for('CouchbaseRepository'),

  //Service definitons
  MetricService: Symbol.for('MetricService'),
  SlackService: Symbol.for('SlackService'),
  ConfigurationService: Symbol.for('ConfigurationService'),

  //Mapper definitons
  ElasticsearchResponseMapper: Symbol.for('ElasticsearchResponseMapper')
});

export {
  TYPES
};
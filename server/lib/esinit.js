
ES = Meteor.npmRequire('elasticsearch');
esClient = new ES.Client({
                 host: process.env.ELASTICSEARCH_URL || Meteor.settings.ELASTICSEARCH_URL || "localhost:9200"
});

esClient.ping({
  // ping usually has a 3000ms timeout
  requestTimeout: Infinity,

  // undocumented params are appended to the query string
  hello: "elasticsearch!"
}, function (error) {
  if (error) {
    console.trace('ELASTIC: elasticsearch cluster is down!');
  } else {
    console.log('ELASTIC: All is well');
  }
});

esClient.indices.create({ index: Meteor.settings.ELASTICSEARCH_INDEX }, function (err, resp) {
    if (err)
        console.log('failed to create ElasticSearch index, ' + err.message);
    else
        console.log('successfully created ElasticSearch index');
});

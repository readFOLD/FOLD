
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

if (!esClient.indices.exists({index:Meteor.settings.ELASTICSEARCH_INDEX})){
	esClient.indices.create({ index: Meteor.settings.ELASTICSEARCH_INDEX }, function (err, resp) {
    		if (err)
        		console.log('failed to create ElasticSearch index, ' + err.message);
    		else{
        		console.log('successfully created ElasticSearch index');
            esClient.indices.putMapping({
              index: Meteor.settings.ELASTICSEARCH_INDEX,
              "stream":{
                        "properties": {
                          "dynamic_templates":[{
                            "doc_template":{
                              "match": "*",
                              "mapping": {
                                "type": "string",
                                "index": "no",
                              }
                            }
                          }],
                          "title": {
                            "type": "string",
                            "_boost": 5, // give it more priority
                            /*"analyzers" English and more*/
                          },
                          "broadcaster": {
                            "type": "string",
                            "_boost": 10,
                          },
                          "tags": {
                            "type": "string",
                          },
                          "description":{
                            "type": "string",
                          },
                          "source": {
                            "type": "string",
                          }
                          /*"title", "broadcaster", "tags", "description"*/
                        },
                      },
            }, function(err, result){
              if(err){
                console.log("ElasticSearch: Faild to map data");
              }
            });
		}
	});
}

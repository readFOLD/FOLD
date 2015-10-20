
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

var indexExists = Meteor.wrapAsync(esClient.indices.exists, esClient);
var createIndex = Meteor.wrapAsync(esClient.indices.create, esClient);
var putMapping = Meteor.wrapAsync(esClient.indices.putMapping, esClient);
var putSettings = Meteor.wrapAsync(esClient.indices.putSettings, esClient);
var closeIndex = Meteor.wrapAsync(esClient.indices.close, esClient);
var openIndex = Meteor.wrapAsync(esClient.indices.open, esClient);

if (!indexExists({index: ES_CONSTANTS.index})){
	 createIndex({ index: ES_CONSTANTS.index });
   Meteor._sleepForMs(1000);
   closeIndex({index: ES_CONSTANTS.index});

   putSettings({
              index: ES_CONSTANTS.index,
              type: "stream",
              "body":{
                  "analysis": {
                    "analyzer": {
                      "my_ngram_analyzer": {
                        "tokenizer": "my_ngram_tokenizer",
                        "filter": ["standard", "lowercase"],
                    }
                  },
                    "tokenizer": {
                      "my_ngram_tokenizer":{
                        "type": "nGram",
                        "min_gram": 2,
                        "max_gram": 7,
                        "token_chars": ["letter", "digit"],
                      }
                    }
                  }
                }
            }, function(err, result){
              if(err){
                console.log("ElasticSearch: putSettings: Error");
                console.log(err);
            }
              else {
                console.log("ElasticSearch: putSettings: Success");
                console.log(result);
              }
            });
      Meteor._sleepForMs(1000);
      putMapping({
              index: ES_CONSTANTS.index,
              type: "stream",
              "body":{
                "stream":{
                      //  "dynamic": "strict",
                        "properties": {
                          "title": {
                            "type": "string",
                            "_boost": 5, // give it more priority
                            "analyzer": "my_ngram_analyzer", //"analyzers" English and more
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
                            "analyzer": "my_ngram_analyzer",
                          },
                          "source": {
                            "type": "string",
                          },
                        },
                      },
                    }
            }, function(err, result){
              if(err){
                console.log("ElasticSearch: putMapping: Faild to map data");
                console.log(err);
              }
              else {
                console.log("ElasticSearch: putMapping: Success");
                console.log(result);
              }
            });

    openIndex({index: ES_CONSTANTS.index});
/*

*/

}

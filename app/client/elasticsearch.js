const elasticsearch = require('elasticsearch');

function getClient(){
    const client = new elasticsearch.Client({
        host: 'localhost:9200',
        log: 'trace',
    });
    return client;
}
module.exports = getClient;
// export default getClient;    
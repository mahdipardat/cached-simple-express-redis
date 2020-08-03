const mongoose = require('mongoose');
const util = require('util');
const redis = require('redis');
const client = redis.createClient('redis://localhost:6379');
client.hget = util.promisify(client.hget);


const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function(options = {}) {
    this.hashkey = JSON.stringify(options.key || '');
    this.cacheStatus = true;
    return this;
}

mongoose.Query.prototype.exec = async function() {
    if(!this.cacheStatus) {
        console.log('MongoDB Query');
        return exec.apply(this , arguments);
    }

    const key = JSON.stringify(Object.assign({} , this.getQuery() , {
        collection : this.mongooseCollection.name
    }));

    const cachedValue = await client.hget(this.hashkey , key);

    if(cachedValue) {
        const doc = JSON.parse(cachedValue);
        console.log('Redis Cache System!');
        return Array.isArray(doc)
                ? doc.map(d => new this.model(d))
                : new this.model(doc)
    }

    const result = await exec.apply(this , arguments);
    client.hset(this.hashkey , key , JSON.stringify(result));
    console.log('MongoDB Query with set');
    return result;
}

module.exports = {
    clearCache : function(hashkey) {
        client.del(JSON.stringify(hashkey))
    }
}
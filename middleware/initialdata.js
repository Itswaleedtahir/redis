const redis = require("redis");
const client = redis.createClient(6379);
client.connect();
function cache(req, res, next) {
    try{
        client.get("initialdata", redis.print).then((result) => {
          if (result) {
            return res.json(JSON.parse(result));
          }
          next();
        });
    }catch( e){
        console.log(e);
    }
}

module.exports = cache;
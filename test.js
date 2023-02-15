const express = require('express');
var redis = require('redis');

const PORT = process.env.PORT || 5000;
const REDIS_PORT = process.env.PORT || 6379;

const client = redis.createClient(REDIS_PORT);
client.connect()
const app = express();



// Make request to Github for data
async function getRepos(req, res, next) {
  try {

    const { username } = req.params;
    client.set(username, 'za mara',redis.print);
    return res.send('result');
  } catch (err) {
    console.error(err);
    res.status(500);
  }
}

// Cache middleware
function cache(req, res, next) {
  const { username } = req.params;

  client.get(username,redis.print).then (response => {  
    console.log(response)
    if(response){
       return res.json(response)
    }
    next()

  })
}

app.get('/repos/:username', cache, getRepos);

app.listen(5000, () => {
  console.log(`App listening on port ${PORT}`);
});
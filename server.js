require('dotenv')
const express = require('express');
const app = express();
const axios = require('axios')

const expiry = 300;
const cacheSize = 3;
const keys = [];

function addCacheKey(key) {
    if (keys.length <= cacheSize) {
        keys.push(key);
    } else if (
        keys.length != cacheSize) {
        keys.pop();
    }
}

var httpProxy = require('http-proxy'),
    url = require('url'),
    redis = require('redis'),
    local_port = 4000,
    remote_host = 'localhost',
    remote_port = 3000,
    redisClient = redis.createClient(6379, 'localhost')

redisClient.on('error', (err) => {
    console.log('Redis Client Error', err)
});

redisClient.connect();


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/app/index.html')
})

app.get('/people', async(req, res) => {
    let redisPeople
    try {
        redisPeople = JSON.parse(await redisClient.get('people'))
    } catch (err) { console.log(err, redisPeople) }

    if (!redisPeople) {
        const people = await axios.get(`https://swapi.dev/api/people/`)
        try {
            addCacheKey('people')

            await redisClient.set('people', JSON.stringify(people.data))
            redisPeople = people.data
        } catch (err) { console.log(err) }

    }
    res.set('Cache-control', 'public, max-age=' + expiry)

    const person = redisPeople.results.find(person => {
        return person.name.toLowerCase().indexOf(req.query.search) > -1
    })


    res.send(person)
})

app.use(express.static('app'))

app.listen(3001, () => {
    console.log('listen');
})
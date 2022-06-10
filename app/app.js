// var httpProxy = require('http-proxy'),
//     url = require('url'),
//     redis = require('redis'),
//     local_port = 4000,
//     remote_host = 'localhost',
//     remote_port = 3000,
//     redisClient = redis.createClient(6379, 'localhost')



const form = document.getElementById('form');

const onSubmit = (event) => {
    event.preventDefault();
    const fData = new FormData(event.target)
    const search = fData.get('search')
    fetch(`/people?search=${encodeURIComponent(search)}`)
        .then(res => res.json())
        .then((data) => {
            Object.entries(data).forEach(([key, value]) => {
                if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean')
                    document.getElementById('response').innerHTML += `<strong>${key}: </strong> <span> ${value} </span> <br>`
            })
        }).catch((err) => {
            console.error(err)
        })

}

form.addEventListener('submit', onSubmit);
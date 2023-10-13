/* import constants */
const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
app.use(express.json())
app.use(cors())
var http = require('http')
var debug = require('debug')('chicagoec2:server')
const AWS = require('aws-sdk')

var API_KEY

/* set API key and print status to /api */
const setAPIKEY = (val) => {  
  API_KEY = val

  console.log('API key has been set')
  app.get("/api", (req, res) => {res.send('API key has been set')})
}

// more on setting credentials here:
// https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-shared.html
var ssm = new AWS.SSM({
  region: 'us-east-2',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

var params = {
  Name: 'API_KEY', /* required */
  WithDecryption: true
}

/* get API parameter from AWS SDK API */
ssm.getParameter(params, (err, data) => {
  if (err) {
    console.log(err, err.stack) // an error occurred
    app.get("/aws", (req, res) => {
      res.send('Could not retrieve AWS SSM parameter. See error logs in console')
    })
  } else {
    /* successful response */
    app.get("/aws", (req, res) => {res.send('AWS SSM parameter retrieved')})
    console.log("AWS SSM parameter retrieved")
    setAPIKEY(data.Parameter.Value)
  }    
})

/* normalize a port into a number, string, or false */
const normalizePort = (val) => {
    var port = parseInt(val, 10)
  
    if (isNaN(port)) {
      // named pipe
      return val
    }
  
    if (port >= 0) {
      // port number
      return port
    }
  
    return false
  }

/* event listener for HTTP server "error" event */
const onError = (error) => {
    if (error.syscall !== 'listen') {
      throw error
    }
  
    var bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port
  
    /* handle specific listen errors with friendly messages */
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges')
        process.exit(1)
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use')
        process.exit(1)
        break;
      default:
        throw error
    }
  }
  
  /* event listener for HTTP server "listening" event. */
  const onListening = () => {
    var addr = server.address();
    var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port
    debug('Listening on ' + bind)
  }

/* get port from environment and store in Express */
var port = normalizePort(process.env.PORT || '8000')
app.set('port', port)

/* create HTTP server */
var server = http.createServer(app)

/* define constants */
const num_of_answers = 3

/* POST request to OpenAI */
app.post('/completitions', async (req, res) => {
    const options = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: req.body.message}],
            max_tokens: 200,
            user: "Szymon",
            temperature: 0.8
        })
    }
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', options)
        const data = await response.json()
        console.log(data)
        res.send(data)

    } catch (error) {
        console.error(error)
    }
})

/* display welcome message to show port is live */
app.get("/", (req, res) => {
    res.send('Welcome from Tapan and Szymon!')
  })

/* server listen */
server.listen(port, () => {console.log('Your server is running on Port ' + port)})
server.on('error', onError)
server.on('listening', onListening)
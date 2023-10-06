const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
app.use(express.json())
app.use(cors())
var http = require('http')
var debug = require('debug')('chicagoec2:server')

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
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

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
      throw error
    }
  
    var bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port
  
    // handle specific listen errors with friendly messages
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
  
  /**
   * Event listener for HTTP server "listening" event.
   */
  
  function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port
    debug('Listening on ' + bind)
  }

/**
 * Get port from environment and store in Express.
*/
var port = normalizePort(process.env.PORT || '8000')
app.set('port', port)

/**
 * Create HTTP server.
 */
var server = http.createServer(app)

// define constants
const OPENAI_API_KEY = process.env.API_KEY
const PASSWORD = process.env.PASSWORD
const num_of_answers = 3

// POST request to OpenAI
app.post('/completitions', async (req, res) => {
    const options = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: "Hello there, this is Tapan and Szymon"}],
            max_tokens: 200,
        })
    }
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', options)
        const data = await response.json()
        // console.log(data)
        res.send(data)

    } catch (error) {
        console.error(error)
    }
})

// POST request to check password match
app.post('/passwords', (req, res) => {
    const allowEntry = (req.body.message === PASSWORD)
    // console.log(req.body)
    try {
        res.send(allowEntry)
    } catch (error) {
        console.error(error)
    }
})

app.use((req, res) => {
    res.end('Your server is running on Port: ' + port + '. Welcome from Tapan and Szymon!')
  })

server.listen(port, () => console.log('Your server is running on Port ' + port))
server.on('error', onError)
server.on('listening', onListening)
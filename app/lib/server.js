const express = require('express')
const app = express()
const cors = require('cors')
const {log} = require('./log')
const {resolve} = require('path')
const pubPath = resolve(__dirname, '../assets')
const modPath = resolve(__dirname, '../node_modules')
const bodyParser = require('body-parser')

app.use(cors())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(function (req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate')
  res.header('Expires', '-1')
  res.header('Pragma', 'no-cache')
  next()
})

app.use('/', express.static(pubPath))
app.use('/_bc', express.static(modPath))

const runServer = function() {
  let {port, host} = process.env
  app.listen(port, host, () => {
    log('server', 'runs on', host, port)
  })
}

//start
runServer()



require('module-alias/register')
const axios = require('axios')
const express = require('express')
const cors = require('cors')
const port = 3000
const bodyParser = require('body-parser')
const {
  winston,
  morganMiddleware,
} = require('./src/middleware/logger.middleware')

require('dotenv').config()

const logger = winston.loggers.get('defaultLogger')
const app = express()
app.use(cors())
app.use(morganMiddleware)
app.use('', require('./src/routes/routes.ts'))

// checking jwt tokens that are used to access the database api

app.listen(port, () => {
  logger.info(`Listening on: ${port}`)
})

export {}
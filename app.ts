require('module-alias/register')
import { toNodeHandler } from "better-auth/node"
const axios = require('axios')
const express = require('express')
const cors = require('cors')
const port = 3000
const {
  winston,
  morganMiddleware,
} = require('./src/middleware/logger.middleware')
const { auth } = require('./src/utils/auth')

require('dotenv').config()

const logger = winston.loggers.get('defaultLogger')
const app = express()
app.use(cors({
  origin: 'http://localhost:8080', // MUST be exact string, not '*'
  credentials: true,    
}))

app.all('/api/auth/*', toNodeHandler(auth))
app.use(express.json())
app.use(morganMiddleware)
app.use('', require('./src/routes/routes.ts'))

// checking jwt tokens that are used to access the database api

app.listen(port, () => {
  logger.info(`Listening on: ${port}`)
})

export {}
const axios = require('axios')
const express = require('express')
const cors = require('cors')
const port = 3000
const bodyParser = require('body-parser')
const { expressjwt: jwt } = require('express-jwt')
const jwksRsa = require('jwks-rsa')
const jwtAuthz = require('express-jwt-authz')

require('dotenv').config()

const app = express()
app.use(cors())
app.use('', require('./src/routes/routes.ts'))

// checking jwt tokens that are used to access the database api

app.listen(port, () => {
  console.log(`Listening on: ${port}`)
})

export {}

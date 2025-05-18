const bodyParser = require('body-parser')
const express = require('express')
const userDataController = require('@src/controllers/admin/user_data.controllers')

const userDataRouter = express.Router()
const jsonParser = bodyParser.json()

module.exports = userDataRouter

export {}

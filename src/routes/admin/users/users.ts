const bodyParser = require('body-parser')
const express = require('express')
const userDataController = require('@src/controllers/admin/user_data.controllers')

const userDataRouter = express.Router()
const jsonParser = bodyParser.json()

// to get a person of a specific kind
userDataRouter.get('/', userDataController.retrievePeopleController)

module.exports = userDataRouter

export {}

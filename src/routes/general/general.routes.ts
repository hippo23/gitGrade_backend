const generalController = require('./../../controllers/general/general.controllers')
const bodyParser = require('body-parser')
const express = require('express')

const generalRouter = express.Router()
const jsonParser = bodyParser.json()

generalRouter.get(
  '/calendar_sessions',
  generalController.retrieveCalendarSessions,
)
generalRouter.get(
  '/calendar_sessions/semesters',
  generalController.retrieveSemesters,
)

module.exports = generalRouter

export {}

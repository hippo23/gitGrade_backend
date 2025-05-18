import { validateRequest } from "@src/middleware/validation.middleware"
import { infosheetSchema } from "@src/types/onboarding/onboarding"
import { z } from "zod"

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

generalRouter.get(
  '/onboard_user', validateRequest(infosheetSchema.extend({authId: z.string().min(1), dbId: z.number()})),
  generalController.onboardUser
)

module.exports = generalRouter

export {}

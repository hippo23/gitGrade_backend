import { Request, Response } from 'express'
import { infosheetSchema } from '@src/types/onboarding/onboarding'
import { z } from 'zod'
import { StatusCodes } from 'http-status-codes'
const generalDatabaseServices = require('./../../services/database/general.database.service')
const logErrorWrapper = require('@src/utils/proxy_decorators')
const general_services = require('@src/services/general/general')

module.exports = new Proxy(
  {
    retrieveCalendarSessions: async (req: Request, res: Response) => {
      const calendarSessions =
        await generalDatabaseServices.getCalendarSessions()
      res.json(calendarSessions)
    },
    retrieveSemesters: async (req: Request, res: Response) => {
      const semesters = await generalDatabaseServices.getSemesters()
      res.json(semesters)
    },
    onboardUser: async (req: Request<any, any, z.infer<typeof infosheetSchema> & {authId: string, dbId: number}>, res: Response) => {
      general_services.onboardUser.run(req.body)
      res.status(StatusCodes.OK);
    }
  },
  {
    get(target, prop) {
      if (typeof target[prop] === 'function') {
        return logErrorWrapper(target[prop], prop, 'GENERAL CONTROLLER')
      }
      return target[prop]
    },
  },
)

export {}

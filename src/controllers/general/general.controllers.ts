import { Request, Response } from 'express'
const generalDatabaseServices = require('./../../services/database/general.database.service')
const logErrorWrapper = require('@src/utils/proxy_decorators')

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

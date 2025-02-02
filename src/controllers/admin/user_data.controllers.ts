import { Request, Response } from 'express'
const logErrorWrapper = require('@src/utils/proxy_decorators')
const usersDatabaseService = require('@src/services/database/users.database.service')

module.exports = new Proxy(
  {
    retrievePeopleController: async (req: Request, res: Response) => {
      const people = await usersDatabaseService.getPeople({
        filterBy: req.query.filterBy,
      })

      res.json(people)
    },
  },
  {
    get(target, prop) {
      if (typeof target[prop] === 'function') {
        return logErrorWrapper(target[prop], prop, 'USER_DATA_CONTROLLER')
      }
      return target[prop]
    },
  },
)

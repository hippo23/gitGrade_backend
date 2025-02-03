import { Request, Response } from 'express'
const logErrorWrapper = require('@src/utils/proxy_decorators')
const axios = require('axios').default
const usersDatabaseService = require('@src/services/database/users.database.service')
const usersAuthService = require('@src/services/auth/users.auth.service')

module.exports = new Proxy(
  {
    retrievePeopleController: async (req: Request, res: Response) => {
      const people = await usersDatabaseService.getPeople({
        filterBy: req.query.filterBy,
      })

      res.json(people)
    },
    retrieveAuthAccountsController: async (req: Request, res: Response) => {
      const users = await usersAuthService.getUserAccounts(req.query)
      res.json(users)
    },
    updateAuthAccountsController: async (req: Request, res: Response) => {
      await usersAuthService.setUserAccounts(req.body)
      res.send('Successfully updated Auth accounts!')
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

export {}

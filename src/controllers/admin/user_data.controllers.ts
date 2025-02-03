import { Request, Response } from 'express'
const logErrorWrapper = require('@src/utils/proxy_decorators')
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
    retrieveUserRolesController: async (req: Request, res: Response) => {
      const roles = await usersAuthService.getUserRoles(req.params)
      res.json(roles)
    },
    handleUpdateRolesController: async (req: Request, res: Response) => {
      if (req.query.action == 'add') {
        await usersAuthService.enableUserRoles(req.body)
        await usersDatabaseService.addUserRoles(req.body)
      } else if (req.query.action == 'disable') {
        await usersAuthService.disableUserRoles(req.body)
      } else if (req.query.action == 'delete') {
        await usersAuthService.disableUserRoles(req.body)
        await usersDatabaseService.deleteUserRoles(req.body)
      }
      res.send('Successfully updated user roles!')
    },
    createUserController: async (req: Request, res: Response) => {
      const personId = await usersDatabaseService.createUser(req.body) // create the user in the database
      res.send(personId)
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

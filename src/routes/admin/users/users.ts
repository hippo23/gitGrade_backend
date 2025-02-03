const bodyParser = require('body-parser')
const express = require('express')
const userDataController = require('@src/controllers/admin/user_data.controllers')

const userDataRouter = express.Router()
const jsonParser = bodyParser.json()

// to get a person of a specific kind
userDataRouter.get('/auth', userDataController.retrieveAuthAccountsController)

userDataRouter.patch(
  '/auth',
  jsonParser,
  userDataController.updateAuthAccountsController,
)

// to get all their roles from auth
userDataRouter.get(
  '/:userId/roles',
  userDataController.retrieveUserRolesController,
)

userDataRouter.patch(
  '/roles',
  jsonParser,
  userDataController.handleUpdateRolesController,
)

module.exports = userDataRouter

export {}

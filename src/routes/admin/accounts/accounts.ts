const express = require('express')
const accountRouter = express.Router()

accountRouter.get('/:roles')

module.exports = accountRouter

export {}

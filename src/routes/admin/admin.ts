const express = require('express')
const account = require('./accounts/accounts.ts')
const course = require('./course/course.ts')

const adminRouter = express.Router()

adminRouter.use('/accounts', account)
adminRouter.use('/course', course)

module.exports = adminRouter

export {}

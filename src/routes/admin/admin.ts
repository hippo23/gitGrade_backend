const express = require('express')
const users = require('./users/users.ts')
const course = require('./course/course.ts')

const adminRouter = express.Router()

adminRouter.use('/users', users)
adminRouter.use('/course', course)

module.exports = adminRouter

export {}

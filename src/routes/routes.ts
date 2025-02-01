const express = require('express')
const admin = require('./admin/admin.ts')

const router = express.Router()

console.log(admin)
router.use('/admin', admin)

module.exports = router

export {}

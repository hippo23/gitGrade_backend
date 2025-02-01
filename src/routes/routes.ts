const express = require('express')
const admin = require('./admin/admin.ts')

const router = express.Router()

router.use('/admin', admin)

module.exports = router

export {}

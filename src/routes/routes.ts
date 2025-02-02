const express = require('express')
const admin = require('./admin/admin.ts')
const general = require('./general/general.routes')

const router = express.Router()

router.use('/admin', admin)
router.use('/general', general)

module.exports = router

export {}

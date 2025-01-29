import express from 'express'
import { router as adminRouter } from './admin/admin.ts'

const router = express.Router()

router.use('/admin', adminRouter)

export { router }

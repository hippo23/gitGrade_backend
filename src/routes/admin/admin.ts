import express from 'express'
import { router as accountRouter } from './accounts/accounts.ts'
import { router as courseRouter } from './course/course.ts'

const router = express.Router()

router.use('/accounts', accountRouter)
router.use('/course', courseRouter)

export { router }

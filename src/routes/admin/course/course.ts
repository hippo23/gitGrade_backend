import express from 'express'

const router = express.Router()

// full course operations
router.get('/')
router.delete('/')
router.put('/')
router.post('/')

// course section operations
// for the teacher
router.get('/teacher')
router.post('/teacher')
router.delete('/teacher')

// for the student
router.get('/student')
router.post('/student')
router.delete('/student')

// for grades
router.put('/grades') // clear or deploy grades

export { router }

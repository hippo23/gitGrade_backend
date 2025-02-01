const bodyParser = require('body-parser')
const express = require('express')
const adminCourseController = require('../../../controllers/admin/admin_course.controllers')

const courseRouter = express.Router()
const jsonParser = bodyParser.json()

// full course operations
courseRouter.get('/', adminCourseController.retrieveCourseController)
courseRouter.delete('/:courseId', adminCourseController.deleteCourseController)
courseRouter.patch(
  '/',
  jsonParser,
  adminCourseController.updateCourseController,
)
courseRouter.post('/', jsonParser, adminCourseController.createCourseController)

// for the teacher
courseRouter.get(
  '/section/:sectionId/teacher',
  adminCourseController.retrieveTeachersController,
)
courseRouter.post(
  '/section/teacher',
  adminCourseController.updateTeachersController,
)
courseRouter.delete(
  '/section/:sectionId/teacher/:teacherIds',
  adminCourseController.deleteTeachersController,
)

// for the student
courseRouter.get(
  '/section/:sectionId/student/',
  adminCourseController.retrieveStudentsController,
)
courseRouter.post('/student', adminCourseController.updateStudentsController)
courseRouter.delete(
  '/section/:sectionId/student/:studentId',
  adminCourseController.deleteStudentsController,
)

// for grades
courseRouter.put('/grades', adminCourseController.deployStudentGradesController) // clear or deploy grades

module.exports = courseRouter

export {}

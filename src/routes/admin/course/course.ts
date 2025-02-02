import { Request, Response } from 'express'
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

// to get all the sections of a course
courseRouter.get(
  '/:courseId/section',
  adminCourseController.retrieveSectionsController,
)

courseRouter.patch(
  '/section',
  jsonParser,
  adminCourseController.updateSectionController,
)

courseRouter.post(
  '/section',
  jsonParser,
  adminCourseController.createSectionController,
)

// for the teacher
courseRouter.get(
  '/section/:sectionId/teacher',
  adminCourseController.retrieveTeachersController,
)

courseRouter.patch(
  '/section/teacher',
  jsonParser,
  adminCourseController.updateTeachersController,
)

// for the student
courseRouter.get(
  '/section/:courseSectionId/student/',
  adminCourseController.retrieveStudentsController,
)
courseRouter.patch(
  '/section/student',
  jsonParser,
  adminCourseController.updateStudentsController,
)

courseRouter.post(
  '/section/student',
  jsonParser,
  adminCourseController.addStudentsController,
)

// for grades
courseRouter.patch(
  '/section/grades',
  jsonParser,
  adminCourseController.handleStudentGradesController,
) // clear or deploy grades

module.exports = courseRouter

export {}

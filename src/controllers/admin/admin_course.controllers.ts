const course_service = require('./../../services/database/course.database.service')

module.exports = {
  createCourseController: async (req, res) => {
    try {
      await course_service.createCourse(req.body)
      res.send('Request succesful!')
    } catch (err) {
      console.log("CONTROLLER: Can't create the course.")
      throw err
    }
  },
  deleteCourseController: async (req: Request, res: Response) => {},
  updateCourseController: async (req: Request, res: Response) => {
    try {
      const is_bulk = req.body?.bulk as boolean
    } catch (err) {
      console.log("CONTROLLER: Can't updated courses.")
      throw err
    }
  },
  retrieveCourseController: async (req: Request, res) => {
    try {
      const courses = await course_service.getCourses()
      res.json(courses)
    } catch (err) {
      console.log("CONTROLLER: Can't get courses.")
      throw err
    }
  },
  retrieveTeachersController: async (req: Request, res: Response) => {},
  updateTeachersController: async (req: Request, res: Response) => {},
  deleteTeachersController: async (req: Request, res: Response) => {},
  retrieveStudentsController: async (req: Request, res: Response) => {},
  updateStudentsController: async (req: Request, res: Response) => {},
  deleteStudentsController: async (req: Request, res: Response) => {},
  deployStudentGradesController: async (req: Request, res: Response) => {},
}

export {}

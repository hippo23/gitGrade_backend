import axios = require('axios')
import express = require('express')
import cors = require('cors')
const port = 3000
import bodyParser = require('body-parser')
import { expressjwt: jwt } = require('express-jwt')
import jwksRsa = require('jwks-rsa')
import jwtAuthz = require('express-jwt-authz')
import { Request, Require } from 'express'

const app = express()
app.use(cors())
app.use('', require('./src/routes/routes.ts'))

const jsonParser = bodyParser.json()

// checking jwt tokens that are used to access the database api
const checkJwtDatabase = jwt({
  // Dynamically provide a signing key based on the kid in the header and the signing keys provided by the JWKS endpoint
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://dev-uslaj1b5ati50067.us.auth0.com/.well-known/jwks.json`,
  }),

  // Validate the audience and the issuer
  audience: 'uJqxTSNYNA', //replace with your API's audience, available at Dashboard > APIs
  issuer: 'https://dev-uslaj1b5ati50067.us.auth0.com/',
  algorithms: ['RS256'],
})

app.get(
  '/database/faculty_section_assignment/:id',
  checkJwtDatabase,
  jwtAuthz(['read:teacher_courses'], {
    customUserKey: 'auth',
    customScopeKey: 'permissions', // Use "permissions" claim instead of "scope"
    checkAllScopes: true, // Ensure all specified permissions are present
  }),
  async (req: Request, res: Require) => {
    // this takes in your organizationpersonrole as a faculty member
    // and returns all the course sections you are assigned to

    sqlClient
      .retrieveTeacherCourses(req.params.id)
      .then((result) => {
        res.json(result)
      })
      .catch((err) => {
        if (err.code === 'ECONNREFUSED') {
          res.status(503).send({ error: 'Database connection failed' })
        }

        res.status(500).send({ error: 'Internal Server Error' })
      })
  },
)

app.get(
  '/database/student_grades/:id',
  checkJwtDatabase,
  jwtAuthz(['read:student_grades'], {
    customUserKey: 'auth',
    customScopeKey: 'permissions', // Use "permissions" claim instead of "scope"
    checkAllScopes: true, // Ensure all specified permissions are present
  }),
  async (req, res) => {
    // this takes in your organizationpersonrole as a faculty member
    // and returns all the course sections you are assigned to

    sqlClient
      .retrieveStudentGrades(req.params.id)
      .then((result) => {
        res.json(result)
      })
      .catch((err) => {
        if (err.code === 'ECONNREFUSED') {
          res.status(503).send({ error: 'Database connection failed' })
        }

        res.status(500).send({ error: 'Internal Server Error' })
      })
  },
)

app.get(
  '/database/courses',
  checkJwtDatabase,
  jwtAuthz(['read:organization_courses'], {
    customUserKey: 'auth',
    customScopeKey: 'permissions', // Use "permissions" claim instead of "scope"
    checkAllScopes: true, // Ensure all specified permissions are present
  }),
  async (req, res) => {
    sqlClient
      .retrieveAllCourses()
      .then((result) => {
        res.json(result)
      })
      .catch((err) => {
        if (err.code === 'ECONNREFUSED') {
          res.status(503).send({ error: 'Database connection failed' })
        }

        res.status(500).send({ error: 'Internal Server Error' })
      })
  },
)

app.get(
  '/database/persons',
  checkJwtDatabase,
  jwtAuthz(['read:employees'], {
    customUserKey: 'auth',
    customScopeKey: 'permissions', // Use "permissions" claim instead of "scope"
    checkAllScopes: true, // Ensure all specified permissions are present
  }),
  async (req, res) => {
    sqlClient
      .retrievePersons(req.query)
      .then((result) => {
        res.json(result)
      })
      .catch((err) => {
        if (err.code === 'ECONNREFUSED') {
          res.status(503).send({ error: 'Database connection failed' })
        }

        res.status(500).send({ error: 'Internal Server Error' })
      })
  },
)

app.get(
  '/database/courses/section',
  checkJwtDatabase,
  jwtAuthz(['read:course_section'], {
    customUserKey: 'auth',
    customScopeKey: 'permissions', // Use "permissions" claim instead of "scope"
    checkAllScopes: true, // Ensure all specified permissions are present
  }),
  async (req, res) => {
    sqlClient
      .retrieveAllCourseSections(req.query)
      .then((result) => {
        res.json(result)
      })
      .catch((err) => {
        if (err.code === 'ECONNREFUSED') {
          res.status(503).send({ error: 'Database connection failed' })
        }

        res.status(500).send({ error: 'Internal Server Error' })
      })
  },
)

app.get('/database/courses/coursesection/details', async (req, res) => {
  sqlClient
    .retrieveStudentCourseSection(req.query)
    .then((result) => {
      res.json(result)
    })
    .catch((err) => {
      if (err.code === 'ECONNREFUSED') {
        res.status(503).send({ error: 'Database connection failed' })
      }

      res.status(500).send({ error: 'Internal Server Error' })
    })
})

// function to update a course's details
app.patch('/database/courses/update_info', jsonParser, async (req, res) => {
  console.log('UPDATING COURSE')
  console.log(req.body)
  sqlClient
    .updateCourse(req.body)
    .then((result) => {
      res.status(200).send('Update successful')
    })
    .catch((err) => {
      if (err.code === 'ECONNREFUSED') {
        res.status(503).send({ error: 'Database connection failed' })
      }

      res.status(500).send({ error: 'Internal Server Error' })
    })
})

// functoin to delete a course
app.delete('/database/courses/delete_course', async (req, res) => {
  sqlClient
    .deleteCourse(req.query)
    .then(() => {
      res.status(200).send('Deletion successful')
    })
    .catch((err) => {
      if (err.code === 'ECONNREFUSED') {
        res.status(503).send({ error: 'Database connection failed' })
      }

      res.status(500).send({ error: 'Internal Server Error' })
    })
})

// function to update a student course section by batch
app.patch(
  '/database/courses/coursesection/details',
  jsonParser,
  async (req, res) => {
    sqlClient
      .updateStudentCourseSection(req.body)
      .then(() => {
        console.log('done running!!!')
        res.status(200).send('Update successful')
      })
      .catch((err) => {
        if (err.code === 'ECONNREFUSED') {
          res.status(503).send({ error: 'Database connection failed' })
        }

        res.status(500).send({ error: 'Internal Server Error' })
      })
  },
)

// retrieve all semesters by academic year
app.get('/database/calendar_sessions', async (req, res) => {
  sqlClient
    .retrieveCalendarSessions()
    .then((result) => {
      res.json(result)
    })
    .catch((err) => {
      if (err.code === 'ECONNREFUSED') {
        res.status(503).send({ error: 'Database connection failed' })
      }

      res.status(500).send({ error: 'Internal Server Error' })
    })
})

// delete an academic year
app.delete('/database/calendar_sessions', async (req, res) => {
  sqlClient
    .deleteCalendarSession(req.query)
    .then((result) => {
      res.json(result)
    })
    .catch((err) => {
      if (err.code === 'ECONNREFUSED') {
        res.status(503).send({ error: 'Database connection failed' })
      }

      res.status(500).send({ error: 'Internal Server Error' })
    })
})

// delete a semester
app.delete('/database/calendar_sessions/semester', async (req, res) => {
  sqlClient
    .deleteCalendarSessionSemester(req.query)
    .then((result) => {
      res.json(result)
    })
    .catch((err) => {
      if (err.code === 'ECONNREFUSED') {
        res.status(503).send({ error: 'Database connection failed' })
      }

      res.status(500).send({ error: 'Internal Server Error' })
    })
})

// retrieve a semester by the academic year
app.get('/database/calendar_sessions/semester', async (req, res) => {
  sqlClient
    .retrieveCalendarSessionSemester()
    .then((result) => {
      res.json(result)
    })
    .catch((err) => {
      if (err.code === 'ECONNREFUSED') {
        res.status(503).send({ error: 'Database connection failed' })
      }

      res.status(500).send({ error: 'Internal Server Error' })
    })
})

// function to add a new person to the database
app.post('/database/person', jsonParser, async (req, res) => {
  sqlClient
    .addPerson(req.body)
    .then((result) => {
      res.json(result)
    })
    .catch((err) => {
      if (err.cod === 'ECONNREFUSED') {
        res.status(503).send({ error: 'Database connection failed' })
      }

      res.status(500).send({ error: 'Internal Server Error' })
    })
})

app.post(
  '/database/pendingAccounts',
  checkJwtDatabase,
  jsonParser,
  async (req, res) => {
    sqlClient.postPendingAccountRequest(req.body).catch((err) => {
      if (err.code === 'ECONNREFUSED') {
        res.status(503).send({ error: 'Database connection failed' })
      }

      res.status(500).send({ error: 'Internal Server Error' })
    })
  },
)

// function to add a new course to the database
app.post(
  '/database/courses',
  checkJwtDatabase,
  jsonParser,
  async (req, res) => {
    sqlClient
      .addCourse(req.body)
      .then(() => {
        res.status(200).send('Update successful')
      })
      .catch((err) => {
        if (err.code === 'ERRCONNREFUSED') {
          res.status(503).send({ error: 'Database connection failed' })
        }

        res.status(500).send({ error: 'Internal Server Error' })
      })
  },
)

app.get('/database/authid', jsonParser, async (req, res) => {
  sqlClient
    .retrieveAuthIdByPersonId(req.query.personIds.split(','))
    .then((response) => {
      res.json(response)
    })
    .catch((err) => {
      if (err.code === 'ERRCONNREFUSED') {
        res.status(503).send({ error: 'Database connection failed.' })
      }

      res.status(500).send({ error: 'Internal Server Error' })
    })
})

// function to create a new course section
app.post('/database/courses/coursesection', jsonParser, async (req, res) => {
  console.log('running')
  sqlClient
    .createCourseSection(req.body)
    .then((response) => {
      res.json(response)
    })
    .catch((err) => {
      if (err.code === 'ERRCONNREFUSED') {
        res.status(503).send({ error: 'Database connection failed.' })
      }

      res.status(500).send({ error: 'Internal Server Error' })
    })
})

// function to assign a teacher to a course section
app.post(
  '/database/courses/coursesection/teacher',
  jsonParser,
  async (req, res) => {
    console.log('ASSIGNING TEACHERS')
    sqlClient
      .assignTeachersToCourseSection(req.body)
      .then((response) => {
        res.json(response)
      })
      .catch((err) => {
        if (err.code === 'ERRCONNREFUSED') {
          res.status(503).send({ error: 'Database connection failed.' })
        }

        res.status(500).send({ error: 'Internal Server Error' })
      })
  },
)

app.post(
  '/database/courses/coursesection/details',
  jsonParser,
  async (req, res) => {
    console.log('assigning students!')
    console.log(`Data: ${req.body}`)

    sqlClient
      .assignStudentsToCourseSection(req.body)
      .then((response) => {
        res.json(response)
      })
      .catch((err) => {
        if (err.code === 'ERRCONNREFUSED') {
          res.status(503).send({ error: 'Database connection failed.' })
        }

        res.status(500).send({ error: 'Internal Server Error' })
      })
  },
)

app.delete(
  '/database/courses/coursesection/details',
  checkJwtDatabase,
  async (req, res) => {
    console.log('deleting students!')
    console.log(req.query)

    sqlClient
      .deleteStudentCourseSection(req.query)
      .then((response) => {
        res.json(response)
      })
      .catch((err) => {
        if (err.code === 'ERRCONNREFUSED') {
          res.status(503).send({ error: 'Database connection failed.' })
        }

        res.status(500).send({ error: 'Internal Server Error' })
      })
  },
)

// function to delete a teacher from a course section
app.delete(
  '/database/courses/coursesection/teacher',
  checkJwtDatabase,
  async (req, res) => {
    console.log('DELETING TEACHERS')
    sqlClient
      .deleteTeachersFromCourseSection(req.query)
      .then((response) => {
        res.json(response)
      })
      .catch((err) => {
        if (err.code === 'ERRCONNREFUSED') {
          res.status(503).send({ error: 'Database connection failed.' })
        }

        res.status(500).send({ error: 'Internal Server Error' })
      })
  },
)

// update the details of a course section
app.patch('/database/courses/coursesection', jsonParser, async (req, res) => {
  sqlClient
    .updateCourseSection(req.body)
    .then((response) => {
      res.json(response)
    })
    .catch((err) => {
      if (err.code === 'ERRCONNREFUSED') {
        res.status(503).send({ error: 'Database connection failed.' })
      }

      res.status(500).send({ error: 'Internal Server Error' })
    })
})

// clear the grades of a coursesection
app.patch(
  '/database/courses/coursesection/clear_grades',
  jsonParser,
  async (req, res) => {
    sqlClient
      .clearStudentSectionGrade(req.body)
      .then((response) => {
        res.json(response)
      })
      .catch((err) => {
        if (err.code === 'ERRCONNREFUSED') {
          res.status(503).send({ error: 'Database connection failed.' })
        }

        res.status(500).send({ error: 'Internal Server Error' })
      })
  },
)

// delete a course section
app.delete('/database/courses/coursesection', async (req, res) => {
  sqlClient
    .deleteCourseSection(req.query)
    .then((response) => {
      res.json(response)
    })
    .catch((err) => {
      if (err.code === 'ERRCONNREFUSED') {
        res.status(503).send({ error: 'Database connection failed.' })
      }

      res.status(500).send({ error: 'Internal Server Error' })
    })
})

// merge the approved grades of the pending student course section into the final
app.patch(
  '/database/courses/coursesection/grades',
  checkJwtDatabase,
  jsonParser,
  async (req, res) => {
    console.log('merging student grades!')
    console.log(req.body)
    sqlClient
      .mergeStudentCourseSection(req.body)
      .then((response) => {
        res.json(response)
      })
      .catch((err) => {
        if (err.code === 'ERRCONNREFUSED') {
          res.status(503).send({ error: 'Database connection failed.' })
        }

        res.status(500).send({ error: 'Internal Server Error' })
      })
  },
)

// delete a course section
app.delete('/database/courses/coursesection', async (req, res) => {
  sqlClient
    .deleteCourseSection(req.query)
    .then((response) => {
      res.json(response)
    })
    .catch((err) => {
      if (err.code === 'ERRCONNREFUSED') {
        res.status(503).send({ error: 'Database connection failed.' })
      }

      res.status(500).send({ error: 'Internal Server Error' })
    })
})

// merge the approved grades of the pending student course section into the final
app.patch(
  '/database/courses/coursesection/grades',
  checkJwtDatabase,
  jsonParser,
  async (req, res) => {
    console.log('merging student grades!')
    console.log(req.body)
    sqlClient
      .mergeStudentCourseSection(req.body)
      .then((response) => {
        res.json(response)
      })
      .catch((err) => {
        if (err.code === 'ERRCONNREFUSED') {
          res.status(503).send({ error: 'Database connection failed.' })
        }

        res.status(500).send({ error: 'Internal Server Error' })
      })
  },
)

// Management functions
// function to retrieve users
app.get(
  '/auth/users',
  checkJwtDatabase,
  jwtAuthz(['read:approve_account'], {
    customUserKey: 'auth',
    customScopeKey: 'permissions',
    checkAllScopes: true,
  }),
  async (req, res) => {
    // options to retrieve a management api access token
    const options = {
      method: 'POST',
      url: 'https://dev-uslaj1b5ati50067.us.auth0.com/oauth/token',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: 'elArxXf2Id1DacHIuIe2LDtTFkSssNNd',
        client_secret: process.env.M2M_MANAGEMENT_API_SECRET,
        audience: 'https://dev-uslaj1b5ati50067.us.auth0.com/api/v2/',
      }),
    }
    const tokenResponse = await axios.request(options)
    const managementToken = tokenResponse.data.access_token

    // convert the query to a string
    let q = ''
    if (req.query.user_id) {
      q = `user_id:"${req.query.user_id}"`
    }

    try {
      const response = await axios.get(
        'https://dev-uslaj1b5ati50067.us.auth0.com/api/v2/users',
        {
          params: { q: q, search_engine: 'v3' },
          headers: {
            Authorization: `Bearer ${managementToken}`,
          },
        },
      )

      const filteredData = response.data.map((user) => {
        return {
          approved: user.app_metadata?.approved,
          email: user.email,
          email_verified: user.email_verified,
          name: user.name,
          user_id: user.user_id,
        }
      })

      res.json(response.data)
    } catch (err) {
      console.error('Error trying to access the Management API', err)
      throw err
    }
  },
)

// endpoint to update a specific users app and user metadata
app.patch('/auth/users/:id', checkJwtDatabase, jsonParser, async (req, res) => {
  const options = {
    method: 'POST',
    url: 'https://dev-uslaj1b5ati50067.us.auth0.com/oauth/token',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: 'elArxXf2Id1DacHIuIe2LDtTFkSssNNd',
      client_secret: process.env.M2M_MANAGEMENT_API_SECRET,
      audience: 'https://dev-uslaj1b5ati50067.us.auth0.com/api/v2/',
    }),
  }
  const tokenResponse = await axios.request(options)
  const managementToken = tokenResponse.data.access_token

  const data = {
    ...(req.body.app_metadata && { app_metadata: req.body.app_metadata }), // Include app_metadata only if it exists
    ...(req.body.user_metadata && { user_metadata: req.body.user_metadata }),
  }

  // might want to use a validator to sanitize whatever is entered into req.body
  try {
    await axios.patch(
      `https://dev-uslaj1b5ati50067.us.auth0.com/api/v2/users/${req.params.id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${managementToken}`,
          'content-type': 'application/json',
        },
      },
    )

    res.status(200).send('Update successful')
  } catch (error) {
    console.error('Error trying to access the Management API', err)
    throw err
  }
})

// function to get all the possible roles
app.get('/auth/roles', async (req, res) => {
  const options = {
    method: 'POST',
    url: 'https://dev-uslaj1b5ati50067.us.auth0.com/oauth/token',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: 'elArxXf2Id1DacHIuIe2LDtTFkSssNNd',
      client_secret: process.env.M2M_MANAGEMENT_API_SECRET,
      audience: 'https://dev-uslaj1b5ati50067.us.auth0.com/api/v2/',
    }),
  }
  const tokenResponse = await axios.request(options)
  const managementToken = tokenResponse.data.access_token

  try {
    const response = await axios.get(
      'https://dev-uslaj1b5ati50067.us.auth0.com/api/v2/roles',
      {
        headers: {
          Authorization: `Bearer ${managementToken}`,
        },
      },
    )

    res.json(response.data)
  } catch (err) {
    console.error('Error trying to access the Management API', err)
    throw err
  }
})

// function to get the current roles of the user
app.get(
  '/auth/users/:id/roles',
  // checkJwtDatabase,
  // jwtAuthz(["read:user_roles"], {
  //   customUserKey: "auth",
  //   customScopeKey: "permissions",
  //   checkAllScopes: true,
  // }),
  async (req, res) => {
    const options = {
      method: 'POST',
      url: 'https://dev-uslaj1b5ati50067.us.auth0.com/oauth/token',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: 'elArxXf2Id1DacHIuIe2LDtTFkSssNNd',
        client_secret: process.env.M2M_MANAGEMENT_API_SECRET,
        audience: 'https://dev-uslaj1b5ati50067.us.auth0.com/api/v2/',
      }),
    }
    const tokenResponse = await axios.request(options)
    const managementToken = tokenResponse.data.access_token

    try {
      const response = await axios.get(
        `https://dev-uslaj1b5ati50067.us.auth0.com/api/v2/users/${req.params.id}/roles`,
        {
          headers: {
            Authorization: `Bearer ${managementToken}`,
            Accept: 'application/json',
          },
        },
      )

      res.json(response.data)
    } catch (error) {
      console.error('Error trying to access the Management API', error)
      throw error
    }
  },
)

// function to remove role from a user in auth0
app.delete(
  '/auth/users/:id/roles/disable',
  jsonParser,
  // checkJwtDatabase,
  // jwtAuthz(["write:user_roles"], {
  //   customUserKey: "auth",
  //   customScopeKey: "permissions",
  //   checkAllScopes: true,
  // }),
  async (req, res) => {
    const options = {
      method: 'POST',
      url: 'https://dev-uslaj1b5ati50067.us.auth0.com/oauth/token',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: 'elArxXf2Id1DacHIuIe2LDtTFkSssNNd',
        client_secret: process.env.M2M_MANAGEMENT_API_SECRET,
        audience: 'https://dev-uslaj1b5ati50067.us.auth0.com/api/v2/',
      }),
    }
    const tokenResponse = await axios.request(options)
    const managementToken = tokenResponse.data.access_token

    try {
      await axios.delete(
        `https://dev-uslaj1b5ati50067.us.auth0.com/api/v2/users/${req.params.id}/roles`,
        {
          headers: {
            Authorization: `Bearer ${managementToken}`,
          },
          data: { roles: req.body.roles },
        },
      )

      res.status(200).send('Roles removed!')
    } catch (error) {
      res.status(401).send('Failed.')
    }
  },
)

// function to remove a role from a user in the database
app.delete(
  '/auth/users/:id/roles/clear_records',
  jsonParser,
  // checkJwtDatabase,
  // jwtAuthz(["write:user_roles"], {
  //   customUserKey: "auth",
  //   customScopeKey: "permissions",
  //   checkAllScopes: true,
  // }),
  async (req, res) => {
    try {
      // delete corresponding roles from database as well
      req.body.role_names.map(async (rolename) => {
        await sqlClient.removeRole({
          personid: req.body.personid,
          rolename: rolename,
        })
      })

      res.status(200).send('Roles removed!')
    } catch (error) {
      res.status(401).send('Failed.')
    }
  },
)

// function to delete the roles of a user
app.delete(
  '/auth/users/:id/roles/delete',
  jsonParser,
  // checkJwtDatabase,
  // jwtAuthz(["write:user_roles"], {
  //   customUserKey: "auth",
  //   customScopeKey: "permissions",
  //   checkAllScopes: true,
  // }),
  async (req, res) => {
    const options = {
      method: 'POST',
      url: 'https://dev-uslaj1b5ati50067.us.auth0.com/oauth/token',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: 'elArxXf2Id1DacHIuIe2LDtTFkSssNNd',
        client_secret: process.env.M2M_MANAGEMENT_API_SECRET,
        audience: 'https://dev-uslaj1b5ati50067.us.auth0.com/api/v2/',
      }),
    }
    const tokenResponse = await axios.request(options)
    const managementToken = tokenResponse.data.access_token

    try {
      await axios.delete(
        `https://dev-uslaj1b5ati50067.us.auth0.com/api/v2/users/${req.params.id}/roles`,
        {
          headers: {
            Authorization: `Bearer ${managementToken}`,
          },
          data: { roles: req.body.roles },
        },
      )

      // delete corresponding roles from database as well
      req.body.role_names.map(async (rolename) => {
        await sqlClient.removeRole({
          personid: req.body.personid,
          rolename: rolename,
        })
      })

      res.status(200).send('Roles removed!')
    } catch (error) {
      res.status(401).send('Failed.')
    }
  },
)

// function to add roles to a user
app.post('/auth/users/:id/roles', jsonParser, async (req, res) => {
  const options = {
    method: 'POST',
    url: 'https://dev-uslaj1b5ati50067.us.auth0.com/oauth/token',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: 'elArxXf2Id1DacHIuIe2LDtTFkSssNNd',
      client_secret: process.env.M2M_MANAGEMENT_API_SECRET,
      audience: 'https://dev-uslaj1b5ati50067.us.auth0.com/api/v2/',
    }),
  }
  const tokenResponse = await axios.request(options)
  const managementToken = tokenResponse.data.access_token

  try {
    // update the roles in the auth0 tenant
    await axios.post(
      `https://dev-uslaj1b5ati50067.us.auth0.com/api/v2/users/${req.params.id}/roles`,
      {
        roles: req.body.roles,
      },
      {
        headers: {
          Authorization: `Bearer ${managementToken}`,
        },
      },
    )

    // add the roles to the database
    req.body.role_names.map(async (rolename) => {
      await sqlClient.assignRole({
        personid: req.body.personid,
        rolename: rolename,
      })
    })

    res.status(200).send('Roles added successfully!')
  } catch (error) {
    res.status(401).send('error')
  }
})

app.listen(port, () => {
  console.log(`Listening on: ${port}`)
})

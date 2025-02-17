import { Pool } from 'pg'

const DATABASE_DETAILS = {
  connectionString: process.env.DB_CONNECTION_STRING,
}
const stcf_db = new Pool(DATABASE_DETAILS)

export { stcf_db }

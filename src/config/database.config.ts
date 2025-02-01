import { Pool } from 'pg'

const DATABASE_DETAILS = {
  user: process.env.DATABASE_USERNAME as string,
  password: process.env.DATABASE_PASSWORD as string,
  host: process.env.DATABASE_HOST as string,
  port: Number(process.env.DATABASE_PORT) as number,
  database: process.env.DATABASE_NAME as string,
}
const stcf_db = new Pool(DATABASE_DETAILS)

export { stcf_db }

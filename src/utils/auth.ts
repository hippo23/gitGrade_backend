import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@src/config/auth_db.config";
import { admin, openAPI } from "better-auth/plugins"
import * as schema from './../../auth-schema'
import { ac, school_admin, superadmin, student, faculty, guest } from "./auth/permissions";
import { guardAdminApiRoutes, infosheetPlugin } from "@src/utils/auth/middleware";


const { PG_AUTH_CONNECTION_STRING } = process.env

export const auth = betterAuth({
 database: drizzleAdapter(db, {
   provider: 'pg',
  schema: {
   ...schema,
  }
 }),
 emailAndPassword: {
    enabled: true,
    autoSignIn: false,
 },
 plugins: [
   admin({
      defaultRole: "guest",
      adminRoles: ["admin", "superadmin"],
      ac,
      roles: {
         school_admin,
         superadmin,
         faculty,
         student,
         guest
      }
   }),
   openAPI(),
   guardAdminApiRoutes(),
   infosheetPlugin()
 ],
 trustedOrigins: ['http://localhost:8080']
})
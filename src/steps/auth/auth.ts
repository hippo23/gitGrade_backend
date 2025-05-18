import { db } from "@src/config/auth_db.config";
import { user } from "../../../auth-schema";
import { eq } from "drizzle-orm";
const logErrorWrapper = require('@src/utils/proxy_decorators')

async function userHasFilledInfoSheetStep (input: { state: boolean, id: string}) {
    const original = await db.select({field1: user.hasFilledInfoSheet}).from(user).where(eq(user.id, input.id))
    await db.update(user).set({hasFilledInfoSheet: input.state}).where(eq(user.id, input.id)).returning()
    console.log('this step is running')
    return original
}

async function userExists (input: {id: string}) {
  const data = await db.select({field1: user.id}).from(user).where(eq(user.id, input.id))
  console.log('this step is also running')
  
  if (data.length > 0) {
    throw new Error("User does not exist.")
  }

  return;
}

module.exports = new Proxy({
    userHasFilledInfoSheetStep,
    userExists
}, {
    get(target, prop) {
        if (typeof target[prop] === 'function') {
          return logErrorWrapper(target[prop], prop, 'AUTH_STEP')
        }
        return target[prop]
      },
})

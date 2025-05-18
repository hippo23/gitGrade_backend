import { db } from "@src/config/auth_db.config";
import {personInDataStore} from "@src/../drizzle/schema"
import { eq } from "drizzle-orm";
import { infosheetSchema } from "@src/types/onboarding/onboarding";
import { z } from "zod";
const logErrorWrapper = require('@src/utils/proxy_decorators')

async function onboardUserInDb(input: z.infer<typeof infosheetSchema> & { id: number }) {
    // insert data into database
    const original = await db.select().from(personInDataStore).where(eq(personInDataStore.personid, input.id))
    await db.update(personInDataStore).set({firstname: input.firstName, middlename: input.middleName, lastname: input.lastName, birthday: input.birthday})

    console.log('last step is running')

    if (original.length > 0) {
        return original[0]
    } else {
        return null;
    }
}


module.exports = new Proxy({
    onboardUserInDb
}, {
    get(target, prop) {
        if (typeof target[prop] === 'function') {
          return logErrorWrapper(target[prop], prop, 'AUTH_STEP')
        }
        return target[prop]
      },
})

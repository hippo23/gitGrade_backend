import { createWorkflow } from "@src/utils/workflows/workflows"
import type { StepProxy } from "@src/types/workflows/workflows"
import { infosheetSchema } from "@src/types/onboarding/onboarding"
const logErrorWrapper = require('@src/utils/proxy_decorators')
const auth_steps = require('@src/steps/auth/auth')
const db_steps = require('@src/steps/database/database')
import { z } from "zod"

const onboardUser = createWorkflow('onboard-user', (step: StepProxy<any, any>) => {
  return async (input: z.infer<typeof infosheetSchema> & { dbId: number, authId: string}) => {
    const result1 = await step.compensate(auth_steps.userHasFilledInfoSheetStep, {
      compensate: async (input, originalValue) => {
        await auth_steps.userHasFilledInfoSheetStep({state: originalValue, id: input.authId})
      }
    })({state: true, id: input.authId})

    console.log(result1)
    console.log('building?')

    await step(auth_steps.userExists)(input)

    await step.compensate(db_steps.onboardUserInDb, {
      compensate: async (input, originalValue) => {
        await db_steps.onboardUserInDb({...originalValue, id: input.dbId})
      }
    })(input)

    return;
  }
})


module.exports = new Proxy({
  onboardUser
}, {
      get(target, prop) {
        if (typeof target[prop] === 'function') {
          return logErrorWrapper(target[prop], prop, 'COURSE_SERVICE')
        }
        return target[prop]
      },
  }
)

export {}
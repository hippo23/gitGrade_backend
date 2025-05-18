import { z } from "zod";

const infosheetSchema = z.object({
    firstName: z.string().min(1),
    middleName: z.string().min(1),
    lastName: z.string().min(1),
    address: z.string().min(1),
    birthday: z.string().date().min(1),
})

export {infosheetSchema}
import type { BetterAuthPlugin } from "better-auth/types";
import { createAuthEndpoint, createAuthMiddleware } from "better-auth/plugins";
import { auth } from "../auth";
import { APIError } from "better-auth/api";
import { z } from "zod";

export const guardAdminApiRoutes = () => {
    return {
        id: "guardAdminApiRoutes",
        hooks: {
            before: [{
                matcher: (context) => {
                    return context.path.startsWith('/admin')
                },
                handler: createAuthMiddleware(async(ctx) => {
                    const session = await auth.api.getSession({
                        headers: ctx.headers as Headers
                    })

                    const isAdmin = session?.user.role === 'admin' || session?.user.role === 'superadmin'

                    if (!isAdmin) {
                        throw new APIError("BAD_REQUEST", {
                            message: 'You are not an admin. If this is a mistake, please bring it up to the technical team.'
                        })
                    }
                })
            }]
        }
    } satisfies BetterAuthPlugin
}

export const infosheetPlugin = () => {
    return {
        id: "infosheetPlugin",
        schema: {
            user: {
                fields: {
                    hasFilledInfoSheet: {
                        type: "boolean",
                        required: true,
                        defaultValue: "false",
                        input: false
                    }
                }
            }
        },
        endpoints: {
            markInfosheet: createAuthEndpoint("/infosheetPlugin/mark_infosheet", { method: "POST", body: z.object({id: z.number()}) }, async(ctx) => {
                ctx.context.adapter.update({
                    model: "user",
                    where: [{
                        field: 'id',
                        operator: "eq",
                        value: ctx.body.id
                    }],
                    update: {
                        hasViewedInfoSheet: true
                    }
                })
            })
        }
    } satisfies BetterAuthPlugin
}
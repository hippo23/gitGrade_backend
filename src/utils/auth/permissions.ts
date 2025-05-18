import { createAccessControl } from "better-auth/plugins/access";

export const statement = {
    course: ["course: view", "course:create, course:delete, course:update"],
    student: ["student:ban, student:approve, student:update"],
    section: ["section:add_student", "section:remove_student", "section: view", "section:create", "section:delete", "section:update", "section:set_grade", "section:approve_grade"],
    announcement: ["announcement: view", "announcement:create", "announcement:delete", "announcement:update"]
} as const;

export const ac = createAccessControl(statement)

export const student = ac.newRole({
    course: ["course: view"],
    section: ["section: view"],
    announcement: ["announcement: view"]
})

export const guest = ac.newRole({
    section: [],
    course: [],
    student: [],
    announcement: []
})

export const school_admin = ac.newRole({
    course: ["course: view", "course:create, course:delete, course:update"],
    student: ["student:ban, student:approve, student:update"],
    section: ["section:add_student","section:remove_student", "section: view", "section:create", "section:delete", "section:update", "section:set_grade", "section:approve_grade"],
    announcement: ["announcement: view", "announcement:create", "announcement:delete", "announcement:update"]
})

export const faculty = ac.newRole({
    section: ["section:add_student", "section:remove_student", "section: view", "section:set_grade"],
    announcement: ["announcement: view", "announcement:create", "announcement:delete", "announcement:update"]
})

export const superadmin = ac.newRole({
    course: ["course: view", "course:create, course:delete, course:update"],
    student: ["student:ban, student:approve, student:update"],
    section: ["section:add_student", "section:remove_student", "section: view", "section:create", "section:delete", "section:update", "section:set_grade", "section:approve_grade"],
    announcement: ["announcement: view", "announcement:create", "announcement:delete", "announcement:update"]
})

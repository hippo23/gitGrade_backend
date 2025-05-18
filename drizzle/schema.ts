import { pgTable, pgSchema, serial, varchar, foreignKey, unique, integer, check, date, boolean, timestamp, text, jsonb, time, primaryKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"
import { citext } from './types'

export const dataStore = pgSchema("data-store");
export const approvalstatusEnumInDataStore = dataStore.enum("approvalstatus_enum", ['rejected', 'pending', 'approved'])
export const dayInDataStore = dataStore.enum("day", ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])
export const degreeTypeInDataStore = dataStore.enum("degree_type", ['BA', 'BS', 'VOCATIONAL'])
export const gradeStatusInDataStore = dataStore.enum("grade_status", ['rejected', 'pending', 'approved'])
export const gradeValueInDataStore = dataStore.enum("grade_value", ['1.00', '1.25', '1.50', '1.75', '2.00', '2.25', '2.50', '2.75', '3.00', '5.00'])
export const semesterInDataStore = dataStore.enum("semester", ['1st', '2nd'])
export const semestralPeriodInDataStore = dataStore.enum("semestral_period", ['1', '2'])

export const organizationOrganizationidSeqInDataStore = dataStore.sequence("organization_organizationid_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const organizationcalendarsemesterOrganizationcalendarsemesteridSeqInDataStore = dataStore.sequence("organizationcalendarsemester_organizationcalendarsemesterid_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const courseCourseidSeqInDataStore = dataStore.sequence("course_courseid_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const organizationcalendarOrganizationcalendaridSeqInDataStore = dataStore.sequence("organizationcalendar_organizationcalendarid_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const coursesectionCoursesectionidSeqInDataStore = dataStore.sequence("coursesection_coursesectionid_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const personPersonidSeqInDataStore = dataStore.sequence("person_personid_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const roleRoleidSeqInDataStore = dataStore.sequence("role_roleid_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const organizationpersonroleOrganizationpersonroleidSeqInDataStore = dataStore.sequence("organizationpersonrole_organizationpersonroleid_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const studentcoursesectionStudentcoursesectionidSeqInDataStore = dataStore.sequence("studentcoursesection_studentcoursesectionid_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const pendingstudentcoursesectionPendingstudentcoursesectionidSeqInDataStore = dataStore.sequence("pendingstudentcoursesection_pendingstudentcoursesectionid_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const degreeDegreeidSeqInDataStore = dataStore.sequence("degree_degreeid_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const announcementAnnouncementidSeqInDataStore = dataStore.sequence("announcement_announcementid_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const forumForumidSeqInDataStore = dataStore.sequence("forum_forumid_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const slotTagSlotTagidSeqInDataStore = dataStore.sequence("slot_tag_slot_tagid_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const timeslotTimeslotidSeqInDataStore = dataStore.sequence("timeslot_timeslotid_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const announcementTagAnnouncementTagIdSeqInDataStore = dataStore.sequence("announcement_tag_announcement_tag_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })

export const organizationInDataStore = dataStore.table("organization", {
	organizationid: serial().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	shortname: varchar({ length: 255 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	telephone: varchar({ length: 255 }).notNull(),
});

export const courseInDataStore = dataStore.table("course", {
	courseid: serial().primaryKey().notNull(),
	name: varchar({ length: 100 }).notNull(),
	units: integer().notNull(),
	organizationid: integer(),
	description: varchar({ length: 255 }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.organizationid],
			foreignColumns: [organizationInDataStore.organizationid],
			name: "course_organizationid_fkey"
		}).onDelete("cascade"),
	unique("unique_name").on(table.name),
]);

export const organizationcalendarInDataStore = dataStore.table("organizationcalendar", {
	organizationcalendarid: serial().primaryKey().notNull(),
	organizationid: integer(),
	academicYear: varchar("academic_year", { length: 10 }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.organizationid],
			foreignColumns: [organizationInDataStore.organizationid],
			name: "organizationcalendar_organizationid_fkey"
		}).onDelete("cascade"),
	unique("unique_calendar_academic_year").on(table.organizationcalendarid, table.academicYear),
	check("academic_year_format", sql`((academic_year)::text ~ '^\d{4}-\d{4}$'::text) AND (("substring"((academic_year)::text, '^\d{4}'::text))::integer < ("substring"((academic_year)::text, '\d{4}$'::text))::integer)`),
]);

export const organizationcalendarsemesterInDataStore = dataStore.table("organizationcalendarsemester", {
	organizationcalendarsemesterid: serial().primaryKey().notNull(),
	semester: semestralPeriodInDataStore().notNull(),
	organizationcalendarid: integer(),
	startdate: date().default(sql`CURRENT_DATE`).notNull(),
	enddate: date(),
}, (table) => [
	foreignKey({
			columns: [table.organizationcalendarid],
			foreignColumns: [organizationcalendarInDataStore.organizationcalendarid],
			name: "organizationcalendarsemester_organizationcalendarid_fkey"
		}).onDelete("cascade"),
	unique("unique_semester_year").on(table.semester, table.organizationcalendarid),
]);

export const coursesectionInDataStore = dataStore.table("coursesection", {
	coursesectionid: serial().primaryKey().notNull(),
	maximumcapacity: integer().notNull(),
	completionstatus: boolean().default(false).notNull(),
	name: varchar({ length: 100 }).notNull(),
	courseid: integer(),
	organizationcalendarsemesterid: integer(),
}, (table) => [
	foreignKey({
			columns: [table.courseid],
			foreignColumns: [courseInDataStore.courseid],
			name: "coursesection_courseid_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.organizationcalendarsemesterid],
			foreignColumns: [organizationcalendarsemesterInDataStore.organizationcalendarsemesterid],
			name: "coursesection_organizationcalendarsemesterid_fkey"
		}).onDelete("cascade"),
	unique("unique_section").on(table.name, table.courseid, table.organizationcalendarsemesterid),
]);

export const roleInDataStore = dataStore.table("role", {
	roleid: serial().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	organizationid: integer(),
}, (table) => [
	foreignKey({
			columns: [table.organizationid],
			foreignColumns: [organizationInDataStore.organizationid],
			name: "role_organizationid_fkey"
		}).onDelete("cascade"),
]);

export const organizationpersonroleInDataStore = dataStore.table("organizationpersonrole", {
	organizationpersonroleid: serial().primaryKey().notNull(),
	entrydate: date().notNull(),
	exitdate: date(),
	roleid: integer(),
	personid: integer(),
}, (table) => [
	foreignKey({
			columns: [table.roleid],
			foreignColumns: [roleInDataStore.roleid],
			name: "organizationpersonrole_roleid_fkey"
		}),
	foreignKey({
			columns: [table.personid],
			foreignColumns: [personInDataStore.personid],
			name: "organizationpersonrole_personid_fkey"
		}).onDelete("cascade"),
	unique("unique_assignment").on(table.roleid, table.personid),
]);

export const personInDataStore = dataStore.table("person", {
	personid: serial().primaryKey().notNull(),
	firstname: varchar({ length: 100 }).notNull(),
	lastname: varchar({ length: 100 }).notNull(),
	middlename: varchar({ length: 100 }).notNull(),
	location: varchar({ length: 100 }).notNull(),
	birthday: timestamp({ mode: 'string' }).notNull(),
	authid: varchar({ length: 255 }),
});

export const studentcoursesectionInDataStore = dataStore.table("studentcoursesection", {
	studentcoursesectionid: serial().primaryKey().notNull(),
	coursesectionid: integer(),
	organizationpersonroleid: integer(),
	grade: gradeValueInDataStore(),
}, (table) => [
	foreignKey({
			columns: [table.coursesectionid],
			foreignColumns: [coursesectionInDataStore.coursesectionid],
			name: "studentcoursesection_coursesectionid_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.organizationpersonroleid],
			foreignColumns: [organizationpersonroleInDataStore.organizationpersonroleid],
			name: "studentcoursesection_organizationpersonroleid_fkey"
		}).onDelete("cascade"),
	unique("unique_student_section").on(table.coursesectionid, table.organizationpersonroleid),
]);

export const pendingstudentcoursesectionInDataStore = dataStore.table("pendingstudentcoursesection", {
	pendingstudentcoursesectionid: serial().primaryKey().notNull(),
	studentcoursesectionid: integer(),
	createdAt: date("created_at").default(sql`CURRENT_DATE`).notNull(),
	gradeStatus: gradeStatusInDataStore("grade_status").default('pending').notNull(),
	remarks: text().default(sql`NULL`),
	grade: gradeValueInDataStore().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.studentcoursesectionid],
			foreignColumns: [studentcoursesectionInDataStore.studentcoursesectionid],
			name: "pendingstudentcoursesection_studentcoursesectionid_fkey"
		}).onDelete("cascade"),
	unique("unique_grade_studentcoursesection").on(table.studentcoursesectionid),
]);

export const degreeInDataStore = dataStore.table("degree", {
	degreeid: serial().primaryKey().notNull(),
	type: degreeTypeInDataStore().notNull(),
	length: integer().notNull(),
	name: varchar({ length: 255 }).notNull(),
});

export const announcementInDataStore = dataStore.table("announcement", {
	announcementid: serial().primaryKey().notNull(),
	title: varchar({ length: 255 }).notNull(),
	body: jsonb().notNull(),
	createdat: date().notNull(),
	lasteditedat: date(),
	author: integer(),
}, (table) => [
	foreignKey({
			columns: [table.author],
			foreignColumns: [organizationpersonroleInDataStore.organizationpersonroleid],
			name: "announcement_author_fkey"
		}).onUpdate("cascade"),
]);

export const forumInDataStore = dataStore.table("forum", {
	forumid: serial().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	coursesectionid: integer(),
}, (table) => [
	foreignKey({
			columns: [table.coursesectionid],
			foreignColumns: [coursesectionInDataStore.coursesectionid],
			name: "forum_coursesectionid_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	unique("forum_name_coursesectionid_key").on(table.name, table.coursesectionid),
]);

export const timeslotInDataStore = dataStore.table("timeslot", {
	timeslotid: serial().primaryKey().notNull(),
	startTime: time("start_time").notNull(),
	endTime: time("end_time").notNull(),
	day: dayInDataStore().notNull(),
});

export const slotTagInDataStore = dataStore.table("slot_tag", {
	slotTagid: serial("slot_tagid").primaryKey().notNull(),
	// TODO: failed to parse database type 'citext'
	name: citext("name"),
}, (table) => [
	unique("slot_tag_name_key").on(table.name),
]);

export const announcementTagInDataStore = dataStore.table("announcement_tag", {
	announcementTagId: serial("announcement_tag_id").primaryKey().notNull(),
	// TODO: failed to parse database type 'citext'
	name: citext("name"),
}, (table) => [
	unique("announcement_tag_name_key").on(table.name),
]);

export const facultysectionassignmentInDataStore = dataStore.table("facultysectionassignment", {
	organizationpersonroleid: integer().notNull(),
	coursesectionid: integer().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.organizationpersonroleid],
			foreignColumns: [organizationpersonroleInDataStore.organizationpersonroleid],
			name: "facultysectionassignment_organizationpersonroleid_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.coursesectionid],
			foreignColumns: [coursesectionInDataStore.coursesectionid],
			name: "facultysectionassignment_coursesectionid_fkey"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.organizationpersonroleid, table.coursesectionid], name: "facultysectionassignment_pkey"}),
]);

export const degreecourseInDataStore = dataStore.table("degreecourse", {
	degreeid: integer().notNull(),
	courseid: integer().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.degreeid],
			foreignColumns: [degreeInDataStore.degreeid],
			name: "degreecourse_degreeid_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.courseid],
			foreignColumns: [courseInDataStore.courseid],
			name: "degreecourse_courseid_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	primaryKey({ columns: [table.degreeid, table.courseid], name: "degreecourse_pkey"}),
]);

export const forumannouncementInDataStore = dataStore.table("forumannouncement", {
	forumid: integer().notNull(),
	announcementid: integer().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.forumid],
			foreignColumns: [forumInDataStore.forumid],
			name: "forumannouncement_forumid_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.announcementid],
			foreignColumns: [announcementInDataStore.announcementid],
			name: "forumannouncement_announcementid_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	primaryKey({ columns: [table.forumid, table.announcementid], name: "forumannouncement_pkey"}),
]);

export const timeslotTagsInDataStore = dataStore.table("timeslot_tags", {
	timeslotid: integer().notNull(),
	slotTagid: integer("slot_tagid").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.timeslotid],
			foreignColumns: [timeslotInDataStore.timeslotid],
			name: "timeslot_tags_timeslotid_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.slotTagid],
			foreignColumns: [slotTagInDataStore.slotTagid],
			name: "timeslot_tags_slot_tagid_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	primaryKey({ columns: [table.timeslotid, table.slotTagid], name: "timeslot_tags_pkey"}),
]);

export const announcementTagLinkInDataStore = dataStore.table("announcement_tag_link", {
	announcementid: integer().notNull(),
	announcementTagId: integer("announcement_tag_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.announcementid],
			foreignColumns: [announcementInDataStore.announcementid],
			name: "announcement_tag_link_announcementid_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.announcementTagId],
			foreignColumns: [announcementTagInDataStore.announcementTagId],
			name: "announcement_tag_link_announcement_tag_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	primaryKey({ columns: [table.announcementid, table.announcementTagId], name: "announcement_tag_link_pkey"}),
]);

export const degreecoursedependenciesInDataStore = dataStore.table("degreecoursedependencies", {
	dependencyid: integer().notNull(),
	courseid: integer().notNull(),
	degreeid: integer().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.courseid, table.degreeid],
			foreignColumns: [degreecourseInDataStore.courseid, degreecourseInDataStore.degreeid],
			name: "degreecoursedependencies_courseid_degreeid_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.dependencyid, table.degreeid],
			foreignColumns: [degreecourseInDataStore.courseid, degreecourseInDataStore.degreeid],
			name: "degreecoursedependencies_dependencyid_degreeid_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	primaryKey({ columns: [table.dependencyid, table.courseid, table.degreeid], name: "degreecoursedependencies_pkey"}),
]);

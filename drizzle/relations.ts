import { relations } from "drizzle-orm/relations";
import { organizationInDataStore, courseInDataStore, organizationcalendarInDataStore, organizationcalendarsemesterInDataStore, coursesectionInDataStore, roleInDataStore, organizationpersonroleInDataStore, personInDataStore, studentcoursesectionInDataStore, pendingstudentcoursesectionInDataStore, announcementInDataStore, forumInDataStore, facultysectionassignmentInDataStore, degreeInDataStore, degreecourseInDataStore, forumannouncementInDataStore, timeslotInDataStore, timeslotTagsInDataStore, slotTagInDataStore, announcementTagLinkInDataStore, announcementTagInDataStore, degreecoursedependenciesInDataStore } from "./schema";

export const courseInDataStoreRelations = relations(courseInDataStore, ({one, many}) => ({
	organizationInDataStore: one(organizationInDataStore, {
		fields: [courseInDataStore.organizationid],
		references: [organizationInDataStore.organizationid]
	}),
	coursesectionInDataStores: many(coursesectionInDataStore),
	degreecourseInDataStores: many(degreecourseInDataStore),
}));

export const organizationInDataStoreRelations = relations(organizationInDataStore, ({many}) => ({
	courseInDataStores: many(courseInDataStore),
	organizationcalendarInDataStores: many(organizationcalendarInDataStore),
	roleInDataStores: many(roleInDataStore),
}));

export const organizationcalendarInDataStoreRelations = relations(organizationcalendarInDataStore, ({one, many}) => ({
	organizationInDataStore: one(organizationInDataStore, {
		fields: [organizationcalendarInDataStore.organizationid],
		references: [organizationInDataStore.organizationid]
	}),
	organizationcalendarsemesterInDataStores: many(organizationcalendarsemesterInDataStore),
}));

export const organizationcalendarsemesterInDataStoreRelations = relations(organizationcalendarsemesterInDataStore, ({one, many}) => ({
	organizationcalendarInDataStore: one(organizationcalendarInDataStore, {
		fields: [organizationcalendarsemesterInDataStore.organizationcalendarid],
		references: [organizationcalendarInDataStore.organizationcalendarid]
	}),
	coursesectionInDataStores: many(coursesectionInDataStore),
}));

export const coursesectionInDataStoreRelations = relations(coursesectionInDataStore, ({one, many}) => ({
	courseInDataStore: one(courseInDataStore, {
		fields: [coursesectionInDataStore.courseid],
		references: [courseInDataStore.courseid]
	}),
	organizationcalendarsemesterInDataStore: one(organizationcalendarsemesterInDataStore, {
		fields: [coursesectionInDataStore.organizationcalendarsemesterid],
		references: [organizationcalendarsemesterInDataStore.organizationcalendarsemesterid]
	}),
	studentcoursesectionInDataStores: many(studentcoursesectionInDataStore),
	forumInDataStores: many(forumInDataStore),
	facultysectionassignmentInDataStores: many(facultysectionassignmentInDataStore),
}));

export const roleInDataStoreRelations = relations(roleInDataStore, ({one, many}) => ({
	organizationInDataStore: one(organizationInDataStore, {
		fields: [roleInDataStore.organizationid],
		references: [organizationInDataStore.organizationid]
	}),
	organizationpersonroleInDataStores: many(organizationpersonroleInDataStore),
}));

export const organizationpersonroleInDataStoreRelations = relations(organizationpersonroleInDataStore, ({one, many}) => ({
	roleInDataStore: one(roleInDataStore, {
		fields: [organizationpersonroleInDataStore.roleid],
		references: [roleInDataStore.roleid]
	}),
	personInDataStore: one(personInDataStore, {
		fields: [organizationpersonroleInDataStore.personid],
		references: [personInDataStore.personid]
	}),
	studentcoursesectionInDataStores: many(studentcoursesectionInDataStore),
	announcementInDataStores: many(announcementInDataStore),
	facultysectionassignmentInDataStores: many(facultysectionassignmentInDataStore),
}));

export const personInDataStoreRelations = relations(personInDataStore, ({many}) => ({
	organizationpersonroleInDataStores: many(organizationpersonroleInDataStore),
}));

export const studentcoursesectionInDataStoreRelations = relations(studentcoursesectionInDataStore, ({one, many}) => ({
	coursesectionInDataStore: one(coursesectionInDataStore, {
		fields: [studentcoursesectionInDataStore.coursesectionid],
		references: [coursesectionInDataStore.coursesectionid]
	}),
	organizationpersonroleInDataStore: one(organizationpersonroleInDataStore, {
		fields: [studentcoursesectionInDataStore.organizationpersonroleid],
		references: [organizationpersonroleInDataStore.organizationpersonroleid]
	}),
	pendingstudentcoursesectionInDataStores: many(pendingstudentcoursesectionInDataStore),
}));

export const pendingstudentcoursesectionInDataStoreRelations = relations(pendingstudentcoursesectionInDataStore, ({one}) => ({
	studentcoursesectionInDataStore: one(studentcoursesectionInDataStore, {
		fields: [pendingstudentcoursesectionInDataStore.studentcoursesectionid],
		references: [studentcoursesectionInDataStore.studentcoursesectionid]
	}),
}));

export const announcementInDataStoreRelations = relations(announcementInDataStore, ({one, many}) => ({
	organizationpersonroleInDataStore: one(organizationpersonroleInDataStore, {
		fields: [announcementInDataStore.author],
		references: [organizationpersonroleInDataStore.organizationpersonroleid]
	}),
	forumannouncementInDataStores: many(forumannouncementInDataStore),
	announcementTagLinkInDataStores: many(announcementTagLinkInDataStore),
}));

export const forumInDataStoreRelations = relations(forumInDataStore, ({one, many}) => ({
	coursesectionInDataStore: one(coursesectionInDataStore, {
		fields: [forumInDataStore.coursesectionid],
		references: [coursesectionInDataStore.coursesectionid]
	}),
	forumannouncementInDataStores: many(forumannouncementInDataStore),
}));

export const facultysectionassignmentInDataStoreRelations = relations(facultysectionassignmentInDataStore, ({one}) => ({
	organizationpersonroleInDataStore: one(organizationpersonroleInDataStore, {
		fields: [facultysectionassignmentInDataStore.organizationpersonroleid],
		references: [organizationpersonroleInDataStore.organizationpersonroleid]
	}),
	coursesectionInDataStore: one(coursesectionInDataStore, {
		fields: [facultysectionassignmentInDataStore.coursesectionid],
		references: [coursesectionInDataStore.coursesectionid]
	}),
}));

export const degreecourseInDataStoreRelations = relations(degreecourseInDataStore, ({one, many}) => ({
	degreeInDataStore: one(degreeInDataStore, {
		fields: [degreecourseInDataStore.degreeid],
		references: [degreeInDataStore.degreeid]
	}),
	courseInDataStore: one(courseInDataStore, {
		fields: [degreecourseInDataStore.courseid],
		references: [courseInDataStore.courseid]
	}),
	degreecoursedependenciesInDataStores_courseid: many(degreecoursedependenciesInDataStore, {
		relationName: "degreecoursedependenciesInDataStore_courseid_degreecourseInDataStore_courseid"
	}),
	degreecoursedependenciesInDataStores_dependencyid: many(degreecoursedependenciesInDataStore, {
		relationName: "degreecoursedependenciesInDataStore_dependencyid_degreecourseInDataStore_courseid"
	}),
}));

export const degreeInDataStoreRelations = relations(degreeInDataStore, ({many}) => ({
	degreecourseInDataStores: many(degreecourseInDataStore),
}));

export const forumannouncementInDataStoreRelations = relations(forumannouncementInDataStore, ({one}) => ({
	forumInDataStore: one(forumInDataStore, {
		fields: [forumannouncementInDataStore.forumid],
		references: [forumInDataStore.forumid]
	}),
	announcementInDataStore: one(announcementInDataStore, {
		fields: [forumannouncementInDataStore.announcementid],
		references: [announcementInDataStore.announcementid]
	}),
}));

export const timeslotTagsInDataStoreRelations = relations(timeslotTagsInDataStore, ({one}) => ({
	timeslotInDataStore: one(timeslotInDataStore, {
		fields: [timeslotTagsInDataStore.timeslotid],
		references: [timeslotInDataStore.timeslotid]
	}),
	slotTagInDataStore: one(slotTagInDataStore, {
		fields: [timeslotTagsInDataStore.slotTagid],
		references: [slotTagInDataStore.slotTagid]
	}),
}));

export const timeslotInDataStoreRelations = relations(timeslotInDataStore, ({many}) => ({
	timeslotTagsInDataStores: many(timeslotTagsInDataStore),
}));

export const slotTagInDataStoreRelations = relations(slotTagInDataStore, ({many}) => ({
	timeslotTagsInDataStores: many(timeslotTagsInDataStore),
}));

export const announcementTagLinkInDataStoreRelations = relations(announcementTagLinkInDataStore, ({one}) => ({
	announcementInDataStore: one(announcementInDataStore, {
		fields: [announcementTagLinkInDataStore.announcementid],
		references: [announcementInDataStore.announcementid]
	}),
	announcementTagInDataStore: one(announcementTagInDataStore, {
		fields: [announcementTagLinkInDataStore.announcementTagId],
		references: [announcementTagInDataStore.announcementTagId]
	}),
}));

export const announcementTagInDataStoreRelations = relations(announcementTagInDataStore, ({many}) => ({
	announcementTagLinkInDataStores: many(announcementTagLinkInDataStore),
}));

export const degreecoursedependenciesInDataStoreRelations = relations(degreecoursedependenciesInDataStore, ({one}) => ({
	degreecourseInDataStore_courseid: one(degreecourseInDataStore, {
		fields: [degreecoursedependenciesInDataStore.courseid],
		references: [degreecourseInDataStore.courseid],
		relationName: "degreecoursedependenciesInDataStore_courseid_degreecourseInDataStore_courseid"
	}),
	degreecourseInDataStore_dependencyid: one(degreecourseInDataStore, {
		fields: [degreecoursedependenciesInDataStore.dependencyid],
		references: [degreecourseInDataStore.courseid],
		relationName: "degreecoursedependenciesInDataStore_dependencyid_degreecourseInDataStore_courseid"
	}),
}));
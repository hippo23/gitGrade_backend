-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE SCHEMA "data-store";
--> statement-breakpoint
CREATE TYPE "data-store"."approvalstatus_enum" AS ENUM('rejected', 'pending', 'approved');--> statement-breakpoint
CREATE TYPE "data-store"."day" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');--> statement-breakpoint
CREATE TYPE "data-store"."degree_type" AS ENUM('BA', 'BS', 'VOCATIONAL');--> statement-breakpoint
CREATE TYPE "data-store"."grade_status" AS ENUM('rejected', 'pending', 'approved');--> statement-breakpoint
CREATE TYPE "data-store"."grade_value" AS ENUM('1.00', '1.25', '1.50', '1.75', '2.00', '2.25', '2.50', '2.75', '3.00', '5.00');--> statement-breakpoint
CREATE TYPE "data-store"."semester" AS ENUM('1st', '2nd');--> statement-breakpoint
CREATE TYPE "data-store"."semestral_period" AS ENUM('1', '2');--> statement-breakpoint
CREATE SEQUENCE "data-store"."organization_organizationid_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "data-store"."organizationcalendarsemester_organizationcalendarsemesterid_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "data-store"."course_courseid_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "data-store"."organizationcalendar_organizationcalendarid_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "data-store"."coursesection_coursesectionid_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "data-store"."person_personid_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "data-store"."role_roleid_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "data-store"."organizationpersonrole_organizationpersonroleid_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "data-store"."studentcoursesection_studentcoursesectionid_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "data-store"."pendingstudentcoursesection_pendingstudentcoursesectionid_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "data-store"."degree_degreeid_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "data-store"."announcement_announcementid_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "data-store"."forum_forumid_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "data-store"."slot_tag_slot_tagid_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "data-store"."timeslot_timeslotid_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "data-store"."announcement_tag_announcement_tag_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE TABLE "data-store"."organization" (
	"organizationid" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"shortname" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"telephone" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "data-store"."course" (
	"courseid" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"units" integer NOT NULL,
	"organizationid" integer,
	"description" varchar(255) NOT NULL,
	CONSTRAINT "unique_name" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "data-store"."organizationcalendar" (
	"organizationcalendarid" serial PRIMARY KEY NOT NULL,
	"organizationid" integer,
	"academic_year" varchar(10) NOT NULL,
	CONSTRAINT "unique_calendar_academic_year" UNIQUE("organizationcalendarid","academic_year"),
	CONSTRAINT "academic_year_format" CHECK (((academic_year)::text ~ '^\d{4}-\d{4}$'::text) AND (("substring"((academic_year)::text, '^\d{4}'::text))::integer < ("substring"((academic_year)::text, '\d{4}$'::text))::integer))
);
--> statement-breakpoint
CREATE TABLE "data-store"."organizationcalendarsemester" (
	"organizationcalendarsemesterid" serial PRIMARY KEY NOT NULL,
	"semester" "data-store"."semestral_period" NOT NULL,
	"organizationcalendarid" integer,
	"startdate" date DEFAULT CURRENT_DATE NOT NULL,
	"enddate" date,
	CONSTRAINT "unique_semester_year" UNIQUE("semester","organizationcalendarid")
);
--> statement-breakpoint
CREATE TABLE "data-store"."coursesection" (
	"coursesectionid" serial PRIMARY KEY NOT NULL,
	"maximumcapacity" integer NOT NULL,
	"completionstatus" boolean DEFAULT false NOT NULL,
	"name" varchar(100) NOT NULL,
	"courseid" integer,
	"organizationcalendarsemesterid" integer,
	CONSTRAINT "unique_section" UNIQUE("name","courseid","organizationcalendarsemesterid")
);
--> statement-breakpoint
CREATE TABLE "data-store"."role" (
	"roleid" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"organizationid" integer
);
--> statement-breakpoint
CREATE TABLE "data-store"."organizationpersonrole" (
	"organizationpersonroleid" serial PRIMARY KEY NOT NULL,
	"entrydate" date NOT NULL,
	"exitdate" date,
	"roleid" integer,
	"personid" integer,
	CONSTRAINT "unique_assignment" UNIQUE("roleid","personid")
);
--> statement-breakpoint
CREATE TABLE "data-store"."person" (
	"personid" serial PRIMARY KEY NOT NULL,
	"firstname" varchar(100) NOT NULL,
	"lastname" varchar(100) NOT NULL,
	"middlename" varchar(100) NOT NULL,
	"location" varchar(100) NOT NULL,
	"birthday" timestamp NOT NULL,
	"authid" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "data-store"."studentcoursesection" (
	"studentcoursesectionid" serial PRIMARY KEY NOT NULL,
	"coursesectionid" integer,
	"organizationpersonroleid" integer,
	"grade" "data-store"."grade_value",
	CONSTRAINT "unique_student_section" UNIQUE("coursesectionid","organizationpersonroleid")
);
--> statement-breakpoint
CREATE TABLE "data-store"."pendingstudentcoursesection" (
	"pendingstudentcoursesectionid" serial PRIMARY KEY NOT NULL,
	"studentcoursesectionid" integer,
	"created_at" date DEFAULT CURRENT_DATE NOT NULL,
	"grade_status" "data-store"."grade_status" DEFAULT 'pending' NOT NULL,
	"remarks" text DEFAULT NULL,
	"grade" "data-store"."grade_value" NOT NULL,
	CONSTRAINT "unique_grade_studentcoursesection" UNIQUE("studentcoursesectionid")
);
--> statement-breakpoint
CREATE TABLE "data-store"."degree" (
	"degreeid" serial PRIMARY KEY NOT NULL,
	"type" "data-store"."degree_type" NOT NULL,
	"length" integer NOT NULL,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "data-store"."announcement" (
	"announcementid" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"body" jsonb NOT NULL,
	"createdat" date NOT NULL,
	"lasteditedat" date,
	"author" integer
);
--> statement-breakpoint
CREATE TABLE "data-store"."forum" (
	"forumid" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"coursesectionid" integer,
	CONSTRAINT "forum_name_coursesectionid_key" UNIQUE("name","coursesectionid")
);
--> statement-breakpoint
CREATE TABLE "data-store"."timeslot" (
	"timeslotid" serial PRIMARY KEY NOT NULL,
	"start_time" time NOT NULL,
	"end_time" time NOT NULL,
	"day" "data-store"."day" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "data-store"."slot_tag" (
	"slot_tagid" serial PRIMARY KEY NOT NULL,
	"name" "citext",
	CONSTRAINT "slot_tag_name_key" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "data-store"."announcement_tag" (
	"announcement_tag_id" serial PRIMARY KEY NOT NULL,
	"name" "citext",
	CONSTRAINT "announcement_tag_name_key" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "data-store"."facultysectionassignment" (
	"organizationpersonroleid" integer NOT NULL,
	"coursesectionid" integer NOT NULL,
	CONSTRAINT "facultysectionassignment_pkey" PRIMARY KEY("organizationpersonroleid","coursesectionid")
);
--> statement-breakpoint
CREATE TABLE "data-store"."degreecourse" (
	"degreeid" integer NOT NULL,
	"courseid" integer NOT NULL,
	CONSTRAINT "degreecourse_pkey" PRIMARY KEY("degreeid","courseid")
);
--> statement-breakpoint
CREATE TABLE "data-store"."forumannouncement" (
	"forumid" integer NOT NULL,
	"announcementid" integer NOT NULL,
	CONSTRAINT "forumannouncement_pkey" PRIMARY KEY("forumid","announcementid")
);
--> statement-breakpoint
CREATE TABLE "data-store"."timeslot_tags" (
	"timeslotid" integer NOT NULL,
	"slot_tagid" integer NOT NULL,
	CONSTRAINT "timeslot_tags_pkey" PRIMARY KEY("timeslotid","slot_tagid")
);
--> statement-breakpoint
CREATE TABLE "data-store"."announcement_tag_link" (
	"announcementid" integer NOT NULL,
	"announcement_tag_id" integer NOT NULL,
	CONSTRAINT "announcement_tag_link_pkey" PRIMARY KEY("announcementid","announcement_tag_id")
);
--> statement-breakpoint
CREATE TABLE "data-store"."degreecoursedependencies" (
	"dependencyid" integer NOT NULL,
	"courseid" integer NOT NULL,
	"degreeid" integer NOT NULL,
	CONSTRAINT "degreecoursedependencies_pkey" PRIMARY KEY("dependencyid","courseid","degreeid")
);
--> statement-breakpoint
ALTER TABLE "data-store"."course" ADD CONSTRAINT "course_organizationid_fkey" FOREIGN KEY ("organizationid") REFERENCES "data-store"."organization"("organizationid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "data-store"."organizationcalendar" ADD CONSTRAINT "organizationcalendar_organizationid_fkey" FOREIGN KEY ("organizationid") REFERENCES "data-store"."organization"("organizationid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "data-store"."organizationcalendarsemester" ADD CONSTRAINT "organizationcalendarsemester_organizationcalendarid_fkey" FOREIGN KEY ("organizationcalendarid") REFERENCES "data-store"."organizationcalendar"("organizationcalendarid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "data-store"."coursesection" ADD CONSTRAINT "coursesection_courseid_fkey" FOREIGN KEY ("courseid") REFERENCES "data-store"."course"("courseid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "data-store"."coursesection" ADD CONSTRAINT "coursesection_organizationcalendarsemesterid_fkey" FOREIGN KEY ("organizationcalendarsemesterid") REFERENCES "data-store"."organizationcalendarsemester"("organizationcalendarsemesterid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "data-store"."role" ADD CONSTRAINT "role_organizationid_fkey" FOREIGN KEY ("organizationid") REFERENCES "data-store"."organization"("organizationid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "data-store"."organizationpersonrole" ADD CONSTRAINT "organizationpersonrole_roleid_fkey" FOREIGN KEY ("roleid") REFERENCES "data-store"."role"("roleid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "data-store"."organizationpersonrole" ADD CONSTRAINT "organizationpersonrole_personid_fkey" FOREIGN KEY ("personid") REFERENCES "data-store"."person"("personid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "data-store"."studentcoursesection" ADD CONSTRAINT "studentcoursesection_coursesectionid_fkey" FOREIGN KEY ("coursesectionid") REFERENCES "data-store"."coursesection"("coursesectionid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "data-store"."studentcoursesection" ADD CONSTRAINT "studentcoursesection_organizationpersonroleid_fkey" FOREIGN KEY ("organizationpersonroleid") REFERENCES "data-store"."organizationpersonrole"("organizationpersonroleid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "data-store"."pendingstudentcoursesection" ADD CONSTRAINT "pendingstudentcoursesection_studentcoursesectionid_fkey" FOREIGN KEY ("studentcoursesectionid") REFERENCES "data-store"."studentcoursesection"("studentcoursesectionid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "data-store"."announcement" ADD CONSTRAINT "announcement_author_fkey" FOREIGN KEY ("author") REFERENCES "data-store"."organizationpersonrole"("organizationpersonroleid") ON DELETE no action ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "data-store"."forum" ADD CONSTRAINT "forum_coursesectionid_fkey" FOREIGN KEY ("coursesectionid") REFERENCES "data-store"."coursesection"("coursesectionid") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "data-store"."facultysectionassignment" ADD CONSTRAINT "facultysectionassignment_organizationpersonroleid_fkey" FOREIGN KEY ("organizationpersonroleid") REFERENCES "data-store"."organizationpersonrole"("organizationpersonroleid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "data-store"."facultysectionassignment" ADD CONSTRAINT "facultysectionassignment_coursesectionid_fkey" FOREIGN KEY ("coursesectionid") REFERENCES "data-store"."coursesection"("coursesectionid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "data-store"."degreecourse" ADD CONSTRAINT "degreecourse_degreeid_fkey" FOREIGN KEY ("degreeid") REFERENCES "data-store"."degree"("degreeid") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "data-store"."degreecourse" ADD CONSTRAINT "degreecourse_courseid_fkey" FOREIGN KEY ("courseid") REFERENCES "data-store"."course"("courseid") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "data-store"."forumannouncement" ADD CONSTRAINT "forumannouncement_forumid_fkey" FOREIGN KEY ("forumid") REFERENCES "data-store"."forum"("forumid") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "data-store"."forumannouncement" ADD CONSTRAINT "forumannouncement_announcementid_fkey" FOREIGN KEY ("announcementid") REFERENCES "data-store"."announcement"("announcementid") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "data-store"."timeslot_tags" ADD CONSTRAINT "timeslot_tags_timeslotid_fkey" FOREIGN KEY ("timeslotid") REFERENCES "data-store"."timeslot"("timeslotid") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "data-store"."timeslot_tags" ADD CONSTRAINT "timeslot_tags_slot_tagid_fkey" FOREIGN KEY ("slot_tagid") REFERENCES "data-store"."slot_tag"("slot_tagid") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "data-store"."announcement_tag_link" ADD CONSTRAINT "announcement_tag_link_announcementid_fkey" FOREIGN KEY ("announcementid") REFERENCES "data-store"."announcement"("announcementid") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "data-store"."announcement_tag_link" ADD CONSTRAINT "announcement_tag_link_announcement_tag_id_fkey" FOREIGN KEY ("announcement_tag_id") REFERENCES "data-store"."announcement_tag"("announcement_tag_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "data-store"."degreecoursedependencies" ADD CONSTRAINT "degreecoursedependencies_courseid_degreeid_fkey" FOREIGN KEY ("courseid","degreeid") REFERENCES "data-store"."degreecourse"("courseid","degreeid") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "data-store"."degreecoursedependencies" ADD CONSTRAINT "degreecoursedependencies_dependencyid_degreeid_fkey" FOREIGN KEY ("dependencyid","degreeid") REFERENCES "data-store"."degreecourse"("courseid","degreeid") ON DELETE cascade ON UPDATE cascade;
*/
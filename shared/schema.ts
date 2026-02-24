import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull(), // 'admin', 'student', 'teacher'
  name: text("name").notNull(),
});

export const subjects = pgTable("subjects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull(),
  teacherId: integer("teacher_id").notNull(),
});

export const attendance = pgTable("attendance", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull(),
  subjectId: integer("subject_id").notNull(),
  percentage: integer("percentage").notNull(),
});

export const marks = pgTable("marks", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull(),
  subjectId: integer("subject_id").notNull(),
  mid1: integer("mid1").notNull(),
  mid2: integer("mid2").notNull(),
});

export const timetables = pgTable("timetables", {
  id: serial("id").primaryKey(),
  dayOfWeek: text("day_of_week").notNull(),
  timeSlot: text("time_slot").notNull(),
  subjectId: integer("subject_id").notNull(),
  teacherId: integer("teacher_id").notNull(),
});

export const syllabuses = pgTable("syllabuses", {
  id: serial("id").primaryKey(),
  semester: text("semester").notNull(),
  title: text("title").notNull(),
  fileUrl: text("file_url").notNull(),
});

export const textbooks = pgTable("textbooks", {
  id: serial("id").primaryKey(),
  subjectId: integer("subject_id").notNull(),
  name: text("name").notNull(),
  author: text("author").notNull(),
  publication: text("publication").notNull(),
  fileUrl: text("file_url").notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertSubjectSchema = createInsertSchema(subjects).omit({ id: true });
export const insertAttendanceSchema = createInsertSchema(attendance).omit({ id: true });
export const insertMarkSchema = createInsertSchema(marks).omit({ id: true });
export const insertTimetableSchema = createInsertSchema(timetables).omit({ id: true });
export const insertSyllabusSchema = createInsertSchema(syllabuses).omit({ id: true });
export const insertTextbookSchema = createInsertSchema(textbooks).omit({ id: true });

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Subject = typeof subjects.$inferSelect;
export type InsertSubject = z.infer<typeof insertSubjectSchema>;

export type Attendance = typeof attendance.$inferSelect;
export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;

export type Mark = typeof marks.$inferSelect;
export type InsertMark = z.infer<typeof insertMarkSchema>;

export type Timetable = typeof timetables.$inferSelect;
export type InsertTimetable = z.infer<typeof insertTimetableSchema>;

export type Syllabus = typeof syllabuses.$inferSelect;
export type InsertSyllabus = z.infer<typeof insertSyllabusSchema>;

export type Textbook = typeof textbooks.$inferSelect;
export type InsertTextbook = z.infer<typeof insertTextbookSchema>;
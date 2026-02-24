import { db } from "./db";
import {
  users, subjects, attendance, marks, timetables, syllabuses, textbooks,
  type User, type InsertUser, type Subject, type InsertSubject,
  type Attendance, type InsertAttendance, type Mark, type InsertMark,
  type Timetable, type InsertTimetable, type Syllabus, type InsertSyllabus,
  type Textbook, type InsertTextbook
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getSubjects(): Promise<Subject[]>;
  createSubject(subject: InsertSubject): Promise<Subject>;
  updateSubject(id: number, updates: Partial<InsertSubject>): Promise<Subject>;
  deleteSubject(id: number): Promise<void>;

  getAttendance(): Promise<Attendance[]>;
  createAttendance(attendance: InsertAttendance): Promise<Attendance>;
  updateAttendance(id: number, updates: Partial<InsertAttendance>): Promise<Attendance>;

  getMarks(): Promise<Mark[]>;
  createMark(mark: InsertMark): Promise<Mark>;
  updateMark(id: number, updates: Partial<InsertMark>): Promise<Mark>;

  getTimetables(): Promise<Timetable[]>;
  getSyllabuses(): Promise<Syllabus[]>;
  createSyllabus(syllabus: InsertSyllabus): Promise<Syllabus>;

  getTextbooks(): Promise<Textbook[]>;
  createTextbook(textbook: InsertTextbook): Promise<Textbook>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getSubjects(): Promise<Subject[]> {
    return await db.select().from(subjects);
  }
  async createSubject(subject: InsertSubject): Promise<Subject> {
    const [newSubject] = await db.insert(subjects).values(subject).returning();
    return newSubject;
  }
  async updateSubject(id: number, updates: Partial<InsertSubject>): Promise<Subject> {
    const [updated] = await db.update(subjects).set(updates).where(eq(subjects.id, id)).returning();
    return updated;
  }
  async deleteSubject(id: number): Promise<void> {
    await db.delete(subjects).where(eq(subjects.id, id));
  }

  async getAttendance(): Promise<Attendance[]> {
    return await db.select().from(attendance);
  }
  async createAttendance(att: InsertAttendance): Promise<Attendance> {
    const [newAtt] = await db.insert(attendance).values(att).returning();
    return newAtt;
  }
  async updateAttendance(id: number, updates: Partial<InsertAttendance>): Promise<Attendance> {
    const [updated] = await db.update(attendance).set(updates).where(eq(attendance.id, id)).returning();
    return updated;
  }

  async getMarks(): Promise<Mark[]> {
    return await db.select().from(marks);
  }
  async createMark(mark: InsertMark): Promise<Mark> {
    const [newMark] = await db.insert(marks).values(mark).returning();
    return newMark;
  }
  async updateMark(id: number, updates: Partial<InsertMark>): Promise<Mark> {
    const [updated] = await db.update(marks).set(updates).where(eq(marks.id, id)).returning();
    return updated;
  }

  async getTimetables(): Promise<Timetable[]> {
    return await db.select().from(timetables);
  }

  async getSyllabuses(): Promise<Syllabus[]> {
    return await db.select().from(syllabuses);
  }
  async createSyllabus(syllabus: InsertSyllabus): Promise<Syllabus> {
    const [newSyllabus] = await db.insert(syllabuses).values(syllabus).returning();
    return newSyllabus;
  }

  async getTextbooks(): Promise<Textbook[]> {
    return await db.select().from(textbooks);
  }
  async createTextbook(textbook: InsertTextbook): Promise<Textbook> {
    const [newTextbook] = await db.insert(textbooks).values(textbook).returning();
    return newTextbook;
  }
}

export const storage = new DatabaseStorage();
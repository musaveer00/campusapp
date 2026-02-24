import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Mock login for now
  app.post(api.auth.login.path, async (req, res) => {
    try {
      const input = api.auth.login.input.parse(req.body);
      const user = await storage.getUserByUsername(input.username);
      if (!user || user.password !== input.password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      res.json(user);
    } catch (err) {
      res.status(401).json({ message: "Invalid input" });
    }
  });

  app.post(api.auth.logout.path, (req, res) => {
    res.json({ message: "Logged out" });
  });

  app.get(api.auth.me.path, (req, res) => {
    res.status(401).json({ message: "Not logged in" });
  });

  app.get(api.users.list.path, async (req, res) => {
    res.json([]);
  });

  app.get(api.subjects.list.path, async (req, res) => {
    res.json(await storage.getSubjects());
  });
  app.post(api.subjects.create.path, async (req, res) => {
    try {
      const input = api.subjects.create.input.parse(req.body);
      res.status(201).json(await storage.createSubject(input));
    } catch(err) {
      if (err instanceof z.ZodError) res.status(400).json({ message: err.errors[0].message });
    }
  });
  app.put(api.subjects.update.path, async (req, res) => {
    try {
      const input = api.subjects.update.input.parse(req.body);
      res.json(await storage.updateSubject(Number(req.params.id), input));
    } catch(err) {
      res.status(404).json({ message: "Not found" });
    }
  });
  app.delete(api.subjects.delete.path, async (req, res) => {
    await storage.deleteSubject(Number(req.params.id));
    res.status(204).end();
  });

  app.get(api.attendance.list.path, async (req, res) => {
    res.json(await storage.getAttendance());
  });
  app.post(api.attendance.create.path, async (req, res) => {
    try {
      const input = api.attendance.create.input.parse(req.body);
      res.status(201).json(await storage.createAttendance(input));
    } catch(err) {
      res.status(400).json({ message: "Invalid input" });
    }
  });
  app.put(api.attendance.update.path, async (req, res) => {
    try {
      const input = api.attendance.update.input.parse(req.body);
      res.json(await storage.updateAttendance(Number(req.params.id), input));
    } catch(err) {
      res.status(404).json({ message: "Not found" });
    }
  });

  app.get(api.marks.list.path, async (req, res) => {
    res.json(await storage.getMarks());
  });
  app.post(api.marks.create.path, async (req, res) => {
    try {
      const input = api.marks.create.input.parse(req.body);
      res.status(201).json(await storage.createMark(input));
    } catch(err) {
      res.status(400).json({ message: "Invalid input" });
    }
  });
  app.put(api.marks.update.path, async (req, res) => {
    try {
      const input = api.marks.update.input.parse(req.body);
      res.json(await storage.updateMark(Number(req.params.id), input));
    } catch(err) {
      res.status(404).json({ message: "Not found" });
    }
  });

  app.get(api.timetables.list.path, async (req, res) => {
    res.json(await storage.getTimetables());
  });

  app.get(api.syllabuses.list.path, async (req, res) => {
    res.json(await storage.getSyllabuses());
  });
  app.post(api.syllabuses.create.path, async (req, res) => {
    try {
      const input = api.syllabuses.create.input.parse(req.body);
      res.status(201).json(await storage.createSyllabus(input));
    } catch(err) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  app.get(api.textbooks.list.path, async (req, res) => {
    res.json(await storage.getTextbooks());
  });
  app.post(api.textbooks.create.path, async (req, res) => {
    try {
      const input = api.textbooks.create.input.parse(req.body);
      res.status(201).json(await storage.createTextbook(input));
    } catch(err) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  // Seed data
  seedDatabase().catch(console.error);

  return httpServer;
}

async function seedDatabase() {
  try {
    const existingUsers = await storage.getUser(1);
    if (!existingUsers) {
      await storage.createUser({ username: "admin", password: "admin123", role: "admin", name: "Admin User" });
      await storage.createUser({ username: "student", password: "student123", role: "student", name: "Demo Student" });
      await storage.createUser({ username: "teacher", password: "teacher123", role: "teacher", name: "Demo Teacher" });
      
      const subject = await storage.createSubject({ name: "Mathematics", code: "MTH101", teacherId: 3 });
      await storage.createSubject({ name: "DBMS", code: "CS201", teacherId: 3 });
      await storage.createSubject({ name: "Operating Systems", code: "CS301", teacherId: 3 });
      
      await storage.createAttendance({ studentId: 2, subjectId: subject.id, percentage: 85 });
      await storage.createAttendance({ studentId: 2, subjectId: 2, percentage: 70 });
      
      await storage.createMark({ studentId: 2, subjectId: subject.id, mid1: 18, mid2: 19 });
    }
  } catch (err) {
    console.log("Database not ready yet or empty schema");
  }
}
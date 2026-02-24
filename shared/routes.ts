import { z } from 'zod';
import { 
  insertUserSchema, insertSubjectSchema, insertAttendanceSchema, 
  insertMarkSchema, insertTimetableSchema, insertSyllabusSchema, insertTextbookSchema,
  users, subjects, attendance, marks, timetables, syllabuses, textbooks
} from './schema';

export const errorSchemas = {
  validation: z.object({ message: z.string(), field: z.string().optional() }),
  notFound: z.object({ message: z.string() }),
  unauthorized: z.object({ message: z.string() }),
};

export const api = {
  auth: {
    login: {
      method: 'POST' as const,
      path: '/api/login' as const,
      input: z.object({ username: z.string(), password: z.string() }),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      }
    },
    logout: {
      method: 'POST' as const,
      path: '/api/logout' as const,
      responses: { 200: z.object({ message: z.string() }) }
    },
    me: {
      method: 'GET' as const,
      path: '/api/user' as const,
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      }
    }
  },
  users: {
    list: {
      method: 'GET' as const,
      path: '/api/users' as const,
      responses: { 200: z.array(z.custom<typeof users.$inferSelect>()) }
    }
  },
  subjects: {
    list: {
      method: 'GET' as const,
      path: '/api/subjects' as const,
      responses: { 200: z.array(z.custom<typeof subjects.$inferSelect>()) }
    },
    create: {
      method: 'POST' as const,
      path: '/api/subjects' as const,
      input: insertSubjectSchema,
      responses: { 201: z.custom<typeof subjects.$inferSelect>(), 400: errorSchemas.validation }
    },
    update: {
      method: 'PUT' as const,
      path: '/api/subjects/:id' as const,
      input: insertSubjectSchema.partial(),
      responses: { 200: z.custom<typeof subjects.$inferSelect>(), 404: errorSchemas.notFound }
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/subjects/:id' as const,
      responses: { 204: z.void(), 404: errorSchemas.notFound }
    }
  },
  attendance: {
    list: {
      method: 'GET' as const,
      path: '/api/attendance' as const,
      responses: { 200: z.array(z.custom<typeof attendance.$inferSelect>()) }
    },
    create: {
      method: 'POST' as const,
      path: '/api/attendance' as const,
      input: insertAttendanceSchema,
      responses: { 201: z.custom<typeof attendance.$inferSelect>(), 400: errorSchemas.validation }
    },
    update: {
      method: 'PUT' as const,
      path: '/api/attendance/:id' as const,
      input: insertAttendanceSchema.partial(),
      responses: { 200: z.custom<typeof attendance.$inferSelect>(), 404: errorSchemas.notFound }
    }
  },
  marks: {
    list: {
      method: 'GET' as const,
      path: '/api/marks' as const,
      responses: { 200: z.array(z.custom<typeof marks.$inferSelect>()) }
    },
    create: {
      method: 'POST' as const,
      path: '/api/marks' as const,
      input: insertMarkSchema,
      responses: { 201: z.custom<typeof marks.$inferSelect>(), 400: errorSchemas.validation }
    },
    update: {
      method: 'PUT' as const,
      path: '/api/marks/:id' as const,
      input: insertMarkSchema.partial(),
      responses: { 200: z.custom<typeof marks.$inferSelect>(), 404: errorSchemas.notFound }
    }
  },
  timetables: {
    list: {
      method: 'GET' as const,
      path: '/api/timetables' as const,
      responses: { 200: z.array(z.custom<typeof timetables.$inferSelect>()) }
    }
  },
  syllabuses: {
    list: {
      method: 'GET' as const,
      path: '/api/syllabuses' as const,
      responses: { 200: z.array(z.custom<typeof syllabuses.$inferSelect>()) }
    },
    create: {
      method: 'POST' as const,
      path: '/api/syllabuses' as const,
      input: insertSyllabusSchema,
      responses: { 201: z.custom<typeof syllabuses.$inferSelect>(), 400: errorSchemas.validation }
    }
  },
  textbooks: {
    list: {
      method: 'GET' as const,
      path: '/api/textbooks' as const,
      responses: { 200: z.array(z.custom<typeof textbooks.$inferSelect>()) }
    },
    create: {
      method: 'POST' as const,
      path: '/api/textbooks' as const,
      input: insertTextbookSchema,
      responses: { 201: z.custom<typeof textbooks.$inferSelect>(), 400: errorSchemas.validation }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
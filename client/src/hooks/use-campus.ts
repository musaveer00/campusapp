import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { 
  InsertSubject, InsertAttendance, InsertMark, 
  InsertTimetable, InsertSyllabus, InsertTextbook 
} from "@shared/schema";

// --- Users ---
export function useUsers() {
  return useQuery({
    queryKey: [api.users.list.path],
    queryFn: async () => {
      const res = await fetch(api.users.list.path);
      if (!res.ok) throw new Error("Failed to fetch users");
      return api.users.list.responses[200].parse(await res.json());
    }
  });
}

// --- Subjects ---
export function useSubjects() {
  return useQuery({
    queryKey: [api.subjects.list.path],
    queryFn: async () => {
      const res = await fetch(api.subjects.list.path);
      if (!res.ok) throw new Error("Failed to fetch subjects");
      return api.subjects.list.responses[200].parse(await res.json());
    }
  });
}

export function useCreateSubject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertSubject) => {
      const res = await fetch(api.subjects.create.path, {
        method: api.subjects.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create subject");
      return api.subjects.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.subjects.list.path] }),
  });
}

// --- Attendance ---
export function useAttendance() {
  return useQuery({
    queryKey: [api.attendance.list.path],
    queryFn: async () => {
      const res = await fetch(api.attendance.list.path);
      if (!res.ok) throw new Error("Failed to fetch attendance");
      return api.attendance.list.responses[200].parse(await res.json());
    }
  });
}

export function useUpdateAttendance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & Partial<InsertAttendance>) => {
      const url = buildUrl(api.attendance.update.path, { id });
      const res = await fetch(url, {
        method: api.attendance.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update attendance");
      return api.attendance.update.responses[200].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.attendance.list.path] }),
  });
}

// --- Marks ---
export function useMarks() {
  return useQuery({
    queryKey: [api.marks.list.path],
    queryFn: async () => {
      const res = await fetch(api.marks.list.path);
      if (!res.ok) throw new Error("Failed to fetch marks");
      return api.marks.list.responses[200].parse(await res.json());
    }
  });
}

export function useUpdateMarks() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & Partial<InsertMark>) => {
      const url = buildUrl(api.marks.update.path, { id });
      const res = await fetch(url, {
        method: api.marks.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update marks");
      return api.marks.update.responses[200].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.marks.list.path] }),
  });
}

export function useCreateMark() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (data: InsertMark) => {
        const res = await fetch(api.marks.create.path, {
          method: api.marks.create.method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to create mark");
        return api.marks.create.responses[201].parse(await res.json());
      },
      onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.marks.list.path] }),
    });
  }

// --- Timetables ---
export function useTimetables() {
  return useQuery({
    queryKey: [api.timetables.list.path],
    queryFn: async () => {
      const res = await fetch(api.timetables.list.path);
      if (!res.ok) throw new Error("Failed to fetch timetables");
      return api.timetables.list.responses[200].parse(await res.json());
    }
  });
}

// --- Syllabuses ---
export function useSyllabuses() {
  return useQuery({
    queryKey: [api.syllabuses.list.path],
    queryFn: async () => {
      const res = await fetch(api.syllabuses.list.path);
      if (!res.ok) throw new Error("Failed to fetch syllabuses");
      return api.syllabuses.list.responses[200].parse(await res.json());
    }
  });
}

export function useCreateSyllabus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertSyllabus) => {
      const res = await fetch(api.syllabuses.create.path, {
        method: api.syllabuses.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create syllabus");
      return api.syllabuses.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.syllabuses.list.path] }),
  });
}

// --- Textbooks ---
export function useTextbooks() {
  return useQuery({
    queryKey: [api.textbooks.list.path],
    queryFn: async () => {
      const res = await fetch(api.textbooks.list.path);
      if (!res.ok) throw new Error("Failed to fetch textbooks");
      return api.textbooks.list.responses[200].parse(await res.json());
    }
  });
}

export function useCreateTextbook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertTextbook) => {
      const res = await fetch(api.textbooks.create.path, {
        method: api.textbooks.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create textbook");
      return api.textbooks.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.textbooks.list.path] }),
  });
}

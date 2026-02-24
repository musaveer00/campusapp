import { useAuth } from "@/hooks/use-auth";
import { useSubjects, useUsers, useAttendance } from "@/hooks/use-campus";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookText, Users, AlertTriangle } from "lucide-react";

export default function TeacherDashboard() {
  const { user } = useAuth();
  const { data: subjects } = useSubjects();
  const { data: users } = useUsers();
  const { data: attendance } = useAttendance();

  const mySubjects = subjects?.filter(s => s.teacherId === user?.id) || [];
  const students = users?.filter(u => u.role === 'student') || [];
  
  // Count students with < 75% in ANY of this teacher's subjects
  let lowAttendanceCount = 0;
  if (attendance && mySubjects.length > 0) {
    const mySubjectIds = mySubjects.map(s => s.id);
    const relevantAttendance = attendance.filter(a => mySubjectIds.includes(a.subjectId));
    
    // Group by student
    const studentAvg: Record<number, { total: number, count: number }> = {};
    relevantAttendance.forEach(a => {
      if (!studentAvg[a.studentId]) studentAvg[a.studentId] = { total: 0, count: 0 };
      studentAvg[a.studentId].total += a.percentage;
      studentAvg[a.studentId].count += 1;
    });

    lowAttendanceCount = Object.values(studentAvg).filter(s => (s.total / s.count) < 75).length;
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary to-primary/80 rounded-3xl p-8 shadow-xl shadow-primary/20 text-primary-foreground relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">Welcome, Prof. {user?.name}!</h2>
          <p className="text-primary-foreground/80 max-w-2xl">
            Manage your subjects, update marks, and monitor student performance from your dashboard.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg shadow-black/5 hover:-translate-y-1 transition-transform duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">My Subjects</CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg text-primary"><BookText className="h-4 w-4" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{mySubjects.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Assigned classes</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg shadow-black/5 hover:-translate-y-1 transition-transform duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500"><Users className="h-4 w-4" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{students.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Enrolled in system</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg shadow-black/5 hover:-translate-y-1 transition-transform duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Action Required</CardTitle>
            <div className="p-2 bg-destructive/10 rounded-lg text-destructive"><AlertTriangle className="h-4 w-4" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">{lowAttendanceCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Students below 75% attendance</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

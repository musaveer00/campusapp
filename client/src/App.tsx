import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

// Components
import { AppLayout } from "@/components/layout/AppLayout";
import AuthPage from "@/pages/Auth";
import StudentDashboard from "@/pages/student/Dashboard";
import StudentTimetable from "@/pages/student/Timetable";
import StudentSyllabus from "@/pages/student/Syllabus";
import TeacherDashboard from "@/pages/teacher/Dashboard";
import TeacherSubjects from "@/pages/teacher/Subjects";
import TeacherStudents from "@/pages/teacher/Students";
import TeacherMarks from "@/pages/teacher/Marks";
import TeacherSyllabus from "@/pages/teacher/Syllabus";
import TeacherTextbooks from "@/pages/teacher/Textbooks";

// Placeholder for Admin Dashboard
const AdminDashboard = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
    <p className="text-muted-foreground">Welcome to the administration panel. Here you can manage the campus system.</p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      <div className="p-6 border rounded-lg bg-card shadow-sm">
        <h3 className="font-semibold mb-2">User Management</h3>
        <p className="text-sm text-muted-foreground">Manage students, teachers, and staff accounts.</p>
      </div>
      <div className="p-6 border rounded-lg bg-card shadow-sm">
        <h3 className="font-semibold mb-2">System Settings</h3>
        <p className="text-sm text-muted-foreground">Configure global campus settings and academic terms.</p>
      </div>
      <div className="p-6 border rounded-lg bg-card shadow-sm">
        <h3 className="font-semibold mb-2">Reports</h3>
        <p className="text-sm text-muted-foreground">View overall performance and attendance analytics.</p>
      </div>
    </div>
  </div>
);

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <Redirect to="/login" />} />
      <Route path="/login" component={AuthPage} />
      
      {/* Admin Routes */}
      <Route path="/admin/dashboard">
        <AppLayout><AdminDashboard /></AppLayout>
      </Route>

      {/* Student Routes */}
      <Route path="/student/dashboard">
        <AppLayout><StudentDashboard /></AppLayout>
      </Route>
      <Route path="/student/timetable">
        <AppLayout><StudentTimetable /></AppLayout>
      </Route>
      <Route path="/student/syllabus">
        <AppLayout><StudentSyllabus /></AppLayout>
      </Route>
      
      {/* Teacher Routes */}
      <Route path="/teacher/dashboard">
        <AppLayout><TeacherDashboard /></AppLayout>
      </Route>
      <Route path="/teacher/subjects">
        <AppLayout><TeacherSubjects /></AppLayout>
      </Route>
      <Route path="/teacher/students">
        <AppLayout><TeacherStudents /></AppLayout>
      </Route>
      <Route path="/teacher/marks">
        <AppLayout><TeacherMarks /></AppLayout>
      </Route>
      <Route path="/teacher/syllabus">
        <AppLayout><TeacherSyllabus /></AppLayout>
      </Route>
      <Route path="/teacher/textbooks">
        <AppLayout><TeacherTextbooks /></AppLayout>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarFooter
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  CalendarDays, 
  BookOpen, 
  GraduationCap, 
  LogOut, 
  Users, 
  BookMarked,
  FileSpreadsheet
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useLogout } from "@/hooks/use-auth";

interface AppSidebarProps {
  role: string;
  name: string;
}

export function AppSidebar({ role, name }: AppSidebarProps) {
  const [location] = useLocation();
  const logout = useLogout();

  const studentItems = [
    { title: "Dashboard", url: "/student/dashboard", icon: LayoutDashboard },
    { title: "Timetable", url: "/student/timetable", icon: CalendarDays },
    { title: "Syllabus", url: "/student/syllabus", icon: BookOpen },
  ];

  const teacherItems = [
    { title: "Dashboard", url: "/teacher/dashboard", icon: LayoutDashboard },
    { title: "Subjects", url: "/teacher/subjects", icon: BookMarked },
    { title: "Students", url: "/teacher/students", icon: Users },
    { title: "Marks & Results", url: "/teacher/marks", icon: FileSpreadsheet },
    { title: "Syllabus", url: "/teacher/syllabus", icon: BookOpen },
  ];

  const items = role === 'student' ? studentItems : role === 'teacher' ? teacherItems : [];

  return (
    <Sidebar variant="sidebar" className="border-r border-border/50 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/20 dark:shadow-none">
      <SidebarContent>
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-primary to-blue-400 p-2 rounded-xl shadow-lg shadow-primary/20">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-xl text-foreground tracking-tight">Nexus</h1>
              <p className="text-xs text-muted-foreground font-medium truncate w-32">Welcome, {name}</p>
            </div>
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-primary/80 uppercase tracking-wider mb-2 px-6">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-3 space-y-1">
              {items.map((item) => {
                const isActive = location === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                      <Link 
                        href={item.url}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                          isActive 
                            ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 font-medium" 
                            : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border/50">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button 
                onClick={() => logout.mutate()}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

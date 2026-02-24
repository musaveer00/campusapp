import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupLabel, 
  SidebarGroupContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { 
  LayoutDashboard, CalendarDays, BookOpen, GraduationCap, 
  BookText, Users, FileText, LogOut, Loader2, Moon, Sun, Library
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

export function AppLayout({ children }: { children: ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    // Should be handled by router redirect, but just in case
    return null;
  }

  const studentLinks = [
    { title: "Dashboard", url: "/student/dashboard", icon: LayoutDashboard },
    { title: "Timetable", url: "/student/timetable", icon: CalendarDays },
    { title: "Syllabus", url: "/student/syllabus", icon: BookOpen },
  ];

  const teacherLinks = [
    { title: "Dashboard", url: "/teacher/dashboard", icon: LayoutDashboard },
    { title: "Subjects", url: "/teacher/subjects", icon: BookText },
    { title: "Students Performance", url: "/teacher/students", icon: Users },
    { title: "Marks & Results", url: "/teacher/marks", icon: GraduationCap },
    { title: "Upload Syllabus", url: "/teacher/syllabus", icon: FileText },
    { title: "Textbooks", url: "/teacher/textbooks", icon: Library },
  ];

  const links = user.role === 'student' ? studentLinks : teacherLinks;

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex min-h-screen w-full bg-background/50">
        <Sidebar variant="inset" className="border-r border-border/50 bg-card/50 backdrop-blur-xl">
          <SidebarContent>
            <div className="p-6 flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-xl text-primary">
                <GraduationCap className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold text-foreground">CampusApp</h2>
            </div>
            
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground font-semibold px-6 mb-2">
                Main Menu
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {links.map((item) => {
                    const isActive = location === item.url;
                    return (
                      <SidebarMenuItem key={item.title} className="px-3 py-1">
                        <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                          <Link href={item.url} className={`
                            flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                            ${isActive 
                              ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' 
                              : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                            }
                          `}>
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <div className="mt-auto p-4 border-t border-border/50">
               <div className="flex items-center gap-3 px-3 py-3 mb-4 rounded-xl bg-secondary/50 border border-border/50">
                 <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                   {user.name.charAt(0)}
                 </div>
                 <div className="overflow-hidden">
                   <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                   <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                 </div>
               </div>
               
               <Button 
                 variant="ghost" 
                 className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors"
                 onClick={() => logout()}
               >
                 <LogOut className="mr-2 h-4 w-4" />
                 Sign Out
               </Button>
            </div>
          </SidebarContent>
        </Sidebar>

        <div className="flex flex-col flex-1 w-full overflow-hidden">
          <header className="h-16 flex items-center justify-between px-6 border-b border-border/50 bg-card/50 backdrop-blur-xl sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
              <h1 className="text-lg font-semibold text-foreground capitalize hidden md:block">
                {location.split('/').pop()?.replace('-', ' ')}
              </h1>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full"
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </header>
          
          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

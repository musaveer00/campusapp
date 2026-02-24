import { useAuth } from "@/hooks/use-auth";
import { useAttendance, useMarks, useSubjects } from "@/hooks/use-campus";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ExternalLink, BookOpen, AlertCircle, TrendingUp, CheckCircle2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { data: attendance } = useAttendance();
  const { data: subjects } = useSubjects();
  const { data: marks } = useMarks();

  // Filter data for current student
  const studentAttendance = attendance?.filter(a => a.studentId === user?.id) || [];
  const studentMarks = marks?.filter(m => m.studentId === user?.id) || [];

  // Calculate aggregates
  const overallAttendance = studentAttendance.length > 0 
    ? Math.round(studentAttendance.reduce((acc, curr) => acc + curr.percentage, 0) / studentAttendance.length)
    : 0;

  const chartData = studentAttendance.map(a => {
    const subject = subjects?.find(s => s.id === a.subjectId);
    return {
      name: subject?.code || 'Unknown',
      percentage: a.percentage,
      isLow: a.percentage < 75
    };
  });

  return (
    <div className="space-y-6">
      {/* Welcome Hero */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-3xl p-8 border border-primary/10 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-foreground mb-2">Welcome back, {user?.name}! 👋</h2>
          <p className="text-muted-foreground max-w-2xl">
            Here's your academic overview for this semester. Keep up the good work!
          </p>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-primary/20 to-transparent blur-3xl rounded-full translate-x-1/2"></div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg shadow-black/5 hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overall Attendance</CardTitle>
            {overallAttendance >= 75 ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-destructive" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${overallAttendance < 75 ? 'text-destructive' : 'text-foreground'}`}>
              {overallAttendance}%
            </div>
            <Progress 
              value={overallAttendance} 
              className="h-2 mt-4" 
              indicatorColor={overallAttendance < 75 ? "bg-destructive" : "bg-primary"}
            />
            {overallAttendance < 75 && (
              <p className="text-xs text-destructive mt-2 font-medium">Below required 75% threshold</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg shadow-black/5 hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Quick Links</CardTitle>
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-3 pt-2">
            <Button variant="outline" className="w-full justify-start hover:bg-primary/5 hover:text-primary transition-colors" asChild>
              <a href="http://results.jntuh.ac.in/" target="_blank" rel="noopener noreferrer">
                <TrendingUp className="mr-2 w-4 h-4" /> Exam Results Portal
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start hover:bg-primary/5 hover:text-primary transition-colors" asChild>
              <a href="https://cselnr223.ccbp.tech/" target="_blank" rel="noopener noreferrer">
                <BookOpen className="mr-2 w-4 h-4" /> Study Materials
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Chart */}
        <Card className="border-0 shadow-lg shadow-black/5">
          <CardHeader>
            <CardTitle>Attendance by Subject</CardTitle>
            <CardDescription>Visual breakdown of your current attendance</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip 
                  cursor={{ fill: 'hsl(var(--muted))' }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                />
                <Bar dataKey="percentage" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.isLow ? 'hsl(var(--destructive))' : 'hsl(var(--primary))'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Detailed List */}
        <Card className="border-0 shadow-lg shadow-black/5 flex flex-col h-[400px]">
          <CardHeader>
            <CardTitle>Subject Details</CardTitle>
            <CardDescription>Your marks and attendance per subject</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto pr-2 space-y-4">
            {subjects?.map(subject => {
              const att = studentAttendance.find(a => a.subjectId === subject.id);
              const mark = studentMarks.find(m => m.subjectId === subject.id);
              if (!att) return null;

              const isLow = att.percentage < 75;

              return (
                <div key={subject.id} className="p-4 rounded-xl border border-border/50 bg-card hover:bg-secondary/20 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-foreground">{subject.name}</h4>
                      <span className="text-xs text-muted-foreground">{subject.code}</span>
                    </div>
                    <div className={`text-sm font-bold px-2 py-1 rounded-md ${isLow ? 'bg-destructive/10 text-destructive' : 'bg-emerald-500/10 text-emerald-600'}`}>
                      {att.percentage}%
                    </div>
                  </div>
                  
                  <Progress 
                    value={att.percentage} 
                    className="h-1.5 mb-3" 
                    indicatorColor={isLow ? "bg-destructive" : "bg-primary"}
                  />

                  <div className="flex gap-4 text-sm mt-3 pt-3 border-t border-border/50">
                    <div className="flex-1">
                      <span className="text-muted-foreground text-xs block">Mid 1</span>
                      <span className="font-semibold">{mark?.mid1 || '-'}</span>
                    </div>
                    <div className="flex-1">
                      <span className="text-muted-foreground text-xs block">Mid 2</span>
                      <span className="font-semibold">{mark?.mid2 || '-'}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

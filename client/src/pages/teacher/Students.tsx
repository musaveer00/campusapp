import { useUsers, useAttendance, useMarks } from "@/hooks/use-campus";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

export default function TeacherStudents() {
  const { data: users, isLoading } = useUsers();
  const { data: attendance } = useAttendance();
  const { data: marks } = useMarks();
  const [search, setSearch] = useState("");

  const students = users?.filter(u => u.role === 'student') || [];

  const processedStudents = students.map(student => {
    const sAtt = attendance?.filter(a => a.studentId === student.id) || [];
    const sMarks = marks?.filter(m => m.studentId === student.id) || [];
    
    const avgAtt = sAtt.length ? Math.round(sAtt.reduce((a, b) => a + b.percentage, 0) / sAtt.length) : 0;
    
    return {
      ...student,
      attendance: avgAtt,
      marksCount: sMarks.length,
      isRisk: avgAtt < 75
    };
  }).filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.username.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Student Performance</h1>
        <p className="text-muted-foreground mt-1">Monitor attendance and identify at-risk students.</p>
      </div>

      <Card className="border-0 shadow-lg shadow-black/5">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4">
          <CardTitle>All Students</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search students..." 
              className="pl-9 bg-secondary/50 border-none"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-secondary/30">
              <TableRow>
                <TableHead className="px-6 py-3">Student Name</TableHead>
                <TableHead>Roll No / Username</TableHead>
                <TableHead>Overall Attendance</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processedStudents.map(student => (
                <TableRow key={student.id} className="hover:bg-secondary/10 transition-colors">
                  <TableCell className="px-6 font-medium">{student.name}</TableCell>
                  <TableCell className="text-muted-foreground font-mono text-sm">{student.username}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <span className={`font-bold ${student.isRisk ? 'text-destructive' : 'text-emerald-600'}`}>
                        {student.attendance}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {student.isRisk ? (
                      <Badge variant="destructive" className="bg-destructive/10 text-destructive border-0 hover:bg-destructive/20">At Risk</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-0">Good Standing</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {processedStudents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No students found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

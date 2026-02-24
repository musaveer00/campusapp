import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useSubjects, useUsers, useMarks, useCreateMark, useUpdateMarks } from "@/hooks/use-campus";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function TeacherMarks() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: subjects } = useSubjects();
  const { data: users } = useUsers();
  const { data: marks } = useMarks();
  
  const createMark = useCreateMark();
  const updateMark = useUpdateMarks();

  const mySubjects = subjects?.filter(s => s.teacherId === user?.id) || [];
  const students = users?.filter(u => u.role === 'student') || [];

  const [selectedSubject, setSelectedSubject] = useState<string>("");
  // Local state to track edits before saving
  const [edits, setEdits] = useState<Record<number, { mid1: string, mid2: string }>>({});

  const handleEdit = (studentId: number, field: 'mid1'|'mid2', val: string) => {
    setEdits(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: val
      }
    }));
  };

  const handleSave = (studentId: number) => {
    if (!selectedSubject) return;
    const subId = parseInt(selectedSubject);
    const editData = edits[studentId];
    if (!editData) return;

    const existingMark = marks?.find(m => m.studentId === studentId && m.subjectId === subId);
    
    const mid1Val = parseInt(editData.mid1) || 0;
    const mid2Val = parseInt(editData.mid2) || 0;

    if (existingMark) {
      updateMark.mutate({ id: existingMark.id, mid1: mid1Val, mid2: mid2Val }, {
        onSuccess: () => {
          toast({ title: "Saved", description: "Marks updated successfully." });
          const newEdits = {...edits}; delete newEdits[studentId]; setEdits(newEdits);
        }
      });
    } else {
      createMark.mutate({ studentId, subjectId: subId, mid1: mid1Val, mid2: mid2Val }, {
        onSuccess: () => {
          toast({ title: "Saved", description: "Marks recorded successfully." });
          const newEdits = {...edits}; delete newEdits[studentId]; setEdits(newEdits);
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Marks & Results Entry</h1>
        <p className="text-muted-foreground mt-1">Record internal mid marks for your subjects.</p>
      </div>

      <Card className="border-0 shadow-lg shadow-black/5">
        <CardHeader className="bg-secondary/30 border-b border-border/50 flex flex-row items-center justify-between">
          <CardTitle>Select Subject</CardTitle>
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-[280px] bg-background">
              <SelectValue placeholder="Select a subject to enter marks" />
            </SelectTrigger>
            <SelectContent>
              {mySubjects.map(sub => (
                <SelectItem key={sub.id} value={sub.id.toString()}>{sub.name} ({sub.code})</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="p-0">
          {!selectedSubject ? (
            <div className="p-12 text-center text-muted-foreground">
              Please select a subject from the dropdown to continue.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-6 py-4">Student</TableHead>
                  <TableHead className="w-32">Mid 1</TableHead>
                  <TableHead className="w-32">Mid 2</TableHead>
                  <TableHead className="w-24 text-right pr-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map(student => {
                  const existingMark = marks?.find(m => m.studentId === student.id && m.subjectId === parseInt(selectedSubject));
                  const editState = edits[student.id];
                  
                  const displayMid1 = editState?.mid1 ?? (existingMark?.mid1.toString() || "");
                  const displayMid2 = editState?.mid2 ?? (existingMark?.mid2.toString() || "");
                  const hasChanges = !!editState;

                  return (
                    <TableRow key={student.id}>
                      <TableCell className="px-6 font-medium">
                        {student.name}
                        <div className="text-xs text-muted-foreground font-mono">{student.username}</div>
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="number" 
                          min="0" 
                          max="100"
                          value={displayMid1} 
                          onChange={(e) => handleEdit(student.id, 'mid1', e.target.value)}
                          className="h-9 w-20"
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="number" 
                          min="0" 
                          max="100"
                          value={displayMid2} 
                          onChange={(e) => handleEdit(student.id, 'mid2', e.target.value)}
                          className="h-9 w-20"
                        />
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Button 
                          size="sm" 
                          disabled={!hasChanges || updateMark.isPending || createMark.isPending}
                          onClick={() => handleSave(student.id)}
                          className="shadow-sm"
                        >
                          <Save className="w-4 h-4 mr-2" /> Save
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

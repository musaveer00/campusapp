import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useSubjects, useCreateSubject } from "@/hooks/use-campus";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, BookText, Code } from "lucide-react";
import { Label } from "@/components/ui/label";

export default function TeacherSubjects() {
  const { user } = useAuth();
  const { data: subjects, isLoading } = useSubjects();
  const createSubject = useCreateSubject();
  
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  const mySubjects = subjects?.filter(s => s.teacherId === user?.id) || [];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    createSubject.mutate({ name, code, teacherId: user.id }, {
      onSuccess: () => {
        setIsOpen(false);
        setName("");
        setCode("");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subject Management</h1>
          <p className="text-muted-foreground mt-1">Manage the subjects assigned to you.</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="shadow-lg shadow-primary/25 hover:-translate-y-0.5 transition-transform">
              <Plus className="w-4 h-4 mr-2" /> Add Subject
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Subject</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Subject Name</Label>
                <Input id="name" value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. Data Structures" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Subject Code</Label>
                <Input id="code" value={code} onChange={e => setCode(e.target.value)} required placeholder="e.g. CS201" />
              </div>
              <Button type="submit" className="w-full" disabled={createSubject.isPending}>
                {createSubject.isPending ? "Adding..." : "Add Subject"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {mySubjects.map(subject => (
          <Card key={subject.id} className="border border-border/50 shadow-lg shadow-black/5 group hover:border-primary/30 transition-colors">
            <CardHeader className="bg-secondary/30 pb-4">
              <div className="p-3 bg-primary/10 w-fit rounded-xl text-primary mb-3 group-hover:scale-110 transition-transform">
                <BookText className="w-6 h-6" />
              </div>
              <CardTitle>{subject.name}</CardTitle>
              <CardDescription className="flex items-center gap-1 font-mono text-xs mt-1">
                <Code className="w-3 h-3" /> {subject.code}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 flex justify-end">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                Manage Details
              </Button>
            </CardContent>
          </Card>
        ))}
        {mySubjects.length === 0 && !isLoading && (
          <div className="col-span-full p-12 text-center border-2 border-dashed border-border rounded-2xl text-muted-foreground">
            <p>You have no subjects assigned yet.</p>
            <Button variant="outline" className="mt-4" onClick={() => setIsOpen(true)}>Add your first subject</Button>
          </div>
        )}
      </div>
    </div>
  );
}

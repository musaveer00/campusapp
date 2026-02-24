import { useState } from "react";
import { useSubjects, useTextbooks, useCreateTextbook } from "@/hooks/use-campus";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Library, Plus, Link as LinkIcon, BookOpen } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function TeacherTextbooks() {
  const { user } = useAuth();
  const { data: subjects } = useSubjects();
  const { data: textbooks } = useTextbooks();
  const createTextbook = useCreateTextbook();

  const mySubjects = subjects?.filter(s => s.teacherId === user?.id) || [];
  
  const [isOpen, setIsOpen] = useState(false);
  const [subjectId, setSubjectId] = useState("");
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [publication, setPublication] = useState("");
  const [fileUrl, setFileUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTextbook.mutate({
      subjectId: parseInt(subjectId),
      name, author, publication, fileUrl
    }, {
      onSuccess: () => {
        setIsOpen(false);
        setSubjectId(""); setName(""); setAuthor(""); setPublication(""); setFileUrl("");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subject Textbooks</h1>
          <p className="text-muted-foreground mt-1">Recommend and share textbooks for your subjects.</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="shadow-lg shadow-primary/25 hover:-translate-y-0.5 transition-transform">
              <Plus className="w-4 h-4 mr-2" /> Add Textbook
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Textbook Reference</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Subject</Label>
                <Select value={subjectId} onValueChange={setSubjectId} required>
                  <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
                  <SelectContent>
                    {mySubjects.map(sub => <SelectItem key={sub.id} value={sub.id.toString()}>{sub.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Book Name</Label>
                <Input value={name} onChange={e=>setName(e.target.value)} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Author(s)</Label>
                  <Input value={author} onChange={e=>setAuthor(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Publication</Label>
                  <Input value={publication} onChange={e=>setPublication(e.target.value)} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Resource Link (PDF/Website)</Label>
                <Input type="url" value={fileUrl} onChange={e=>setFileUrl(e.target.value)} required placeholder="https://" />
              </div>
              <Button type="submit" className="w-full" disabled={createTextbook.isPending}>Save Textbook</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pt-4">
        {textbooks?.map(book => {
          const subject = subjects?.find(s => s.id === book.subjectId);
          if (!subject) return null; // Or filter server side
          
          return (
            <Card key={book.id} className="border-0 shadow-lg shadow-black/5 hover:-translate-y-1 transition-all overflow-hidden flex flex-col">
              <div className="h-2 bg-primary"></div>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <Badge variant="outline" className="mb-2 bg-secondary/50">{subject.name}</Badge>
                  <div className="p-2 bg-primary/10 rounded-full text-primary">
                    <Library className="w-4 h-4" />
                  </div>
                </div>
                <CardTitle className="text-xl line-clamp-2 leading-tight">{book.name}</CardTitle>
                <CardDescription className="pt-2">By <span className="font-semibold text-foreground">{book.author}</span></CardDescription>
              </CardHeader>
              <CardContent className="mt-auto pt-4">
                <div className="text-sm text-muted-foreground mb-4">
                  Publisher: {book.publication}
                </div>
                <Button variant="secondary" className="w-full hover:bg-primary/10 hover:text-primary transition-colors" asChild>
                  <a href={book.fileUrl} target="_blank" rel="noopener noreferrer">
                    <LinkIcon className="w-4 h-4 mr-2" /> Access Resource
                  </a>
                </Button>
              </CardContent>
            </Card>
          );
        })}
        {textbooks?.length === 0 && (
          <div className="col-span-full p-12 text-center text-muted-foreground">
            No textbooks have been added yet.
          </div>
        )}
      </div>
    </div>
  );
}

// Temporary inline Badge component since it's not exported from shadcn by default in the snippet scope
function Badge({ children, className, variant = "default" }: any) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>{children}</span>
}

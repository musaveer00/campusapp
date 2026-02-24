import { useState } from "react";
import { useSyllabuses, useCreateSyllabus } from "@/hooks/use-campus";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, UploadCloud, Book } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function TeacherSyllabus() {
  const { data: syllabuses } = useSyllabuses();
  const createSyllabus = useCreateSyllabus();
  const { toast } = useToast();

  const [semester, setSemester] = useState("");
  const [title, setTitle] = useState("");
  const [fileUrl, setFileUrl] = useState("");

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate upload by just saving the URL
    createSyllabus.mutate({ semester, title, fileUrl: fileUrl || "https://example.com/dummy.pdf" }, {
      onSuccess: () => {
        toast({ title: "Success", description: "Syllabus document uploaded." });
        setSemester(""); setTitle(""); setFileUrl("");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Syllabus Management</h1>
        <p className="text-muted-foreground mt-1">Upload and manage official syllabus documents.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 border-0 shadow-lg shadow-black/5 h-fit sticky top-24">
          <CardHeader className="bg-primary/5 border-b border-border/50">
            <CardTitle className="flex items-center gap-2">
              <UploadCloud className="text-primary w-5 h-5" /> Upload Document
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="semester">Semester</Label>
                <Input id="semester" placeholder="e.g. Semester 4" value={semester} onChange={e=>setSemester(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Document Title</Label>
                <Input id="title" placeholder="e.g. Core Java Syllabus" value={title} onChange={e=>setTitle(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="file">File URL (Mock Upload)</Label>
                <Input id="file" type="url" placeholder="https://..." value={fileUrl} onChange={e=>setFileUrl(e.target.value)} />
                <p className="text-xs text-muted-foreground">In a real app, this would be a file input.</p>
              </div>
              <Button type="submit" className="w-full" disabled={createSyllabus.isPending}>
                Upload Syllabus
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-0 shadow-lg shadow-black/5">
          <CardHeader>
            <CardTitle>Uploaded Documents</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
               {syllabuses?.map(item => (
                 <div key={item.id} className="flex items-center justify-between p-4 border border-border/50 rounded-xl hover:bg-secondary/20 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg text-primary">
                        <Book className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.semester}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href={item.fileUrl} target="_blank" rel="noopener noreferrer">View</a>
                    </Button>
                 </div>
               ))}
               {syllabuses?.length === 0 && (
                 <div className="text-center p-8 text-muted-foreground">No syllabus documents uploaded yet.</div>
               )}
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

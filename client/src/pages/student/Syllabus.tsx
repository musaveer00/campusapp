import { useSyllabuses } from "@/hooks/use-campus";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Book } from "lucide-react";

export default function StudentSyllabus() {
  const { data: syllabuses, isLoading } = useSyllabuses();

  // Group by semester
  const grouped = syllabuses?.reduce((acc, curr) => {
    if (!acc[curr.semester]) acc[curr.semester] = [];
    acc[curr.semester].push(curr);
    return acc;
  }, {} as Record<string, typeof syllabuses>) || {};

  if (isLoading) return <div>Loading syllabus...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Syllabus Directory</h1>
        <p className="text-muted-foreground mt-2">Download official syllabus copies for your semesters.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(grouped).map(([semester, items]) => (
          <Card key={semester} className="border-0 shadow-lg shadow-black/5 group hover:shadow-xl transition-all">
            <CardHeader className="bg-secondary/30 border-b border-border/50 pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Book className="text-primary w-5 h-5" />
                {semester}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="divide-y divide-border/50">
                {items.map((item) => (
                  <li key={item.id} className="p-4 flex items-center justify-between hover:bg-secondary/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="font-medium">{item.title}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="hover:bg-primary hover:text-primary-foreground" asChild>
                      <a href={item.fileUrl} target="_blank" rel="noopener noreferrer">
                        <Download className="w-4 h-4 mr-2" /> Download
                      </a>
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
        {Object.keys(grouped).length === 0 && (
          <div className="col-span-full p-12 text-center border-2 border-dashed border-border rounded-2xl text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No syllabus documents have been uploaded yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

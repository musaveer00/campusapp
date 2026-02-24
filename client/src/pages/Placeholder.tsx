import { FileQuestion } from "lucide-react";

export default function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
      <div className="p-6 bg-secondary/50 rounded-full">
        <FileQuestion className="w-12 h-12 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-bold text-foreground">{title}</h2>
      <p className="text-muted-foreground max-w-md">
        This module is currently under development. Please check back later.
      </p>
    </div>
  );
}

import { useTimetables, useSubjects } from "@/hooks/use-campus";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Clock, Calendar as CalendarIcon } from "lucide-react";

export default function StudentTimetable() {
  const { data: timetables, isLoading: tLoading } = useTimetables();
  const { data: subjects, isLoading: sLoading } = useSubjects();

  if (tLoading || sLoading) return <div>Loading timetable...</div>;

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const timeSlots = ["09:00 - 10:00", "10:00 - 11:00", "11:15 - 12:15", "12:15 - 01:15", "02:00 - 03:00", "03:00 - 04:00"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Weekly Timetable</h1>
        <p className="text-muted-foreground mt-2">Your class schedule for the current semester.</p>
      </div>

      <Card className="border-0 shadow-lg shadow-black/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold text-muted-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Time
                </th>
                {days.map(day => (
                  <th key={day} className="px-6 py-4 font-semibold text-foreground">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {timeSlots.map(slot => (
                <tr key={slot} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-muted-foreground">
                    {slot}
                  </td>
                  {days.map(day => {
                    const entry = timetables?.find(t => t.dayOfWeek === day && t.timeSlot === slot);
                    const subject = entry ? subjects?.find(s => s.id === entry.subjectId) : null;
                    
                    return (
                      <td key={`${day}-${slot}`} className="px-6 py-4">
                        {subject ? (
                          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                            <p className="font-semibold text-primary">{subject.name}</p>
                            <p className="text-xs text-muted-foreground mt-1">{subject.code}</p>
                          </div>
                        ) : (
                          <span className="text-muted-foreground/30">-</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

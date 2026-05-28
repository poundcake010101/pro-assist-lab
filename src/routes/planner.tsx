import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ListChecks, Plus, Sparkles, Clock, Trash2, Wand2 } from "lucide-react";
import { Card, PageHeader, LoadingState } from "@/components/ui-kit";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/planner")({ component: PlannerPage });

type Priority = "High" | "Medium" | "Low";
type Task = { id: string; name: string; hours: number; priority: Priority };

const initial: Task[] = [
  { id: "1", name: "Finalize Q3 launch deck", hours: 2, priority: "High" },
  { id: "2", name: "Review pull requests", hours: 1, priority: "Medium" },
  { id: "3", name: "Reply to investor emails", hours: 0.5, priority: "High" },
  { id: "4", name: "Plan team offsite agenda", hours: 1.5, priority: "Low" },
  { id: "5", name: "1:1 with Priya", hours: 0.5, priority: "Medium" },
];

const priorityStyles: Record<Priority, string> = {
  High: "bg-destructive/15 text-destructive border-destructive/30",
  Medium: "bg-warning/15 text-warning border-warning/30",
  Low: "bg-success/15 text-success border-success/30",
};

function buildSchedule(tasks: Task[]) {
  const sorted = [...tasks].sort((a, b) => {
    const order: Record<Priority, number> = { High: 0, Medium: 1, Low: 2 };
    return order[a.priority] - order[b.priority];
  });
  let cursor = 9; // 9 AM
  return sorted.map((t) => {
    const start = cursor;
    cursor += t.hours;
    if (cursor > 12 && start < 12) cursor += 1; // lunch break
    return { ...t, start, end: start + t.hours };
  });
}

const fmt = (h: number) => {
  const hr = Math.floor(h);
  const m = Math.round((h - hr) * 60);
  const period = hr >= 12 ? "PM" : "AM";
  const h12 = ((hr + 11) % 12) + 1;
  return `${h12}:${m.toString().padStart(2, "0")} ${period}`;
};

function PlannerPage() {
  const [tasks, setTasks] = useState<Task[]>(initial);
  const [name, setName] = useState("");
  const [hours, setHours] = useState(1);
  const [priority, setPriority] = useState<Priority>("Medium");
  const [schedule, setSchedule] = useState<ReturnType<typeof buildSchedule>>([]);
  const [loading, setLoading] = useState(false);

  const addTask = () => {
    if (!name.trim()) return;
    setTasks([...tasks, { id: crypto.randomUUID(), name, hours, priority }]);
    setName(""); setHours(1); setPriority("Medium");
  };

  const removeTask = (id: string) => setTasks(tasks.filter((t) => t.id !== id));

  const optimize = () => {
    setLoading(true);
    setSchedule([]);
    setTimeout(() => {
      setSchedule(buildSchedule(tasks));
      setLoading(false);
    }, 1500);
  };

  const columns: { key: Priority; label: string }[] = [
    { key: "High", label: "High priority" },
    { key: "Medium", label: "Medium priority" },
    { key: "Low", label: "Low priority" },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Focus"
        title="AI Task Planner"
        description="Capture tasks, let the assistant sort and slot them into an optimal day."
        icon={ListChecks}
      />

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          <div className="md:col-span-6">
            <label className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Task name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Draft product launch announcement" className="mt-2 w-full rounded-xl border border-border bg-input/40 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Hours</label>
            <input type="number" min={0.5} step={0.5} value={hours} onChange={(e) => setHours(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-border bg-input/40 p-3 text-sm" />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Priority</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)} className="mt-2 w-full rounded-xl border border-border bg-input/40 p-3 text-sm">
              <option>High</option><option>Medium</option><option>Low</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <button onClick={addTask} className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-glow hover:opacity-90 transition">
              <Plus className="h-4 w-4" /> Add task
            </button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map((col) => {
          const items = tasks.filter((t) => t.priority === col.key);
          return (
            <Card key={col.key} className="min-h-[200px]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm">{col.label}</h3>
                <span className={cn("text-[10px] uppercase tracking-widest px-2 py-1 rounded-full border", priorityStyles[col.key])}>
                  {items.length} {items.length === 1 ? "task" : "tasks"}
                </span>
              </div>
              <div className="space-y-2">
                {items.length === 0 && <div className="text-xs text-muted-foreground italic py-4 text-center">No tasks yet</div>}
                {items.map((t) => (
                  <div key={t.id} className="group flex items-center gap-3 p-3 rounded-xl border border-border bg-background/40 hover:border-primary/40 transition">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{t.name}</div>
                      <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" /> {t.hours}h
                      </div>
                    </div>
                    <button onClick={() => removeTask(t.id)} className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-destructive/15 hover:text-destructive transition">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>

      <Card>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h2 className="text-lg font-semibold">AI-optimized schedule</h2>
          </div>
          <button onClick={optimize} disabled={loading || tasks.length === 0} className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-glow hover:opacity-90 transition disabled:opacity-50">
            <Wand2 className="h-4 w-4" />
            {loading ? "Optimizing…" : "Generate schedule"}
          </button>
        </div>

        {loading ? (
          <LoadingState label="Planning your day…" />
        ) : schedule.length === 0 ? (
          <div className="h-40 rounded-xl border border-dashed border-border flex items-center justify-center text-sm text-muted-foreground">
            Click "Generate schedule" to build your day timeline.
          </div>
        ) : (
          <div className="space-y-2">
            {schedule.map((s, i) => (
              <div key={s.id} className="flex items-stretch gap-4">
                <div className="w-24 shrink-0 text-right pt-1">
                  <div className="text-sm font-medium font-mono">{fmt(s.start)}</div>
                  <div className="text-[11px] text-muted-foreground font-mono">{fmt(s.end)}</div>
                </div>
                <div className="relative">
                  <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-border" />
                  <div className={cn("relative h-3 w-3 rounded-full mt-2 border-2 border-background", s.priority === "High" ? "bg-destructive" : s.priority === "Medium" ? "bg-warning" : "bg-success")} />
                </div>
                <div className="flex-1 rounded-xl border border-border bg-background/40 p-4 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-medium">{s.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Focus block · {s.hours}h</div>
                  </div>
                  <span className={cn("text-[10px] uppercase tracking-widest px-2 py-1 rounded-full border", priorityStyles[s.priority])}>{s.priority}</span>
                </div>
              </div>
            ))}
            <div className="mt-4 p-4 rounded-xl bg-primary/10 border border-primary/20 text-xs text-foreground/90">
              <strong className="text-primary">AI note:</strong> High-priority blocks placed first to leverage morning focus.
              A lunch buffer was added after the noon hour. Consider a 15-minute break between {schedule[0]?.name} and {schedule[1]?.name ?? "the next task"}.
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

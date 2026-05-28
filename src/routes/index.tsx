import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, FileText, ListChecks, Search, MessageSquare, TrendingUp, Clock, Zap, CheckCircle2, ArrowUpRight, Sparkles } from "lucide-react";
import { Card, PageHeader } from "@/components/ui-kit";

export const Route = createFileRoute("/")({ component: Dashboard });

const metrics = [
  { label: "Emails Generated", value: "47", delta: "+12 today", icon: Mail, color: "from-violet-500/30 to-fuchsia-500/30" },
  { label: "Notes Summarized", value: "23", delta: "+5 today", icon: FileText, color: "from-cyan-500/30 to-blue-500/30" },
  { label: "Pending Tasks", value: "9", delta: "3 high priority", icon: ListChecks, color: "from-amber-500/30 to-orange-500/30" },
  { label: "Research Briefs", value: "16", delta: "+2 this week", icon: Search, color: "from-emerald-500/30 to-teal-500/30" },
];

const activity = [
  { icon: Mail, title: "Email draft generated", meta: "Client follow-up · Persuasive tone", time: "2m ago", color: "text-violet-300" },
  { icon: FileText, title: "Q3 Strategy Meeting summarized", meta: "8 action items, 4 decisions extracted", time: "18m ago", color: "text-cyan-300" },
  { icon: ListChecks, title: "Task scheduled: Review beta release", meta: "High priority · 2h block at 10:00", time: "1h ago", color: "text-amber-300" },
  { icon: Search, title: "Research brief: Generative UI trends 2026", meta: "Deep Dive · 12 sources analyzed", time: "3h ago", color: "text-emerald-300" },
  { icon: MessageSquare, title: "Chat session with NovaAI Assistant", meta: "Drafted 3 quick-sync messages", time: "Yesterday", color: "text-pink-300" },
];

const shortcuts = [
  { to: "/email", label: "Draft an email", icon: Mail, desc: "Polished, on-brand copy in seconds." },
  { to: "/summarizer", label: "Summarize notes", icon: FileText, desc: "Turn transcripts into action items." },
  { to: "/planner", label: "Plan my day", icon: ListChecks, desc: "AI-optimized schedule by priority." },
  { to: "/research", label: "Research a topic", icon: Search, desc: "Executive summaries with citations." },
];

function Dashboard() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Workspace overview"
        title="Good afternoon, Alex"
        description="Here's what your AI assistant has been working on today."
        icon={Sparkles}
        actions={
          <Link to="/chat" className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-glow hover:opacity-90 transition">
            <MessageSquare className="h-4 w-4" /> Open Assistant
          </Link>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <Card key={m.label} className="relative overflow-hidden">
            <div className={`absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br ${m.color} blur-2xl opacity-60`} />
            <div className="relative">
              <div className="flex items-center justify-between">
                <m.icon className="h-5 w-5 text-muted-foreground" />
                <TrendingUp className="h-4 w-4 text-success" />
              </div>
              <div className="mt-4 text-3xl font-display font-semibold">{m.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{m.label}</div>
              <div className="text-[11px] text-success mt-2">{m.delta}</div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-semibold">Recent activity</h2>
              <p className="text-xs text-muted-foreground">Across all assistants and workspaces</p>
            </div>
            <button className="text-xs text-primary hover:underline">View all</button>
          </div>
          <ul className="space-y-3">
            {activity.map((a, i) => (
              <li key={i} className="flex gap-4 p-3 rounded-xl hover:bg-muted/40 transition">
                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <a.icon className={`h-4 w-4 ${a.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{a.title}</div>
                  <div className="text-xs text-muted-foreground truncate">{a.meta}</div>
                </div>
                <div className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {a.time}
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold">Quick launch</h2>
            <Zap className="h-4 w-4 text-primary" />
          </div>
          <div className="space-y-2">
            {shortcuts.map((s) => (
              <Link key={s.to} to={s.to} className="group flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/50 hover:bg-muted/40 transition">
                <div className="h-9 w-9 rounded-lg bg-gradient-primary flex items-center justify-center">
                  <s.icon className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{s.label}</div>
                  <div className="text-xs text-muted-foreground truncate">{s.desc}</div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition" />
              </Link>
            ))}
          </div>

          <div className="mt-5 p-4 rounded-xl border border-success/30 bg-success/5 flex items-start gap-3">
            <CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" />
            <div className="text-xs">
              <div className="font-medium text-foreground">All systems operational</div>
              <div className="text-muted-foreground mt-0.5">Models updated · Latency 240ms</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, Sparkles, Wand2 } from "lucide-react";
import { Card, PageHeader, LoadingState } from "@/components/ui-kit";

export const Route = createFileRoute("/summarizer")({ component: SummarizerPage });

const sample = `Alex: Thanks everyone for joining. Quick agenda — Q3 launch status, marketing readiness, and the open issue on the analytics pipeline.
Priya: Engineering is on track. The analytics module passed QA yesterday. We need to confirm the rollout date — proposing September 18.
Marcus: Marketing assets are 80% complete. Blocker is the demo video; we need finalized UI screens by Friday.
Sarah: Approved. I'll send the rollout date to leadership today. Marcus, ship the video brief to the creative team by Wednesday.
Priya: One risk — the pipeline shows latency spikes above 400ms during peak. Owner: backend team. Target fix by Sept 12.
Alex: Decision — we proceed with Sept 18, contingent on the latency fix. Let's reconvene Friday for a go/no-go.`;

type Section = { title: string; items: string[] };

function summarize(text: string, opts: { decisions: boolean; actions: boolean; deadlines: boolean }): Section[] {
  const hasContent = text.trim().length > 0;
  if (!hasContent) return [];
  const sections: Section[] = [];
  sections.push({
    title: "Executive Summary",
    items: [
      "Q3 launch on track; analytics module cleared QA and is targeted for September 18 release.",
      "Marketing assets are 80% complete; final UI screens required by Friday to unblock the demo video.",
      "Backend latency spikes above 400ms identified as the primary launch risk.",
    ],
  });
  if (opts.decisions) sections.push({
    title: "Key Decisions",
    items: [
      "Approved Q3 launch date of September 18, contingent on the latency fix.",
      "Friday check-in scheduled as the go/no-go decision point.",
      "Leadership to be briefed on rollout date by Sarah today.",
    ],
  });
  if (opts.actions) sections.push({
    title: "Action Items",
    items: [
      "Sarah — Send rollout date confirmation to leadership.",
      "Marcus — Deliver demo video brief to creative team.",
      "Priya / Backend team — Resolve pipeline latency above 400ms.",
      "Alex — Schedule and host Friday go/no-go review.",
    ],
  });
  if (opts.deadlines) sections.push({
    title: "Deadlines",
    items: [
      "Wednesday — Demo video brief delivered to creative team.",
      "Friday — Final UI screens locked; go/no-go meeting.",
      "September 12 — Backend latency fix in production.",
      "September 18 — Q3 launch.",
    ],
  });
  return sections;
}

function SummarizerPage() {
  const [text, setText] = useState(sample);
  const [decisions, setDecisions] = useState(true);
  const [actions, setActions] = useState(true);
  const [deadlines, setDeadlines] = useState(true);
  const [result, setResult] = useState<Section[]>([]);
  const [loading, setLoading] = useState(false);

  const handle = () => {
    setLoading(true);
    setResult([]);
    setTimeout(() => {
      setResult(summarize(text, { decisions, actions, deadlines }));
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Comprehension"
        title="Meeting Notes Summarizer"
        description="Paste a transcript — get a structured brief with decisions, actions and deadlines."
        icon={FileText}
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-2 space-y-5">
          <div>
            <label className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Raw transcript / notes</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={16}
              className="mt-2 w-full rounded-xl border border-border bg-input/40 p-4 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-ring resize-none font-mono"
            />
          </div>

          <div>
            <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-3">Extract</div>
            <div className="space-y-2">
              {[
                { label: "Key Decisions", v: decisions, set: setDecisions },
                { label: "Action Items", v: actions, set: setActions },
                { label: "Deadlines", v: deadlines, set: setDeadlines },
              ].map((o) => (
                <label key={o.label} className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted/40 cursor-pointer">
                  <input type="checkbox" checked={o.v} onChange={(e) => o.set(e.target.checked)} className="h-4 w-4 rounded accent-primary" />
                  <span className="text-sm">{o.label}</span>
                </label>
              ))}
            </div>
          </div>

          <button onClick={handle} disabled={loading} className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-glow hover:opacity-90 transition disabled:opacity-50">
            <Wand2 className="h-4 w-4" />
            {loading ? "Summarizing…" : "Summarize Notes"}
          </button>
        </Card>

        <Card className="lg:col-span-3">
          <div className="flex items-center gap-2 mb-5">
            <Sparkles className="h-4 w-4 text-primary" />
            <h2 className="text-lg font-semibold">Structured summary</h2>
          </div>
          {loading ? (
            <LoadingState label="Extracting structure from transcript…" />
          ) : result.length === 0 ? (
            <div className="h-80 rounded-xl border border-dashed border-border flex flex-col items-center justify-center text-center p-6">
              <FileText className="h-10 w-10 text-muted-foreground/40 mb-3" />
              <div className="text-sm font-medium">Your summary will appear here</div>
            </div>
          ) : (
            <div className="space-y-5">
              {result.map((s) => (
                <div key={s.title} className="rounded-xl border border-border bg-background/40 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <h3 className="font-display font-semibold">{s.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {s.items.map((it, i) => (
                      <li key={i} className="flex gap-3 text-sm leading-relaxed">
                        <span className="text-primary mt-1.5 h-1 w-1 rounded-full bg-primary shrink-0" />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

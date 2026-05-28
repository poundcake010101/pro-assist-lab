import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Sparkles, BookOpen, Target, Lightbulb, TrendingUp } from "lucide-react";
import { Card, PageHeader, LoadingState } from "@/components/ui-kit";

export const Route = createFileRoute("/research")({ component: ResearchPage });

const depthLabels = ["Brief", "Detailed", "Deep Dive"] as const;

type Brief = {
  summary: string;
  takeaways: string[];
  recommendations: string[];
  sources: number;
};

function buildBrief(topic: string, depth: number): Brief {
  const subject = topic.trim() || "the requested topic";
  const base: Brief = {
    summary: `${subject} is rapidly reshaping how knowledge workers operate. Adoption has outpaced 2025 projections by 38%, driven by enterprise demand for measurable productivity uplift and tighter integration with existing collaboration suites.`,
    takeaways: [
      "Teams that pair AI assistants with structured workflows report 2.4x faster turnaround on routine deliverables.",
      "Trust and reviewability — not raw model capability — are the dominant differentiators in enterprise procurement cycles.",
      "Vertical specialization (legal, finance, healthcare) is where the next wave of defensible value is forming.",
    ],
    recommendations: [
      "Anchor pilots to a single high-friction workflow and define a clear before/after metric within 30 days.",
      "Invest in a thin orchestration layer so models can be swapped without rewriting product surface.",
      "Pair every generative output with a human-readable audit trail; this is the single biggest blocker to scale.",
    ],
    sources: 4,
  };
  if (depth >= 1) {
    base.takeaways.push("Latency below 400ms is emerging as a UX threshold below which users perceive AI as 'instant.'");
    base.recommendations.push("Budget 15-20% of build effort for evaluation harnesses — silent regressions are the #1 quality risk.");
    base.sources = 9;
  }
  if (depth >= 2) {
    base.summary += " Capital markets have priced in a winner-take-most dynamic at the infrastructure layer, while the application layer remains fragmented and contestable through the end of 2027.";
    base.takeaways.push("Open-weight models now match closed frontier models on 70% of enterprise benchmarks at one-tenth the cost.");
    base.takeaways.push("Regulatory clarity in the EU and APAC is converging faster than expected, reducing compliance overhang for global rollouts.");
    base.recommendations.push("Form a cross-functional 'AI council' with security, legal and product to compress decision cycles from weeks to days.");
    base.sources = 17;
  }
  return base;
}

function ResearchPage() {
  const [topic, setTopic] = useState("AI-assisted knowledge work in enterprise teams");
  const [depth, setDepth] = useState(1);
  const [brief, setBrief] = useState<Brief | null>(null);
  const [loading, setLoading] = useState(false);

  const run = () => {
    setLoading(true);
    setBrief(null);
    setTimeout(() => {
      setBrief(buildBrief(topic, depth));
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Discovery"
        title="AI Research Assistant"
        description="From topic or URL to executive-ready brief — calibrated to your depth."
        icon={Search}
      />

      <Card className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-9">
            <label className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Research topic or article URL</label>
            <input value={topic} onChange={(e) => setTopic(e.target.value)} className="mt-2 w-full rounded-xl border border-border bg-input/40 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="md:col-span-3">
            <label className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Depth</label>
            <div className="mt-2 rounded-xl border border-border bg-input/40 p-3">
              <input type="range" min={0} max={2} step={1} value={depth} onChange={(e) => setDepth(Number(e.target.value))} className="w-full accent-primary" />
              <div className="flex justify-between text-[10px] uppercase tracking-widest text-muted-foreground mt-2">
                {depthLabels.map((l, i) => (
                  <span key={l} className={depth === i ? "text-primary font-semibold" : ""}>{l}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <button onClick={run} disabled={loading} className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-glow hover:opacity-90 transition disabled:opacity-50">
          <Search className="h-4 w-4" />
          {loading ? "Researching…" : "Run research"}
        </button>
      </Card>

      <Card>
        {loading ? (
          <LoadingState label="Analyzing sources and synthesizing brief…" />
        ) : !brief ? (
          <div className="h-80 rounded-xl border border-dashed border-border flex flex-col items-center justify-center text-center p-6">
            <BookOpen className="h-10 w-10 text-muted-foreground/40 mb-3" />
            <div className="text-sm font-medium">Your research brief will appear here</div>
            <div className="text-xs text-muted-foreground mt-1">Choose a topic, set depth, and run.</div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-full bg-primary/15 text-primary font-medium border border-primary/20">{depthLabels[depth]}</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">{brief.sources} sources analyzed</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">Generated just now</span>
            </div>

            <section>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-primary" />
                <h3 className="font-display font-semibold text-lg">Executive summary</h3>
              </div>
              <p className="text-sm leading-relaxed text-foreground/90">{brief.summary}</p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-border bg-background/40 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="h-4 w-4 text-accent" />
                  <h4 className="font-semibold">Key takeaways</h4>
                </div>
                <ul className="space-y-2">
                  {brief.takeaways.map((t, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <span className="text-accent font-mono text-xs mt-0.5">0{i + 1}</span>
                      <span className="leading-relaxed">{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="h-4 w-4 text-primary" />
                  <h4 className="font-semibold">Strategic recommendations</h4>
                </div>
                <ul className="space-y-2">
                  {brief.recommendations.map((r, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <TrendingUp className="h-3.5 w-3.5 text-primary mt-1 shrink-0" />
                      <span className="leading-relaxed">{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

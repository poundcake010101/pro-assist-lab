import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Copy, Check, Code2, Sparkles, Send } from "lucide-react";
import { Card, PageHeader, LoadingState } from "@/components/ui-kit";

export const Route = createFileRoute("/email")({ component: EmailPage });

const tones = ["Formal", "Friendly", "Persuasive", "Urgent"] as const;
const audiences = ["Manager", "Client", "Team", "External"] as const;

function generateEmail(topic: string, tone: string, audience: string) {
  const subjects: Record<string, string> = {
    Formal: `Update regarding ${topic || "our recent discussion"}`,
    Friendly: `Quick note on ${topic || "what we talked about"}`,
    Persuasive: `An opportunity worth your attention: ${topic || "next steps"}`,
    Urgent: `[Time-sensitive] Action needed on ${topic || "project update"}`,
  };
  const openings: Record<string, string> = {
    Manager: "Hi Sarah,\n\nI wanted to bring you up to speed on a few items before our next 1:1.",
    Client: "Dear Mr. Thompson,\n\nThank you again for the productive conversation last week.",
    Team: "Hey team,\n\nSharing a quick update so we're all aligned heading into the sprint.",
    External: "Hello,\n\nI hope this message finds you well.",
  };
  const bodies: Record<string, string> = {
    Formal: `Following our recent alignment, I'd like to formally outline the next steps related to ${topic || "the initiative"}. We have completed the initial review and are prepared to proceed with the agreed scope. I would appreciate your confirmation on the timeline so we can mobilize resources accordingly.`,
    Friendly: `Just a quick one on ${topic || "what we discussed"} — things are tracking well on our end, and I think you'll be pleased with where we've landed. Let me know if anything jumps out, otherwise I'll keep momentum going!`,
    Persuasive: `Acting on ${topic || "this"} now positions us ahead of the curve. Early data shows a meaningful uplift in adoption, and a small commitment this week unlocks compounding gains across Q3. I'd love 15 minutes to walk you through the projections.`,
    Urgent: `We need to make a decision on ${topic || "the issue raised"} by end of day tomorrow to avoid downstream impact. I've outlined the two viable paths below — could you confirm which you'd like us to pursue?`,
  };
  const closings: Record<string, string> = {
    Formal: "Kind regards,\nAlex Morgan\nDirector of Operations",
    Friendly: "Cheers,\nAlex",
    Persuasive: "Looking forward to your thoughts,\nAlex Morgan",
    Urgent: "Thanks for the fast turnaround,\nAlex",
  };
  return `Subject: ${subjects[tone]}\n\n${openings[audience]}\n\n${bodies[tone]}\n\nKey points:\n• Status: on track, no blockers identified\n• Owner: ${audience === "Team" ? "shared across pod" : "Alex Morgan"}\n• Next checkpoint: Thursday, 10:00 AM\n\n${closings[tone]}`;
}

function EmailPage() {
  const [topic, setTopic] = useState("Follow up on the Q3 roadmap presentation and confirm the launch date for the new analytics module.");
  const [tone, setTone] = useState<(typeof tones)[number]>("Persuasive");
  const [audience, setAudience] = useState<(typeof audiences)[number]>("Client");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [copied, setCopied] = useState(false);

  const systemPrompt = `System: You are an expert corporate communications executive with 15+ years of experience writing high-impact emails.

Task: Compose a polished email draft.
Tone: ${tone}
Target audience: ${audience}
Constraints:
  - Keep under 180 words
  - Include a clear subject line
  - Lead with the value, end with a specific next step
  - Match register to the audience (${audience.toLowerCase()})

User input (bullet points / topic):
"""
${topic}
"""

Output format: plain-text email with Subject line, greeting, body, signature.`;

  const handleGenerate = () => {
    setLoading(true);
    setOutput("");
    setTimeout(() => {
      setOutput(generateEmail(topic, tone, audience));
      setLoading(false);
    }, 1500);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Composition"
        title="Smart Email Generator"
        description="Turn rough bullets into a polished, on-tone email — calibrated for your audience."
        icon={Mail}
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-2 space-y-5">
          <div>
            <label className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Key bullet points / topic</label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              rows={7}
              className="mt-2 w-full rounded-xl border border-border bg-input/40 p-4 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              placeholder="e.g. confirm launch date, thank them for the feedback…"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Tone</label>
              <select value={tone} onChange={(e) => setTone(e.target.value as never)} className="mt-2 w-full rounded-xl border border-border bg-input/40 p-3 text-sm">
                {tones.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Audience</label>
              <select value={audience} onChange={(e) => setAudience(e.target.value as never)} className="mt-2 w-full rounded-xl border border-border bg-input/40 p-3 text-sm">
                {audiences.map((a) => <option key={a}>{a}</option>)}
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-glow hover:opacity-90 transition disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            {loading ? "Generating…" : "Generate Email"}
          </button>

          <button onClick={() => setShowPrompt(!showPrompt)} className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 transition">
            <Code2 className="h-3.5 w-3.5" />
            {showPrompt ? "Hide" : "View"} Underlying AI Prompt
          </button>

          {showPrompt && (
            <pre className="text-[11px] font-mono leading-relaxed bg-background/60 border border-border rounded-xl p-4 overflow-x-auto whitespace-pre-wrap text-muted-foreground">
              {systemPrompt}
            </pre>
          )}
        </Card>

        <Card className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h2 className="text-lg font-semibold">Generated draft</h2>
            </div>
            {output && (
              <button onClick={handleCopy} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-muted/40 transition">
                {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
            )}
          </div>

          {loading ? (
            <LoadingState label="Drafting your email…" />
          ) : output ? (
            <textarea
              value={output}
              onChange={(e) => setOutput(e.target.value)}
              rows={20}
              className="w-full rounded-xl border border-border bg-background/40 p-5 text-sm leading-relaxed font-mono focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          ) : (
            <div className="h-80 rounded-xl border border-dashed border-border flex flex-col items-center justify-center text-center p-6">
              <Mail className="h-10 w-10 text-muted-foreground/40 mb-3" />
              <div className="text-sm font-medium">Your draft will appear here</div>
              <div className="text-xs text-muted-foreground mt-1">Fill in the form and click Generate.</div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

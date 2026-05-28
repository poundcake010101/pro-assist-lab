import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Sparkles, User, Bot } from "lucide-react";
import { Card, PageHeader } from "@/components/ui-kit";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chat")({ component: ChatPage });

type Msg = { role: "user" | "ai"; text: string; ts: number };

const quickReplies = [
  "Draft a quick sync message",
  "Summarize my unread emails",
  "What should I focus on today?",
  "Help me prepare for tomorrow's standup",
];

const aiResponses: Record<string, string> = {
  "Draft a quick sync message": "Here's a quick sync you can send:\n\n\"Hey team — quick update: launch is on track for Sept 18 pending the latency fix from backend. Final UI screens due Friday. Anything blocking on your end? 🙌\"\n\nWant me to adjust the tone or add more detail?",
  "Summarize my unread emails": "You have **12 unread emails**. Top items:\n\n• **Sarah (Leadership)** — Asking for Q3 launch confirmation. Needs reply today.\n• **Marcus (Marketing)** — Demo video script attached, requesting feedback by Wednesday.\n• **Vendor: Linear** — Plan renewal coming up in 14 days.\n\nThe remaining 9 are newsletters and FYI notifications — safe to batch.",
  "What should I focus on today?": "Based on your calendar and open tasks, today's high-leverage focus is:\n\n1. **Finalize Q3 launch deck** (2h, deep-focus block 10–12)\n2. **Reply to investor emails** (30m, high priority)\n3. **1:1 with Priya** (30m, on the calendar at 2pm)\n\nI'd recommend protecting the 10–12 block — that's where you do your best deck work.",
  "Help me prepare for tomorrow's standup": "Here's a 60-second standup script for tomorrow:\n\n**Yesterday:** Closed the analytics QA review and shipped the spec for the rollout fix.\n**Today:** Finalizing the Q3 launch deck and pushing the marketing video brief.\n**Blockers:** None — but watching the backend latency fix; ETA Sept 12.\n\nWant me to drop it into your Slack drafts?",
};

const defaultResponse = (q: string) =>
  `Got it — let me think about "${q}".\n\nHere's a starting point I'd suggest:\n\n• Clarify the desired outcome (1 line)\n• Identify the smallest next step\n• Set a checkpoint within 24 hours\n\nIf you share a bit more context, I can draft something concrete. Want me to convert this into a task or an email?`;

function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "ai", text: "Hi Alex 👋 I'm NovaAI, your workplace assistant. Ask me to draft, summarize, plan or research — anything that gets in the way of your day.", ts: Date.now() - 60000 },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "user", text, ts: Date.now() }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const reply = aiResponses[text] ?? defaultResponse(text);
      setMessages((m) => [...m, { role: "ai", text: reply, ts: Date.now() }]);
      setTyping(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Conversation"
        title="AI Chatbot"
        description="Your always-on workplace co-pilot — chat, brainstorm, get things done."
        icon={MessageSquare}
      />

      <Card className="p-0 overflow-hidden flex flex-col h-[calc(100vh-340px)] min-h-[500px]">
        <div className="px-5 py-3 border-b border-border bg-card/60 flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold">NovaAI Assistant</div>
            <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-dot" /> Online · GPT-class model
            </div>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin p-5 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={cn("flex gap-3 max-w-[85%]", m.role === "user" ? "ml-auto flex-row-reverse" : "")}>
              <div className={cn("h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                m.role === "user" ? "bg-secondary" : "bg-gradient-primary shadow-glow")}>
                {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4 text-primary-foreground" />}
              </div>
              <div className={cn(
                "rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap",
                m.role === "user"
                  ? "bg-gradient-primary text-primary-foreground rounded-tr-sm"
                  : "bg-muted/60 border border-border rounded-tl-sm"
              )}>
                {m.text}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex gap-3 max-w-[85%]">
              <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center shrink-0 shadow-glow">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="rounded-2xl rounded-tl-sm px-4 py-3 bg-muted/60 border border-border">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-primary animate-pulse-dot" />
                  <span className="h-2 w-2 rounded-full bg-primary animate-pulse-dot" style={{ animationDelay: "0.15s" }} />
                  <span className="h-2 w-2 rounded-full bg-primary animate-pulse-dot" style={{ animationDelay: "0.3s" }} />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-border p-4 space-y-3 bg-card/40">
          <div className="flex flex-wrap gap-2">
            {quickReplies.map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                disabled={typing}
                className="text-xs px-3 py-1.5 rounded-full border border-border hover:border-primary/50 hover:bg-primary/10 hover:text-primary transition disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message NovaAI…"
              className="flex-1 rounded-xl border border-border bg-input/40 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              type="submit"
              disabled={typing || !input.trim()}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-glow hover:opacity-90 transition disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </Card>
    </div>
  );
}

import { useState } from "react";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import { askAssistant } from "../api/api";

const starterQuestions = [
  "How do I apply for a job?",
  "How do AI matches work?",
];

export default function ProjectAssistant() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    {
      from: "assistant",
      text: "Hi! I only help with the JobPortal project. Ask about jobs, applications, profiles, or recruiter tools.",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const submitQuestion = async (event) => {
    event?.preventDefault();
    const value = question.trim();
    if (!value || loading) return;
    setQuestion("");
    setMessages((current) => [...current, { from: "user", text: value }]);
    setLoading(true);
    try {
      const { data } = await askAssistant(value);
      setMessages((current) => [
        ...current,
        { from: "assistant", text: data.answer },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          from: "assistant",
          text: "I could not reach the project assistant. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {open && (
        <section className="fixed bottom-24 right-4 z-50 flex w-[min(360px,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.2)] sm:right-6">
          <header className="flex items-center justify-between bg-slate-950 px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400 text-slate-950">
                <SmartToyIcon sx={{ fontSize: 21 }} />
              </span>
              <div>
                <h2 className="font-bold">Project assistant</h2>
                <p className="text-xs text-slate-300">
                  JobPortal project help only
                </p>
              </div>
            </div>
            <button
              type="button"
              aria-label="Close assistant"
              onClick={() => setOpen(false)}
              className="text-slate-300 hover:text-white"
            >
              <CloseIcon />
            </button>
          </header>
          <div className="flex max-h-80 flex-col gap-3 overflow-y-auto p-4">
            {messages.map((message, index) => (
              <p
                key={`${message.from}-${index}`}
                className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-5 ${message.from === "user" ? "self-end bg-blue-600 text-white" : "self-start bg-slate-100 text-slate-700"}`}
              >
                {message.text}
              </p>
            ))}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2">
                {starterQuestions.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setQuestion(item)}
                    className="rounded-full border border-slate-200 px-3 py-1.5 text-left text-xs font-semibold text-slate-600 hover:border-blue-300 hover:text-blue-600"
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
            {loading && (
              <p className="self-start text-xs font-semibold text-slate-400">
                Thinking...
              </p>
            )}
          </div>
          <form
            onSubmit={submitQuestion}
            className="flex gap-2 border-t border-slate-100 p-3"
          >
            <input
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Ask about JobPortal..."
              aria-label="Ask the project assistant"
              className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              aria-label="Send question"
              disabled={!question.trim() || loading}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <SendIcon sx={{ fontSize: 18 }} />
            </button>
          </form>
        </section>
      )}
      <button
        type="button"
        aria-label={open ? "Close project assistant" : "Open project assistant"}
        onClick={() => setOpen((current) => !current)}
        className="fixed bottom-5 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-cyan-400 text-slate-950 shadow-[0_12px_30px_rgba(8,145,178,0.35)] transition hover:scale-105 sm:right-6"
      >
        {open ? <CloseIcon /> : <SmartToyIcon />}
      </button>
    </>
  );
}

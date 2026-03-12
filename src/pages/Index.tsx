import { useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Footer } from "@/components/Footer";
import { MessageCircle, X, Send } from "lucide-react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const Index = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi, I'm the PXL AI travel assistant. Ask me anything about flights, local routes, or how PXL works.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    const userMessage: ChatMessage = { role: "user", content: trimmed };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setIsSending(true);

    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

      const response = await fetch(`${apiBase}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        let errorMessage = "Failed to contact AI";
        try {
          const errorBody = await response.json();
          if (errorBody?.error?.message) {
            errorMessage = errorBody.error.message;
          } else if (typeof errorBody === "string") {
            errorMessage = errorBody;
          }
        } catch {
          // ignore JSON parse errors, fall back to status text
          if (response.statusText) {
            errorMessage = response.statusText;
          }
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const replyContent: string =
        data?.reply?.trim() || "Sorry, I couldn't generate a reply. Please try again.";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: replyContent,
        },
      ]);
    } catch (error) {
      // Log full error for debugging in the browser console
      // eslint-disable-next-line no-console
      console.error("PXL AI chat error:", error);

      const message =
        error instanceof Error && error.message
          ? error.message
          : "There was an error talking to the AI. Please try again in a moment.";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `There was an error talking to the AI: ${message}`,
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(150deg, #fdf6e3 0%, #f8f1e8 25%, #e8f3ff 60%, #d7ecff 100%)",
      }}
    >
      <Header />
      <Hero />
      <HowItWorks />
      <Footer />

      {/* Chat panel */}
      {isChatOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 max-w-[90vw] max-h-[65vh] rounded-2xl bg-background/95 border border-border shadow-2xl flex flex-col overflow-hidden backdrop-blur-md">
          <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/70">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold tracking-wide uppercase">
                PXL AI Assistant
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsChatOpen(false)}
              className="p-1 rounded-full hover:bg-background transition-colors"
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "assistant" ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`px-3 py-2 text-xs rounded-2xl leading-relaxed shadow-sm max-w-[85%] ${
                    message.role === "assistant"
                      ? "bg-muted text-foreground"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} className="border-t border-border px-2 py-2 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about flights or routes..."
              className="flex-1 rounded-full border border-input bg-background px-3 py-1.5 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
              disabled={isSending}
            />
            <button
              type="submit"
              disabled={isSending || !input.trim()}
              className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs disabled:opacity-60 disabled:cursor-not-allowed hover:scale-105 transition-transform"
              aria-label="Send message"
            >
              <Send className="h-3 w-3" />
            </button>
          </form>
        </div>
      )}

      {/* Fixed Chat AI Assistant button */}
      <button
        type="button"
        aria-label="Chat with AI Assistant"
        className="fixed bottom-6 right-6 z-40 h-16 w-16 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        style={{ position: "fixed" }}
        onClick={() => setIsChatOpen((open) => !open)}
      >
        <MessageCircle className="h-7 w-7" />
      </button>
    </div>
  );
};

export default Index;

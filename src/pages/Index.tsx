import { useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Footer } from "@/components/Footer";
import { MessageCircle, Send, X } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type ChatRequestError = Error & {
  status?: number;
  rawMessage?: string;
};

const extractErrorMessage = (errorBody: unknown): string | null => {
  if (typeof errorBody === "string") return errorBody;

  if (errorBody && typeof errorBody === "object") {
    const body = errorBody as {
      error?: string | { message?: string };
      message?: string;
    };

    if (typeof body.error === "string") return body.error;
    if (body.error && typeof body.error === "object" && typeof body.error.message === "string") {
      return body.error.message;
    }
    if (typeof body.message === "string") return body.message;
  }

  return null;
};

const toSanitizedChatError = (rawMessage: string, status?: number): string => {
  const normalized = rawMessage.toLowerCase();

  if (
    normalized.includes("failed to fetch") ||
    normalized.includes("networkerror") ||
    normalized.includes("err_connection")
  ) {
    return "Cannot reach the chat assistant right now. Please make sure the backend server is running and try again.";
  }

  if (normalized.includes("groq_api_key") || normalized.includes("not configured")) {
    return "The chat assistant is temporarily unavailable due to a server configuration issue.";
  }

  if (status === 400 || normalized.includes("messages array is required")) {
    return "Your request could not be processed. Please try again with a shorter or clearer message.";
  }

  if ((status && status >= 500) || normalized.includes("unexpected error while talking to the ai")) {
    return "The chat assistant is temporarily unavailable. Please try again in a moment.";
  }

  return "There was an issue contacting the chat assistant. Please try again shortly.";
};

const Index = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi, I'm the PXL AI chat assistant. Ask me about flights, trip ideas, local routes, or how booking works with PXL Travel.",
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
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: nextMessages.map((message) => ({
            role: message.role,
            content: message.content,
          })),
        }),
      });

      if (!response.ok) {
        let errorMessage = "Failed to contact assistant";

        try {
          const errorBody = await response.json();
          const parsedError = extractErrorMessage(errorBody);
          if (parsedError) {
            errorMessage = parsedError;
          }
        } catch {
          try {
            const errorText = await response.text();
            if (errorText.trim()) {
              errorMessage = errorText;
            } else if (response.statusText) {
              errorMessage = response.statusText;
            }
          } catch {
            if (response.statusText) {
              errorMessage = response.statusText;
            }
          }
        }

        const requestError: ChatRequestError = new Error(errorMessage);
        requestError.status = response.status;
        requestError.rawMessage = errorMessage;
        throw requestError;
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
      const requestError = error as ChatRequestError;
      const rawMessage =
        requestError?.rawMessage ||
        (requestError instanceof Error ? requestError.message : "Unknown error");
      const sanitizedMessage = toSanitizedChatError(rawMessage, requestError?.status);

      console.error("PXL chat assistant error:", {
        rawMessage,
        status: requestError?.status,
        error,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: sanitizedMessage,
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-background"
      style={{
        backgroundImage:
          "linear-gradient(180deg, rgba(219, 123, 33, 0.08) 0%, rgba(219, 123, 33, 0.03) 36%, rgba(219, 123, 33, 0.08) 100%)",
      }}
    >
      <Header />
      <Hero />
      <HowItWorks />
      <Footer />

      {isChatOpen && (
        <div className="fixed bottom-24 right-6 z-50 flex max-h-[65vh] w-80 max-w-[90vw] flex-col overflow-hidden rounded-2xl border border-border bg-background/95 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-border bg-muted/70 px-3 py-2">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-wide">AI Chat Assistant</span>
            </div>
            <button
              type="button"
              onClick={() => setIsChatOpen(false)}
              className="rounded-full p-1 transition-colors hover:bg-background"
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto px-3 py-2">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "assistant" ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed shadow-sm ${
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

          <form onSubmit={handleSend} className="flex gap-2 border-t border-border px-2 py-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about routes, prices, or travel ideas..."
              className="flex-1 rounded-full border border-input bg-background px-3 py-1.5 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
              disabled={isSending}
            />
            <button
              type="submit"
              disabled={isSending || !input.trim()}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
              aria-label="Send message"
            >
              <Send className="h-3 w-3" />
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        id="ai-assistant"
        aria-label="Open AI Chat Assistant"
        className="fixed bottom-6 right-6 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all duration-200 hover:scale-110 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        style={{ position: "fixed" }}
        onClick={() => setIsChatOpen((open) => !open)}
      >
        <MessageCircle className="h-7 w-7" />
      </button>
    </div>
  );
};

export default Index;

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
    return "Cannot reach the AI service right now. Please make sure the backend server is running and try again.";
  }

  if (normalized.includes("groq_api_key") || normalized.includes("not configured")) {
    return "AI assistant is temporarily unavailable due to a server configuration issue.";
  }

  if (status === 400 || normalized.includes("messages array is required")) {
    return "Your request could not be processed. Please try again with a shorter or clearer message.";
  }

  if ((status && status >= 500) || normalized.includes("unexpected error while talking to the ai")) {
    return "AI service is temporarily unavailable. Please try again in a moment.";
  }

  return "There was an issue contacting the AI assistant. Please try again shortly.";
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
    e.preventDefault(); //Prevents the form from reloading the page when you press send (Like stopping the app from closing when you hit Enter)

    const trimmed = input.trim(); //Removes spaces Example: "   hello   " → "hello"

    if (!trimmed || isSending) return; //Don’t send if: message is empty or already sending another message

    const userMessage: ChatMessage = { role: "user", content: trimmed }; //Immediately shows your message in the chat, Like: You see your message appear before the reply comes




    const nextMessages = [...messages, userMessage]; //Clears textbox and prevents spam clicking
    setMessages(nextMessages);
    setInput("");
    setIsSending(true);

    try {
      const apiBase =  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000"; //production URL if available, otherwise local server


      const response = await fetch(`${apiBase}/api/chat`, { //Sends request to your server
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({  //Sends entire conversation, not just one message so AI remembers previous messages


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
          const parsedError = extractErrorMessage(errorBody);
          if (parsedError) {
            errorMessage = parsedError;
          }
        } catch {
          // Ignore JSON parse errors and try plain text fallback.
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
      const replyContent: string = // Use AI reply OR fallback if empty
        data?.reply?.trim() ||
        "Sorry, I couldn't generate a reply. Please try again.";

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

      // Log technical details for debugging while keeping user-facing errors sanitized.
      // eslint-disable-next-line no-console
      console.error("PXL AI chat error:", {
        rawMessage,
        status: requestError?.status,
        error,
      });

      setMessages((prev) => [ //Adds AI message to chat, Adds AI message to chat
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

          <form
            onSubmit={handleSend}
            className="border-t border-border px-2 py-2 flex gap-2"
          >
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

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User, Loader2, Trash2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/queryClient";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  pending?: boolean;
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open && !conversationId) {
      initConversation();
    }
  }, [open]);

  async function initConversation() {
    setInitializing(true);
    try {
      const conv = await apiRequest("POST", "/api/conversations", { title: "Chat MyJantes" });
      const data = await conv.json();
      setConversationId(data.id);
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: "Bonjour ! 👋 Je suis l'assistant MyJantes. Comment puis-je vous aider ? Rénovation, peinture, soudure de jantes… posez-moi vos questions !",
        },
      ]);
    } catch {
      setMessages([
        {
          id: "error",
          role: "assistant",
          content: "Désolé, le chat est momentanément indisponible. Contactez-nous par téléphone au 03 21 40 80 53.",
        },
      ]);
    } finally {
      setInitializing(false);
    }
  }

  async function sendMessage() {
    if (!input.trim() || loading || !conversationId) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input.trim() };
    const pendingMsg: Message = { id: "pending", role: "assistant", content: "", pending: true };

    setMessages((prev) => [...prev, userMsg, pendingMsg]);
    setInput("");
    setLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: userMsg.content }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) throw new Error("Stream failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const lines = decoder.decode(value).split("\n");
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const json = JSON.parse(line.slice(6));
            if (json.content) {
              assistantText += json.content;
              setMessages((prev) =>
                prev.map((m) => (m.id === "pending" ? { ...m, content: assistantText } : m))
              );
            }
            if (json.done) {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === "pending" ? { ...m, id: Date.now().toString(), pending: false } : m
                )
              );
            }
          } catch {}
        }
      }
    } catch (err: any) {
      if (err?.name !== "AbortError") {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === "pending"
              ? { ...m, id: Date.now().toString(), content: "Désolé, une erreur s'est produite. Veuillez réessayer.", pending: false }
              : m
          )
        );
      }
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function resetChat() {
    if (abortRef.current) abortRef.current.abort();
    setConversationId(null);
    setMessages([]);
    setInput("");
    setLoading(false);
  }

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        data-testid="button-chat-widget-toggle"
        aria-label="Ouvrir l'assistant MyJantes"
        className="w-14 h-14 rounded-full bg-auto-red hover:bg-auto-red-dark text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group relative"
      >
        {open ? (
          <ChevronDown className="w-6 h-6" />
        ) : (
          <>
            <MessageSquare className="w-7 h-7" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
          </>
        )}
        {!open && (
          <span className="absolute right-full mr-3 bg-white text-gray-800 text-xs font-bold px-3 py-2 rounded-lg shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Assistant IA
          </span>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          data-testid="panel-chat-widget"
          className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
          style={{ height: "480px" }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-gray-900 text-white">
            <div className="w-8 h-8 rounded-full bg-auto-red flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold leading-tight">Assistant MyJantes</p>
              <p className="text-[10px] text-white/50 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                En ligne · Réponse instantanée
              </p>
            </div>
            <button
              onClick={resetChat}
              data-testid="button-chat-reset"
              title="Nouvelle conversation"
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/50 hover:text-white"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setOpen(false)}
              data-testid="button-chat-close"
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/50 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {initializing && (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    msg.role === "user" ? "bg-auto-red" : "bg-gray-800"
                  }`}
                >
                  {msg.role === "user" ? (
                    <User className="w-3 h-3 text-white" />
                  ) : (
                    <Bot className="w-3 h-3 text-white" />
                  )}
                </div>
                <div
                  data-testid={`message-chat-${msg.role}`}
                  className={`max-w-[78%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-auto-red text-white rounded-tr-sm"
                      : "bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-sm"
                  }`}
                >
                  {msg.pending && !msg.content ? (
                    <span className="flex gap-1 items-center py-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:0ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:150ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:300ms]" />
                    </span>
                  ) : (
                    <span className="whitespace-pre-wrap">{msg.content}</span>
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-100 flex gap-2 items-end">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Posez votre question…"
              data-testid="input-chat-message"
              rows={1}
              disabled={loading || initializing}
              className="flex-1 resize-none text-sm rounded-xl border-gray-200 focus:border-auto-red min-h-[40px] max-h-24 py-2"
            />
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || loading || initializing || !conversationId}
              data-testid="button-chat-send"
              size="sm"
              className="bg-auto-red hover:bg-auto-red-dark text-white rounded-xl h-10 w-10 p-0 flex-shrink-0"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

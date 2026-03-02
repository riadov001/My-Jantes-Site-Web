import { useState, useRef, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { X, Send, Bot, Sparkles } from "lucide-react";
import { useLocation } from "wouter";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function renderMarkdownLinks(text: string, navigate: (path: string) => void) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    const match = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
    if (match) {
      const [, label, href] = match;
      if (href.startsWith("/")) {
        return (
          <button
            key={i}
            onClick={() => navigate(href)}
            className="text-auto-red underline underline-offset-2 font-semibold hover:text-auto-red-dark transition-colors"
          >
            {label}
          </button>
        );
      }
      return (
        <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="text-auto-red underline underline-offset-2 font-semibold hover:text-auto-red-dark">
          {label}
        </a>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export function FloatingButtons() {
  const { data: siteContent = {} } = useQuery<Record<string, string>>({ queryKey: ["/api/site-content"] });
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [, navigate] = useLocation();

  const whatsappHref = siteContent["contact.whatsapp_href"] || "https://wa.me/33671370418?text=Bonjour,%20je%20souhaite%20un%20devis%20pour%20mes%20jantes.";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (chatOpen && inputRef.current) inputRef.current.focus();
  }, [chatOpen]);

  const sendMessage = useCallback(async (directMsg?: string) => {
    const msg = directMsg || input.trim();
    if (!msg || streaming) return;
    if (!directMsg) setInput("");
    const newMessages: ChatMessage[] = [...messages, { role: "user", content: msg }];
    setMessages(newMessages);
    setStreaming(true);

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, history: newMessages.slice(-10) }),
      });

      if (!res.ok) throw new Error("Erreur");

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No reader");

      const decoder = new TextDecoder();
      let buffer = "";
      let assistantContent = "";

      setMessages(prev => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const event = JSON.parse(line.slice(6));
            if (event.content) {
              assistantContent += event.content;
              setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: "assistant", content: assistantContent };
                return updated;
              });
            }
          } catch {}
        }
      }
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Désolé, une erreur s'est produite. Veuillez réessayer ou nous contacter directement." }]);
    } finally {
      setStreaming(false);
    }
  }, [input, messages, streaming]);

  const quickQuestions = [
    "Quels sont vos tarifs ?",
    "Comment envoyer mes jantes ?",
    "Quel est le délai ?",
  ];

  return (
    <>
      {chatOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-[60] w-[calc(100vw-2rem)] sm:w-[400px] max-h-[70vh] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300" data-testid="chatbot-window">
          <div className="bg-auto-dark px-5 py-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-auto-red flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Assistant MyJantes</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-white/50 text-[10px] font-medium">En ligne</span>
                </div>
              </div>
            </div>
            <button onClick={() => setChatOpen(false)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors" data-testid="button-close-chat">
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-[200px] max-h-[50vh] bg-gray-50/50">
            {messages.length === 0 && (
              <div className="text-center py-6">
                <div className="w-14 h-14 rounded-full bg-auto-red/10 flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-7 h-7 text-auto-red" />
                </div>
                <p className="text-sm font-bold text-gray-800 mb-1">Bonjour !</p>
                <p className="text-xs text-gray-400 mb-4">Comment puis-je vous aider ?</p>
                <div className="space-y-2">
                  {quickQuestions.map(q => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="block w-full text-left px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-600 hover:border-auto-red/40 hover:text-auto-red transition-colors"
                      data-testid={`button-quick-${q.slice(0, 10)}`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-auto-red text-white rounded-br-md"
                    : "bg-white border border-gray-100 text-gray-700 rounded-bl-md shadow-sm"
                }`}>
                  {msg.role === "assistant"
                    ? renderMarkdownLinks(msg.content || (streaming && i === messages.length - 1 ? "..." : ""), navigate)
                    : msg.content
                  }
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="px-4 py-3 border-t border-gray-100 bg-white shrink-0">
            <form onSubmit={e => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Posez votre question..."
                className="flex-1 h-10 px-4 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-auto-red/50 focus:ring-1 focus:ring-auto-red/20 transition-colors"
                disabled={streaming}
                data-testid="input-chatbot"
              />
              <button
                type="submit"
                disabled={!input.trim() || streaming}
                className="w-10 h-10 bg-auto-red hover:bg-auto-red-dark text-white rounded-full flex items-center justify-center transition-colors disabled:opacity-40 shrink-0"
                data-testid="button-send-chat"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <p className="text-[9px] text-gray-300 text-center mt-1.5 font-medium">Propulsé par IA — Réponses indicatives</p>
          </div>
        </div>
      )}

      <div className="fixed bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-3 items-end">
        <button
          onClick={() => setChatOpen(!chatOpen)}
          aria-label="Ouvrir le chatbot IA"
          data-testid="button-chatbot-float"
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group ${
            chatOpen ? "bg-gray-700 hover:bg-gray-800" : "bg-auto-dark hover:bg-gray-800"
          }`}
        >
          {chatOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <Bot className="w-7 h-7 text-white" />
          )}
          {!chatOpen && (
            <span className="absolute right-full mr-3 bg-white text-gray-800 text-xs font-bold px-3 py-2 rounded-lg shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Assistant IA
            </span>
          )}
        </button>

        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Nous contacter sur WhatsApp"
          data-testid="button-whatsapp-float"
          className="w-14 h-14 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
        >
          <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          <span className="absolute right-full mr-3 bg-white text-gray-800 text-xs font-bold px-3 py-2 rounded-lg shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            WhatsApp
          </span>
        </a>
      </div>
    </>
  );
}

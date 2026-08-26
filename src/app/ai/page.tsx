"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { aiService } from "@/src/services/aiService";
import type { AIMessage } from "@/src/types";

export default function AIPage() {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: "msg-welcome",
      role: "assistant",
      timestamp: "Just now",
      content: `Namaste! I am **Yatra AI**, your context-aware travel companion grounded in verified official tourism and safety intelligence for India's 8 Union Territories.\n\nHow may I assist your journey today? You can ask me to tailor your Ladakh photo trip, check Lakshadweep ePermit rules, explore 2026 festival calendars, or inspect emergency medical facilities.`,
      citations: [
        { title: "Official Ladakh Tourism Portal", url: "https://tourism.ladakh.gov.in", verified: true },
        { title: "Lakshadweep ePermit Portal", url: "https://epermit.utl.gov.in", verified: true }
      ]
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isThinking) return;

    const userMessage: AIMessage = {
      id: `usr-${Date.now()}`,
      role: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: text
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsThinking(true);

    try {
      // Build conversation history format
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const response = await aiService.sendMessage(text, history);

      if (response.success && response.data) {
        setMessages((prev) => [...prev, response.data]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: "assistant",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            content: response.error?.message || "I apologize, but I am temporarily recalibrating. Please try asking again or dial 112 for urgent emergency support.",
            citations: [
              { title: "National Emergency Response System (112)", url: "https://112.gov.in", verified: true }
            ]
          }
        ]);
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          content: "Connection interrupted. Our verified knowledge base remains active for all 8 Union Territories.",
        }
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "msg-welcome-reset",
        role: "assistant",
        timestamp: "Just now",
        content: `Chat history cleared. How may I assist your travel discovery across India's 8 Union Territories?`,
      }
    ]);
  };

  const quickPrompts = [
    { label: "🏔️ Plan 5-Day Ladakh Itinerary", prompt: "Plan a 5-day photo tour of Ladakh with Pangong Tso and acclimatization tips" },
    { label: "🏝️ Lakshadweep ePermit Rules", prompt: "What are the official ePermit rules for visiting Lakshadweep islands?" },
    { label: "🚨 Emergency Helpline Numbers", prompt: "What are the emergency helpline numbers across the 8 Union Territories?" },
    { label: "🏛️ Delhi Heritage Walk", prompt: "Suggest a 1-day heritage walk covering Delhi's UNESCO monuments and food" },
    { label: "🌊 Andaman Scuba & Beaches", prompt: "Tell me about Radhanagar Beach and scuba diving spots in Andaman" },
    { label: "🎪 2026 Cultural Festivals", prompt: "Show me upcoming cultural festivals and events in 2026" }
  ];

  return (
    <main className="container section-spacing" role="main">
      <div className="section-header">
        <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "6px" }}>
          <span className="badge badge-verified">Phase 5 RAG Grounded</span>
          <span className="badge badge-official">Yatra AI Studio</span>
        </div>
        <h1>Yatra AI Travel Intelligence</h1>
        <p className="lead-text">
          Converse directly with our grounded AI engine for itinerary generation, permit guidelines, weather forecasts, and safety protocols across the 8 Union Territories.
        </p>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(qp.prompt)}
            className="btn btn-sm btn-ghost"
            style={{
              background: "var(--color-bg-surface-elevated)",
              border: "1px solid var(--color-border-medium)",
              borderRadius: "var(--radius-pill)",
              fontSize: "0.8rem",
              padding: "6px 14px",
              cursor: "pointer",
            }}
          >
            {qp.label}
          </button>
        ))}
      </div>

      <div
        className="card"
        style={{
          minHeight: "620px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "var(--shadow-elevated)",
          border: "1px solid var(--color-border-subtle)",
        }}
      >
        {/* Studio Top Bar */}
        <div
          style={{
            padding: "16px 24px",
            background: "var(--color-bg-surface-elevated)",
            borderBottom: "1px solid var(--color-border-subtle)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div className="status-dot status-dot-live"></div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--color-text-primary)" }}>
                Yatra AI Engine
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                Verified Database + Geospatial + Safety Layers Active
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={clearChat}
            className="btn btn-sm btn-ghost"
            style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}
            title="Clear Chat History"
          >
            Clear Chat
          </button>
        </div>

        {/* Message Stream */}
        <div
          style={{
            flexGrow: 1,
            padding: "24px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            maxHeight: "560px",
          }}
        >
          {messages.map((msg) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={msg.id}
                style={{
                  alignSelf: isUser ? "flex-end" : "flex-start",
                  maxWidth: "85%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                <div
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "var(--color-text-muted)",
                    padding: "0 4px",
                    alignSelf: isUser ? "flex-end" : "flex-start",
                  }}
                >
                  {isUser ? "You" : "🤖 Yatra AI"} • {msg.timestamp}
                </div>

                <div
                  className={`ai-message ${isUser ? "ai-message-user" : "ai-message-assistant"}`}
                  style={{
                    background: isUser ? "var(--color-primary)" : "var(--color-bg-surface-elevated)",
                    color: isUser ? "#ffffff" : "var(--color-text-primary)",
                    padding: "16px 20px",
                    borderRadius: "var(--radius-lg)",
                    border: isUser ? "none" : "1px solid var(--color-border-subtle)",
                    lineHeight: 1.6,
                    fontSize: "0.925rem",
                    whiteSpace: "pre-line",
                  }}
                >
                  {msg.content}
                </div>

                {/* Citations Box (for assistant responses) */}
                {msg.citations && msg.citations.length > 0 ? (
                  <div
                    className="ai-citations-box"
                    style={{
                      background: "var(--color-bg-surface)",
                      border: "1px solid var(--color-border-subtle)",
                      padding: "8px 14px",
                      borderRadius: "var(--radius-md)",
                      fontSize: "0.78rem",
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "8px",
                      alignItems: "center",
                    }}
                  >
                    <strong style={{ color: "var(--color-text-muted)" }}>Verified Sources:</strong>
                    {msg.citations.map((cite, cIdx) => (
                      <a
                        key={cIdx}
                        href={cite.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "var(--color-primary)",
                          textDecoration: "underline",
                          fontWeight: 600,
                        }}
                      >
                        ✓ {cite.title} ↗
                      </a>
                    ))}
                  </div>
                ) : null}

                {/* Action Proposal Card */}
                {msg.actionProposal ? (
                  <div
                    style={{
                      background: "var(--brand-terracotta-50, #fff7ed)",
                      border: "1px solid var(--brand-terracotta-200, #fed7aa)",
                      padding: "12px 16px",
                      borderRadius: "var(--radius-md)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "12px",
                      marginTop: "4px",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--brand-terracotta-700)" }}>
                        Action Proposal
                      </div>
                      <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--brand-terracotta-900)" }}>
                        {msg.actionProposal.title}
                      </div>
                    </div>
                    {msg.actionProposal.territorySlug ? (
                      <Link
                        href={`/territories/${msg.actionProposal.territorySlug}`}
                        className="btn btn-sm btn-secondary"
                        style={{ textDecoration: "none", fontWeight: 700, whiteSpace: "nowrap" }}
                      >
                        Explore Territory →
                      </Link>
                    ) : (
                      <Link
                        href="/itinerary"
                        className="btn btn-sm btn-secondary"
                        style={{ textDecoration: "none", fontWeight: 700, whiteSpace: "nowrap" }}
                      >
                        Open Planner →
                      </Link>
                    )}
                  </div>
                ) : null}
              </div>
            );
          })}

          {/* Thinking Indicator */}
          {isThinking ? (
            <div style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: "8px", background: "var(--color-bg-surface-elevated)", padding: "12px 18px", borderRadius: "var(--radius-lg)" }}>
              <div className="status-dot status-dot-live"></div>
              <span style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", fontStyle: "italic" }}>
                Yatra AI is searching verified records across 8 Union Territories...
              </span>
            </div>
          ) : null}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div
          style={{
            padding: "16px 24px",
            background: "var(--color-bg-surface)",
            borderTop: "1px solid var(--color-border-subtle)",
            display: "flex",
            gap: "12px",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isThinking}
            placeholder="Ask Yatra AI (e.g. Plan a 6-day photo tour of Ladakh, check Lakshadweep permits)..."
            className="search-input"
            style={{
              background: "var(--color-bg-surface-elevated)",
              padding: "14px 18px",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--color-border-medium)",
              flexGrow: 1,
              fontSize: "0.925rem",
              color: "var(--color-text-primary)",
            }}
          />
          <button
            type="button"
            onClick={() => handleSend()}
            disabled={isThinking || !inputText.trim()}
            className="btn btn-primary btn-lg"
            style={{
              padding: "12px 24px",
              fontWeight: 700,
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              whiteSpace: "nowrap",
              opacity: isThinking || !inputText.trim() ? 0.6 : 1,
              cursor: isThinking || !inputText.trim() ? "not-allowed" : "pointer",
            }}
          >
            <span>Send Prompt</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </main>
  );
}

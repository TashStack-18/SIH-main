'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import type { AIMessage } from '@/src/types';

interface YatraAiConversationProps {
  messages: AIMessage[];
  isThinking: boolean;
  onSendMessage: (text: string) => void;
  onClearChat: () => void;
  onSelectPrompt: (prompt: string) => void;
  onActionClick?: (actionType: string, payload?: any) => void;
}

export function YatraAiConversation({
  messages,
  isThinking,
  onSendMessage,
  onClearChat,
  onSelectPrompt,
  onActionClick,
}: YatraAiConversationProps) {
  const [inputText, setInputText] = useState('');
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const quickPrompts = [
    { label: '🏔️ Plan 5 Days in Ladakh', prompt: 'Plan a 5-day photo tour of Ladakh with Pangong Tso and acclimatization tips' },
    { label: '🏝️ Lakshadweep ePermits', prompt: 'What are the official ePermit rules for visiting Lakshadweep islands?' },
    { label: '🌊 Andaman Scuba & Beaches', prompt: 'Tell me about Radhanagar Beach and scuba diving spots in Andaman' },
    { label: '🏛️ Delhi Heritage Walk', prompt: 'Suggest a 1-day heritage walk covering Delhi UNESCO monuments' },
    { label: '🚨 Emergency Radar', prompt: 'What are the emergency medical and police helpline numbers across UTs?' },
  ];

  // Auto-resize composer textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputText]);

  // Intelligent auto-scroll
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = inputText.trim();
    if (!text || isThinking) return;
    onSendMessage(text);
    setInputText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const isInitialWelcome = messages.length <= 1;

  return (
    <div
      className="yatra-ai-conversation-pane"
      style={{
        background: '#ffffff',
        border: '1px solid rgba(200, 142, 68, 0.35)',
        borderRadius: 'var(--radius-xl)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--shadow-card)',
        overflow: 'hidden',
      }}
    >
      {/* 1. Conversational Header */}
      <div
        style={{
          padding: '16px 20px',
          background: 'var(--stitch-surface-variant, #F0EADE)',
          borderBottom: '1px solid rgba(156, 141, 127, 0.3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#16a34a',
              boxShadow: '0 0 0 3px rgba(22, 163, 74, 0.2)',
            }}
          />
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#2D1B14' }}>
              YATRA AI
            </div>
            <div style={{ fontSize: '0.75rem', color: '#78685C' }}>
              Your intelligent travel companion • Ready
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClearChat}
          className="btn btn-sm btn-ghost"
          style={{ fontSize: '0.75rem', color: '#78685C', padding: '4px 8px' }}
          title="Start fresh conversation"
        >
          + New Chat
        </button>
      </div>

      {/* 2. Message History Stream */}
      <div
        ref={messagesContainerRef}
        style={{
          flex: 1,
          padding: '20px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {/* Welcome Banner when starting */}
        {isInitialWelcome && (
          <div
            style={{
              background: 'rgba(240, 234, 222, 0.6)',
              borderRadius: 'var(--radius-lg)',
              padding: '16px 20px',
              border: '1px solid rgba(200, 142, 68, 0.3)',
              marginBottom: '4px',
            }}
          >
            <h2 className="font-serif" style={{ fontSize: '1.25rem', color: '#2D1B14', margin: '0 0 6px' }}>
              Plan your next journey.
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#4A3C31', margin: '0 0 14px', lineHeight: 1.5 }}>
              Ask me anything about India&apos;s 8 Union Territories — from itinerary pacing and permits to live weather telemetry.
            </p>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {quickPrompts.map((qp, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectPrompt(qp.prompt)}
                  style={{
                    background: '#ffffff',
                    border: '1px solid rgba(200, 142, 68, 0.4)',
                    borderRadius: '9999px',
                    padding: '6px 12px',
                    fontSize: '0.775rem',
                    fontWeight: 600,
                    color: '#2D1B14',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {qp.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Messages */}
        {messages.map((msg) => {
          const isUser = msg.role === 'user';

          return (
            <div
              key={msg.id}
              style={{
                alignSelf: isUser ? 'flex-end' : 'flex-start',
                maxWidth: isUser ? '85%' : '92%',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              {/* Message Header */}
              <div
                style={{
                  fontSize: '0.725rem',
                  fontWeight: 600,
                  color: '#78685C',
                  alignSelf: isUser ? 'flex-end' : 'flex-start',
                  padding: '0 4px',
                }}
              >
                {isUser ? 'You' : 'Yatra AI'} • {msg.timestamp || 'Just now'}
              </div>

              {/* Message Body */}
              <div
                style={{
                  background: isUser ? '#2D1B14' : 'var(--stitch-surface-variant, #F0EADE)',
                  color: isUser ? '#ffffff' : '#2D1B14',
                  padding: '14px 18px',
                  borderRadius: 'var(--radius-lg)',
                  border: isUser ? 'none' : '1px solid rgba(211, 201, 189, 0.8)',
                  fontSize: '0.9rem',
                  lineHeight: 1.55,
                  whiteSpace: 'pre-line',
                }}
              >
                {msg.content}
              </div>

              {/* Source Provenance Strip */}
              {msg.citations && msg.citations.length > 0 && (
                <div
                  style={{
                    background: '#ffffff',
                    border: '1px solid rgba(211, 201, 189, 0.8)',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    fontSize: '0.75rem',
                    color: '#78685C',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    flexWrap: 'wrap',
                  }}
                >
                  <strong style={{ color: '#2D1B14' }}>Sources:</strong>
                  {msg.citations.map((cite, idx) => (
                    <a
                      key={idx}
                      href={cite.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: '#C88E44',
                        textDecoration: 'none',
                        fontWeight: 700,
                      }}
                    >
                      ✓ {cite.title} ↗
                    </a>
                  ))}
                </div>
              )}

              {/* Action Proposal Card */}
              {msg.actionProposal && (
                <div
                  style={{
                    background: '#ffffff',
                    border: '1px solid #C88E44',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '10px',
                    marginTop: '2px',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#C88E44', textTransform: 'uppercase' }}>
                      Suggested Action
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#2D1B14' }}>
                      {msg.actionProposal.title}
                    </div>
                  </div>

                  <Link
                    href={msg.actionProposal.territorySlug ? `/territories/${msg.actionProposal.territorySlug}` : '/itinerary'}
                    className="btn btn-sm btn-primary"
                    style={{ background: '#2D1B14', borderColor: '#2D1B14', color: '#ffffff', fontWeight: 700, whiteSpace: 'nowrap', textDecoration: 'none' }}
                  >
                    Open Action →
                  </Link>
                </div>
              )}
            </div>
          );
        })}

        {/* Thinking / Tool Activity State */}
        {isThinking && (
          <div
            style={{
              alignSelf: 'flex-start',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--stitch-surface-variant, #F0EADE)',
              padding: '10px 16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(200, 142, 68, 0.3)',
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#C88E44',
                animation: 'pulse 1.5s infinite',
              }}
            />
            <span style={{ fontSize: '0.825rem', color: '#4A3C31', fontStyle: 'italic' }}>
              Searching verified records across 8 Union Territories…
            </span>
          </div>
        )}
      </div>

      {/* 3. Sticky Input Composer */}
      <form
        onSubmit={handleSubmit}
        style={{
          padding: '12px 16px',
          background: 'var(--stitch-surface-variant, #F0EADE)',
          borderTop: '1px solid rgba(156, 141, 127, 0.3)',
          display: 'flex',
          gap: '10px',
          alignItems: 'flex-end',
        }}
      >
        <div style={{ flex: 1, position: 'relative' }}>
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isThinking}
            placeholder="Ask Yatra AI anything (e.g. Plan 5 days in Ladakh, check permits, weather)..."
            style={{
              width: '100%',
              minHeight: '44px',
              maxHeight: '120px',
              background: '#ffffff',
              border: '1px solid rgba(200, 142, 68, 0.4)',
              borderRadius: 'var(--radius-lg)',
              padding: '10px 14px',
              fontSize: '0.875rem',
              color: '#2D1B14',
              resize: 'none',
              outline: 'none',
              lineHeight: 1.4,
              boxSizing: 'border-box',
            }}
          />
        </div>

        <button
          type="submit"
          disabled={isThinking || !inputText.trim()}
          className="btn btn-primary"
          style={{
            height: '44px',
            background: '#2D1B14',
            borderColor: '#2D1B14',
            color: '#ffffff',
            fontWeight: 700,
            padding: '0 18px',
            borderRadius: 'var(--radius-lg)',
            opacity: isThinking || !inputText.trim() ? 0.5 : 1,
            cursor: isThinking || !inputText.trim() ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            flexShrink: 0,
          }}
        >
          <span>Send</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </form>
    </div>
  );
}

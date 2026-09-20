'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import type { AIMessage } from '@/src/types';
import { linkifyPlaces, findPlaceForHeading, QuickPlaceRedirectionStrip } from './placeNavigation';

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

  // Preprocessor to segregate clustered RAG blocks and unstructured text
  const preprocessAndFormatAIResponse = (text: string): string => {
    if (!text) return '';

    if (
      text.includes('Destination:') ||
      text.includes('Overview:') ||
      text.includes('Highlights:') ||
      text.includes('Things to do:') ||
      text.includes('Safety Guidelines:') ||
      text.includes('Coordinates:')
    ) {
      let processed = text;

      processed = processed.replace(
        /Based on verified \*\*Bharat Safe Yatra\*\* official intelligence:\s*/gi,
        'Based on verified **Bharat Safe Yatra** official intelligence:\n\n'
      );

      processed = processed.replace(
        /Destination:\s*([^(.\n]+)(?:\s*\(([^)]+)\))?/gi,
        (match, name, territory) => {
          const loc = territory ? `📍 **${territory.trim()}**` : '';
          return `### 🏛️ ${name.trim()}\n${loc}`;
        }
      );

      processed = processed.replace(
        /\.?\s*Tagline:\s*([^.\n]+)(?:\.|\n|$)/gi,
        '\n*$1*\n\n---\n'
      );

      processed = processed.replace(/Type:\s*([^.\n]+)(?:\.|\n|$)/gi, ' • 🏷️ **Type:** $1');
      processed = processed.replace(/Coordinates:\s*([0-9.,\s-]+)(?:\.|\n|$)/gi, ' • 🧭 **GPS:** `$1`\n\n');

      processed = processed
        .replace(/(?:\n|^)\s*(?:\*\*)?\.?\s*(?:📌\s*)?Overview:(?:\*\*)?\s*/gi, '\n\n**📖 Overview**\n')
        .replace(/(?:\n|^)\s*(?:\*\*)?\.?\s*(?:🌟\s*)?Highlights:(?:\*\*)?\s*/gi, '\n\n**🌟 Key Highlights**\n')
        .replace(/(?:\n|^)\s*(?:\*\*)?\.?\s*(?:🎯\s*)?Things to do:(?:\*\*)?\s*/gi, '\n\n**🎯 Recommended Experiences**\n')
        .replace(/(?:\n|^)\s*(?:\*\*)?\.?\s*(?:🛡️\s*)?Safety Guidelines:(?:\*\*)?\s*/gi, '\n\n**🛡️ Safety & Practical Advice**\n')
        .replace(/(?:\n|^)\s*(?:\*\*)?\.?\s*(?:🏥\s*)?Nearest Emergency Medical Facility:(?:\*\*)?\s*/gi, '\n\n**🏥 Emergency Response Facility**\n')
        .replace(/(?:\n|^)\s*(?:\*\*)?\.?\s*(?:☀️\s*)?Weather advisory:(?:\*\*)?\s*/gi, '\n\n**☀️ Weather & Best Season**\n')
        .replace(/(?:\n|^)\s*(?:\*\*)?\.?\s*(?:🍲\s*)?Specialty dishes:(?:\*\*)?\s*/gi, '\n\n**🍲 Regional Specialties**\n')
        .replace(/(?:\n|^)\s*(?:\*\*)?\.?\s*(?:📋\s*)?Permits(?: REQUIRED)?:(?:\*\*)?\s*/gi, '\n\n**📋 Entry & Permits**\n');

      processed = processed.replace(
        /(\*\*(?:🌟 Key Highlights|🎯 Recommended Experiences|🛡️ Safety & Practical Advice)\*\*)\n([^\n]+)/g,
        (match, header, body) => {
          const items = body
            .split(/[;]\s*/)
            .map((item: string) => item.trim().replace(/^\.+|\.+$/g, ''))
            .filter((item: string) => item.length > 2);
          if (items.length > 1) {
            return `${header}\n${items.map((i: string) => `• ${i}`).join('\n')}`;
          }
          return match;
        }
      );

      return processed;
    }

    return text;
  };

  const formatBoldAndCode = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|`.*?`|\*.*?\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const inner = part.slice(2, -2);
        return (
          <strong key={i} style={{ fontWeight: 700, color: 'inherit' }}>
            {linkifyPlaces(inner)}
          </strong>
        );
      }
      if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**')) {
        const inner = part.slice(1, -1);
        return (
          <em key={i} style={{ fontStyle: 'italic', opacity: 0.9 }}>
            {linkifyPlaces(inner)}
          </em>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={i}
            style={{
              background: 'rgba(0, 0, 0, 0.08)',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '0.825em',
              fontFamily: 'monospace',
              color: 'var(--color-accent, #B45309)',
            }}
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      return <React.Fragment key={i}>{linkifyPlaces(part)}</React.Fragment>;
    });
  };

  const renderMessageContent = (rawContent: string, isUser: boolean) => {
    if (isUser) {
      return <div style={{ whiteSpace: 'pre-wrap' }}>{rawContent}</div>;
    }

    const content = preprocessAndFormatAIResponse(rawContent);
    const lines = content.split('\n');

    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={idx} style={{ height: '6px' }} />;

      if (line.startsWith('### ')) {
        const headingText = line.replace('### ', '').trim();
        const matchedPlace = findPlaceForHeading(headingText);
        return (
          <div
            key={idx}
            style={{
              fontSize: '1rem',
              fontWeight: 800,
              color: 'var(--color-text-primary)',
              margin: '12px 0 6px 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
              paddingBottom: '4px',
              borderBottom: '1px solid var(--color-border-subtle)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'var(--color-accent, #FF9933)', fontSize: '1.1rem' }}>✦</span>
              <span>{formatBoldAndCode(headingText)}</span>
            </div>
            {matchedPlace && (
              <Link
                href={matchedPlace.url}
                title={`Visit ${matchedPlace.name}`}
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  background: 'linear-gradient(135deg, #FF9933, #EA580C)',
                  padding: '3px 10px',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: '0 1px 3px rgba(255, 153, 51, 0.35)',
                  flexShrink: 0,
                }}
              >
                <span>Explore</span>
                <span style={{ fontSize: '0.75em' }}>➔</span>
              </Link>
            )}
          </div>
        );
      }

      if (trimmed === '---') {
        return (
          <hr
            key={idx}
            style={{
              margin: '10px 0',
              border: 'none',
              borderTop: '1px solid var(--color-border-subtle)',
            }}
          />
        );
      }

      if ((line.includes('📍') || line.includes('🏷️') || line.includes('🧭')) && line.includes('•')) {
        const badges = line.split('•').map((b) => b.trim()).filter(Boolean);
        return (
          <div key={idx} style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '6px 0 8px 0' }}>
            {badges.map((badge, bIdx) => (
              <span
                key={bIdx}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  padding: '3px 9px',
                  borderRadius: '9999px',
                  background: 'rgba(255, 153, 51, 0.1)',
                  color: 'var(--color-text-primary)',
                  border: '1px solid rgba(255, 153, 51, 0.25)',
                }}
              >
                {formatBoldAndCode(badge)}
              </span>
            ))}
          </div>
        );
      }

      const isSectionHeader =
        line.startsWith('**') &&
        (line.includes('Overview') ||
          line.includes('Highlights') ||
          line.includes('Experiences') ||
          line.includes('Things To Do') ||
          line.includes('Activities') ||
          line.includes('Safety') ||
          line.includes('Permits') ||
          line.includes('Entry') ||
          line.includes('Climate') ||
          line.includes('Season') ||
          line.includes('Specialties') ||
          line.includes('Emergency') ||
          line.includes('Advisories') ||
          line.includes('Destinations'));

      if (isSectionHeader) {
        return (
          <div
            key={idx}
            style={{
              fontSize: '0.825rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: 'var(--color-accent, #B45309)',
              marginTop: '12px',
              marginBottom: '5px',
            }}
          >
            {formatBoldAndCode(line)}
          </div>
        );
      }

      if (line.startsWith('• ') || line.startsWith('- ')) {
        return (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              margin: '3px 0',
              padding: '5px 10px',
              borderRadius: '8px',
              background: 'rgba(0, 0, 0, 0.025)',
              border: '1px solid rgba(0, 0, 0, 0.04)',
              lineHeight: 1.5,
              fontSize: '0.85rem',
            }}
          >
            <span style={{ color: 'var(--color-accent, #FF9933)', fontWeight: 800 }}>✦</span>
            <div style={{ flex: 1, color: 'var(--color-text-primary)' }}>{formatBoldAndCode(line.substring(2))}</div>
          </div>
        );
      }

      if (line.startsWith('💡') || line.startsWith('🔗') || line.startsWith('*All guidance')) {
        return (
          <div
            key={idx}
            style={{
              margin: '10px 0 4px',
              padding: '8px 12px',
              borderRadius: '8px',
              background: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              fontSize: '0.785rem',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.5,
            }}
          >
            {formatBoldAndCode(line)}
          </div>
        );
      }

      return (
        <p key={idx} style={{ margin: '4px 0', lineHeight: 1.6, fontSize: '0.875rem' }}>
          {formatBoldAndCode(line)}
        </p>
      );
    });
  };

  return (
    <div
      className="yatra-ai-conversation-pane"
      style={{
        background: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border-subtle)',
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
          background: 'var(--color-bg-surface-elevated)',
          borderBottom: '1px solid var(--color-border-subtle)',
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
              background: 'var(--color-success)',
              boxShadow: '0 0 0 3px rgba(22, 163, 74, 0.2)',
            }}
          />
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--color-text-primary)' }}>
              YATRA AI
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              Your intelligent travel companion • Ready
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClearChat}
          className="btn btn-sm btn-ghost"
          style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', padding: '4px 8px' }}
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
              background: 'var(--color-bg-surface-elevated)',
              borderRadius: 'var(--radius-lg)',
              padding: '16px 20px',
              border: '1px solid var(--color-border-subtle)',
              marginBottom: '4px',
            }}
          >
            <h2 className="font-serif" style={{ fontSize: '1.25rem', color: 'var(--color-text-primary)', margin: '0 0 6px' }}>
              Plan your next journey.
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: '0 0 14px', lineHeight: 1.5 }}>
              Ask me anything about India&apos;s 8 Union Territories — from itinerary pacing and permits to live weather telemetry.
            </p>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {quickPrompts.map((qp, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectPrompt(qp.prompt)}
                  style={{
                    background: 'var(--color-bg-surface)',
                    border: '1px solid var(--color-border-subtle)',
                    borderRadius: '9999px',
                    padding: '6px 12px',
                    fontSize: '0.775rem',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
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
                  color: 'var(--color-text-muted)',
                  alignSelf: isUser ? 'flex-end' : 'flex-start',
                  padding: '0 4px',
                }}
              >
                {isUser ? 'You' : 'Yatra AI'} • {msg.timestamp || 'Just now'}
              </div>

              {/* Message Body */}
              <div
                style={{
                  background: isUser
                    ? 'linear-gradient(135deg, #1E293B, #0F172A)'
                    : 'var(--color-bg-surface-elevated)',
                  color: isUser ? '#FFFFFF' : 'var(--color-text-primary)',
                  padding: '14px 18px',
                  borderRadius: 'var(--radius-lg)',
                  border: isUser
                    ? '1px solid rgba(255, 255, 255, 0.15)'
                    : '1px solid var(--color-border-subtle)',
                  fontSize: '0.9rem',
                  lineHeight: 1.55,
                  boxShadow: isUser
                    ? '0 4px 14px rgba(15, 23, 42, 0.3)'
                    : 'none',
                }}
              >
                {isUser ? (
                  <div style={{ color: '#FFFFFF', whiteSpace: 'pre-wrap', fontWeight: 500, lineHeight: 1.55 }}>
                    {msg.content}
                  </div>
                ) : (
                  <>
                    {renderMessageContent(msg.content, isUser)}
                    <QuickPlaceRedirectionStrip text={msg.content} />
                  </>
                )}
              </div>

              {/* Source Provenance Strip */}
              {msg.citations && msg.citations.length > 0 && (
                <div
                  style={{
                    background: 'var(--color-bg-surface)',
                    border: '1px solid var(--color-border-subtle)',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    fontSize: '0.75rem',
                    color: 'var(--color-text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    flexWrap: 'wrap',
                  }}
                >
                  <strong style={{ color: 'var(--color-text-primary)' }}>Sources:</strong>
                  {msg.citations.map((cite, idx) => (
                    <a
                      key={idx}
                      href={cite.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: 'var(--color-accent)',
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
                    background: 'var(--color-bg-surface)',
                    border: '1px solid var(--color-accent)',
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
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-accent)', textTransform: 'uppercase' }}>
                      Suggested Action
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                      {msg.actionProposal.title}
                    </div>
                  </div>

                  <Link
                    href={msg.actionProposal.territorySlug ? `/destinations?ut=${msg.actionProposal.territorySlug}` : '/itinerary'}
                    className="btn btn-sm btn-primary"
                    style={{ whiteSpace: 'nowrap', textDecoration: 'none' }}
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
              background: 'var(--color-bg-surface-elevated)',
              padding: '10px 16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border-subtle)',
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'var(--color-accent)',
                animation: 'pulse 1.5s infinite',
              }}
            />
            <span style={{ fontSize: '0.825rem', color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>
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
          background: 'var(--color-bg-surface-elevated)',
          borderTop: '1px solid var(--color-border-subtle)',
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
              background: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '10px 14px',
              fontSize: '0.875rem',
              color: 'var(--color-text-primary)',
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

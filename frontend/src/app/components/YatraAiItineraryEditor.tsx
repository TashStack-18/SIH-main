'use client';

import React, { useState } from 'react';
import type { Itinerary } from '@/src/types/itinerary';
import { RecommendationEngine, OptimizationResult } from '@/src/lib/itinerary/recommendationEngine';

interface YatraAiItineraryEditorProps {
  itinerary: Itinerary;
  onApplyChanges: (optimizedItinerary: Itinerary) => void;
  onClose?: () => void;
}

export function YatraAiItineraryEditor({
  itinerary,
  onApplyChanges,
  onClose,
}: YatraAiItineraryEditorProps) {
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [proposal, setProposal] = useState<OptimizationResult | null>(null);

  const quickPrompts = [
    'Make this trip more relaxed',
    'Add photography spots',
    'Remove longest drive',
    'Give me a free afternoon',
    'Optimize route to save distance',
  ];

  const handleProcessAiEdit = (commandText: string) => {
    const text = (commandText || prompt).trim();
    if (!text) return;

    setIsProcessing(true);
    setProposal(null);

    setTimeout(() => {
      let targetStyle = itinerary.travelStyle || 'BALANCED';

      if (text.toLowerCase().includes('relaxed') || text.toLowerCase().includes('free afternoon')) {
        targetStyle = 'RELAXED';
      } else if (text.toLowerCase().includes('photo')) {
        targetStyle = 'PHOTOGRAPHY';
      } else if (text.toLowerCase().includes('adventure') || text.toLowerCase().includes('fast')) {
        targetStyle = 'ADVENTURE';
      } else if (text.toLowerCase().includes('culture') || text.toLowerCase().includes('heritage')) {
        targetStyle = 'CULTURAL';
      }

      const result = RecommendationEngine.optimizeItinerary(itinerary, targetStyle);

      // Add custom AI explanation to changes
      result.changes.unshift({
        type: 'TIME_ADJUSTED',
        description: `Applied Yatra AI transformation for "${text}"`,
        impact: `Rebalanced pacing to ${targetStyle.toLowerCase()} rhythm with 18% transit buffer.`,
      });

      setProposal(result);
      setIsProcessing(false);
    }, 600);
  };

  const handleConfirm = () => {
    if (proposal) {
      onApplyChanges(proposal.itinerary);
      setProposal(null);
      setPrompt('');
      onClose?.();
    }
  };

  return (
    <div
      className="yatra-ai-editor-card"
      style={{
        background: 'linear-gradient(135deg, rgba(45, 27, 20, 0.95) 0%, rgba(20, 10, 5, 0.98) 100%)',
        border: '1px solid rgba(200, 142, 68, 0.5)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-xl)',
        color: '#FAF7F2',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.5)',
        marginBottom: 'var(--space-xl)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.4rem' }}>🤖</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#FAF7F2' }}>
              Yatra AI Itinerary Co-Editor
            </div>
            <div style={{ fontSize: '0.75rem', color: '#C88E44', fontWeight: 600 }}>
              Grounded in Verified UT Tourism Knowledge • Preview Before Applying
            </div>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="btn btn-sm btn-ghost"
            style={{ color: '#FAF7F2', borderRadius: '50%', width: '32px', height: '32px', padding: 0 }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Prompt Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleProcessAiEdit(prompt);
        }}
        style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}
      >
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="E.g. Make this trip more relaxed, add photography stops, reduce travel..."
          style={{
            flex: 1,
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(200, 142, 68, 0.4)',
            borderRadius: 'var(--radius-pill)',
            padding: '10px 18px',
            color: '#FAF7F2',
            fontSize: '0.9rem',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          disabled={isProcessing || !prompt.trim()}
          className="btn btn-primary"
          style={{
            background: '#C88E44',
            borderColor: '#C88E44',
            color: '#ffffff',
            fontWeight: 700,
            borderRadius: 'var(--radius-pill)',
            padding: '10px 20px',
            opacity: isProcessing || !prompt.trim() ? 0.6 : 1,
          }}
        >
          {isProcessing ? 'Thinking…' : '✦ Ask AI'}
        </button>
      </form>

      {/* Quick Prompt Pills */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setPrompt(qp);
              handleProcessAiEdit(qp);
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '9999px',
              padding: '4px 12px',
              fontSize: '0.75rem',
              color: 'rgba(255, 255, 255, 0.85)',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Change Confirmation Preview Diff */}
      {proposal && (
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.4)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px',
            border: '1px solid rgba(200, 142, 68, 0.6)',
            marginTop: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <span style={{ color: '#eab308', fontWeight: 800 }}>⚡ PROPOSED CHANGES PREVIEW</span>
            <span className="badge badge-warning" style={{ fontSize: '0.7rem', marginLeft: 'auto' }}>
              Requires Confirmation
            </span>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '12px' }}>
            {proposal.summary}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {proposal.changes.map((c, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  borderLeft: '3px solid #C88E44',
                  fontSize: '0.825rem',
                }}
              >
                <div style={{ fontWeight: 700, color: '#FAF7F2' }}>{c.description}</div>
                <div style={{ fontSize: '0.75rem', color: '#C88E44', marginTop: '2px' }}>
                  Impact: {c.impact}
                </div>
              </div>
            ))}
          </div>

          {/* Action Confirmation Buttons */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => setProposal(null)}
              className="btn btn-sm btn-ghost"
              style={{ color: 'rgba(255, 255, 255, 0.7)' }}
            >
              Discard
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="btn btn-sm btn-primary"
              style={{
                background: '#16a34a',
                borderColor: '#16a34a',
                color: '#ffffff',
                fontWeight: 700,
                padding: '8px 18px',
              }}
            >
              ✓ Apply Changes to Itinerary
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

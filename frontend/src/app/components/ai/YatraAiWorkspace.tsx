'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { YatraAiConversation } from './YatraAiConversation';
import { YatraAiTravelContext, ActiveTravelContext } from './YatraAiTravelContext';
import { aiService } from '@/src/services/aiService';
import { VERIFIED_DESTINATIONS, VERIFIED_TERRITORIES } from '@/src/lib/fixtures';
import type { AIMessage } from '@/src/types';

export function YatraAiWorkspace() {
  const searchParams = useSearchParams();
  const destinationParam = searchParams.get('destination');
  const territoryParam = searchParams.get('territory');
  const promptParam = searchParams.get('prompt');

  // Messages state
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      timestamp: 'Just now',
      content: `Namaste! I am **Yatra AI**, your context-aware travel companion grounded in verified official tourism and safety intelligence for India's 8 Union Territories.\n\nHow may I assist your journey today? You can ask me to tailor your Ladakh photo trip, check Lakshadweep ePermit rules, explore 2026 festival calendars, or inspect emergency medical facilities.`,
      citations: [
        { title: 'Official Ladakh Tourism Portal', url: 'https://tourism.ladakh.gov.in', verified: true },
        { title: 'Lakshadweep ePermit Portal', url: 'https://epermit.utl.gov.in', verified: true },
      ],
    },
  ]);

  // Context workspace state
  const [travelContext, setTravelContext] = useState<ActiveTravelContext>({
    mode: 'DEFAULT',
    activeChips: ['ALL 8 UTs', 'SOVEREIGN RAG'],
  });

  const [isThinking, setIsThinking] = useState(false);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

  // Parse destination or territory from prompt or URL
  const updateContextFromText = (text: string) => {
    const lower = text.toLowerCase();

    if (lower.includes('weather') || lower.includes('temperature') || lower.includes('climate')) {
      setTravelContext({
        mode: 'WEATHER',
        weatherData: {
          location: lower.includes('leh') || lower.includes('ladakh') ? 'Leh District (3,500m)' : 'Port Blair, Andaman',
          tempC: lower.includes('leh') || lower.includes('ladakh') ? 14 : 29,
          condition: lower.includes('leh') || lower.includes('ladakh') ? 'Clear Sky • High Altitude UV' : 'Tropical Breeze • Ocean Calm',
          humidity: lower.includes('leh') || lower.includes('ladakh') ? 28 : 78,
          windKmh: 12,
          updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
        activeChips: ['LIVE WEATHER', 'TELEMETRY'],
      });
      return;
    }

    if (lower.includes('emergency') || lower.includes('hospital') || lower.includes('police') || lower.includes('112') || lower.includes('safety')) {
      setTravelContext({
        mode: 'SAFETY',
        safetyData: {
          nearestHospital: 'Sonam Norboo Memorial Hospital (SNM), Leh',
          hospitalDistanceKm: 2.4,
          policeStation: 'District Police Headquarters Leh',
          emergencyHelpline: '112',
        },
        activeChips: ['SAFETY RADAR', 'EMERGENCY 112'],
      });
      return;
    }

    if (lower.includes('hotel') || lower.includes('stay') || lower.includes('resort') || lower.includes('booking')) {
      setTravelContext({
        mode: 'BOOKING',
        bookingData: {
          providerName: 'JKTDC / UT Licensed Heritage Stays',
          location: 'Leh & Nubra Valley',
          category: 'Verified Government Stay',
          officialUrl: 'https://tourism.ladakh.gov.in',
          status: 'CHECK_ON_PROVIDER',
        },
        activeChips: ['VERIFIED STAYS', 'NO COMMISSION'],
      });
      return;
    }

    if (lower.includes('route') || lower.includes('drive') || lower.includes('how to get') || lower.includes('khardung la')) {
      setTravelContext({
        mode: 'MAP',
        routeData: {
          origin: 'Leh Main City',
          destination: 'Nubra Valley (Diskit / Hunder)',
          distanceKm: 128,
          durationMinutes: 260,
          waypoints: ['South Pullu', 'Khardung La Pass (5,359m)', 'North Pullu', 'Diskit'],
        },
        activeChips: ['TOMTOM ROUTE', 'ROAD TELEMETRY'],
      });
      return;
    }

    // Match destination slug or name
    for (const dest of VERIFIED_DESTINATIONS) {
      if (lower.includes(dest.name.toLowerCase()) || lower.includes(dest.slug)) {
        setTravelContext({
          mode: 'DESTINATION',
          destinationSlug: dest.slug,
          destinationName: dest.name,
          destinationData: dest,
          territoryId: dest.territoryId,
          territoryName: dest.territoryName,
          activeChips: [dest.territoryName.toUpperCase(), dest.type],
        });
        return;
      }
    }

    if (lower.includes('plan') || lower.includes('itinerary') || lower.includes('days') || lower.includes('tour')) {
      setTravelContext({
        mode: 'ITINERARY',
        itineraryData: {
          title: '5-Day Trans-Himalayan Journey',
          territoryName: 'Ladakh',
          durationDays: 5,
          stopCount: 6,
          totalDistanceKm: 340,
          travelStyle: 'Balanced',
          days: [
            { dayNumber: 1, title: 'Acclimatization & Leh Palace', stops: ['Leh Palace', 'Shanti Stupa'] },
            { dayNumber: 2, title: 'Khardung La to Nubra Valley', stops: ['Khardung La', 'Hunder Dunes'] },
            { dayNumber: 3, title: 'Shyok Gorge to Pangong Tso', stops: ['Diskit Monastery', 'Pangong Tso'] },
          ],
        },
        activeChips: ['ITINERARY PROPOSAL', 'LADAKH', '5 DAYS'],
      });
      return;
    }
  };

  // URL handoff on initial load
  useEffect(() => {
    if (destinationParam) {
      const match = VERIFIED_DESTINATIONS.find((d) => d.slug === destinationParam || d.id === destinationParam);
      if (match) {
        setTravelContext({
          mode: 'DESTINATION',
          destinationSlug: match.slug,
          destinationName: match.name,
          destinationData: match,
          territoryId: match.territoryId,
          territoryName: match.territoryName,
          activeChips: [match.territoryName.toUpperCase(), match.type],
        });
      }
    }
    if (promptParam) {
      handleSendMessage(promptParam);
    }
  }, [destinationParam, promptParam]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isThinking) return;

    updateContextFromText(text);

    const userMessage: AIMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: text.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsThinking(true);

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }));
      const response = await aiService.sendMessage(text, history);

      if (response.success && response.data) {
        setMessages((prev) => [...prev, response.data]);
        if (response.data.content) {
          updateContextFromText(response.data.content);
        }
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: 'assistant',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            content:
              response.error?.message ||
              'I am temporarily recalibrating. You can explore verified records in the Travel Workspace on the right, or dial 112 for urgent emergency support.',
            citations: [{ title: 'National Emergency Response System (112)', url: 'https://112.gov.in', verified: true }],
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          content: 'Connection interrupted. Our verified knowledge base remains active for all 8 Union Territories.',
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'msg-welcome-reset',
        role: 'assistant',
        timestamp: 'Just now',
        content: `Chat history cleared. How may I assist your travel discovery across India's 8 Union Territories?`,
      },
    ]);
    setTravelContext({
      mode: 'DEFAULT',
      activeChips: ['ALL 8 UTs', 'SOVEREIGN RAG'],
    });
  };

  return (
    <div className="yatra-ai-workspace-container" style={{ width: '100%' }}>
      
      {/* Mobile Context Switcher Bar */}
      <div className="mobile-only" style={{ display: 'none', marginBottom: '14px' }}>
        <button
          type="button"
          onClick={() => setMobileSheetOpen((prev) => !prev)}
          className="btn btn-sm btn-outline"
          style={{ width: '100%', borderColor: '#C88E44', color: '#2D1B14', fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <span>📍 Travel Context Workspace: {travelContext.mode}</span>
          <span>{mobileSheetOpen ? 'Hide ▲' : 'Open ▼'}</span>
        </button>
      </div>

      {/* DUAL-PANE DESKTOP WORKSPACE */}
      <div
        className="yatra-ai-dual-layout"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(400px, 1.25fr) minmax(360px, 1fr)',
          gap: 'var(--space-xl)',
          height: 'calc(100vh - 210px)',
          minHeight: '620px',
          maxHeight: '840px',
        }}
      >
        {/* LEFT PANEL: Conversation Stream & Composer */}
        <div style={{ height: '100%', minHeight: 0 }}>
          <YatraAiConversation
            messages={messages}
            isThinking={isThinking}
            onSendMessage={handleSendMessage}
            onClearChat={handleClearChat}
            onSelectPrompt={handleSendMessage}
          />
        </div>

        {/* RIGHT PANEL: Dynamic Travel Context Workspace */}
        <div className="yatra-ai-context-wrapper" style={{ height: '100%', minHeight: 0 }}>
          <YatraAiTravelContext
            context={travelContext}
            onClearContext={() => setTravelContext({ mode: 'DEFAULT', activeChips: ['ALL 8 UTs'] })}
            onSelectPrompt={handleSendMessage}
          />
        </div>
      </div>

      {/* Mobile Bottom-Sheet Drawer */}
      {mobileSheetOpen && (
        <div
          className="mobile-only"
          style={{
            marginTop: '16px',
            background: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid #C88E44',
            padding: '16px',
            boxShadow: '0 12px 36px rgba(0,0,0,0.2)',
          }}
        >
          <YatraAiTravelContext
            context={travelContext}
            onClearContext={() => setTravelContext({ mode: 'DEFAULT', activeChips: ['ALL 8 UTs'] })}
            onSelectPrompt={(p) => {
              handleSendMessage(p);
              setMobileSheetOpen(false);
            }}
          />
        </div>
      )}

    </div>
  );
}

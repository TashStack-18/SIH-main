'use client';

/**
 * 🇮🇳 DISHAARA — GLOBAL TRAVEL ALERT CONTEXT & PROVIDER
 *
 * Centralized, event-driven travel safety intelligence layer:
 * - Single controlled polling mechanism (default: 4 mins, pauses on tab blur)
 * - Deterministic relevance calculation
 * - Session/Local storage dismissal with escalation/update detection
 * - Zero UI footprint when no active relevant emergencies exist
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { TravelAlert, UserTravelContext, AlertRelevanceEvaluation } from '@/src/types/travelAlert';
import { filterAndRankRelevantAlerts } from '@/src/lib/safety/alertRelevanceEngine';

interface DismissalRecord {
  dismissedAt: string;
  updatedAt: string;
  severity: string;
}

interface TravelAlertContextType {
  activeAlerts: TravelAlert[];
  relevantAlerts: Array<{ alert: TravelAlert; evaluation: AlertRelevanceEvaluation }>;
  currentAlert: TravelAlert | null;
  currentEvaluation: AlertRelevanceEvaluation | null;
  totalRelevantCount: number;
  lastUpdated: string | null;
  isLoading: boolean;
  userContext: UserTravelContext;
  updateTravelContext: (partial: Partial<UserTravelContext>) => void;
  dismissAlert: (alertId: string) => void;
  isAlertDismissed: (alert: TravelAlert) => boolean;
  selectedAlertForDetails: TravelAlert | null;
  openAlertDetails: (alert: TravelAlert) => void;
  closeAlertDetails: () => void;
  refreshAlerts: () => Promise<void>;
}

const TravelAlertContext = createContext<TravelAlertContextType | undefined>(undefined);

const DISMISSED_STORAGE_KEY = 'dishaara_dismissed_alerts_v1';
const POLLING_INTERVAL_MS = 4 * 60 * 1000; // 4 minutes

export function TravelAlertProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [activeAlerts, setActiveAlerts] = useState<TravelAlert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [dismissedMap, setDismissedMap] = useState<Record<string, DismissalRecord>>({});
  const [selectedAlertForDetails, setSelectedAlertForDetails] = useState<TravelAlert | null>(null);

  const [userContext, setUserContext] = useState<UserTravelContext>({
    selectedDestinationId: null,
    currentViewedDestinationSlug: null,
    activeItinerary: null,
    userLocation: null,
    aiSelectedDestinationId: null,
  });

  // Load dismissal state from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(DISMISSED_STORAGE_KEY);
      if (stored) {
        setDismissedMap(JSON.parse(stored));
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Update current viewed destination slug based on route changes
  useEffect(() => {
    if (pathname.startsWith('/destinations/')) {
      const parts = pathname.split('/destinations/');
      if (parts[1]) {
        const slug = parts[1].split('/')[0].split('?')[0];
        setUserContext((prev) => ({
          ...prev,
          currentViewedDestinationSlug: decodeURIComponent(slug),
        }));
      }
    } else {
      setUserContext((prev) => {
        if (prev.currentViewedDestinationSlug === null) return prev;
        return { ...prev, currentViewedDestinationSlug: null };
      });
    }
  }, [pathname]);

  // Centralized fetcher
  const fetchAlerts = useCallback(async () => {
    setIsLoading(true);
    try {
      // Primary route via proxy, with direct backend fallback
      let res = await fetch('/api/v1/safety/alerts', {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
      });

      if (!res.ok) {
        // Fallback to direct backend if proxy is not configured
        res = await fetch('http://localhost:5000/api/v1/safety/alerts', {
          headers: { Accept: 'application/json' },
          cache: 'no-store',
        });
      }

      if (res.ok) {
        const data = await res.json();
        if (data && data.success && Array.isArray(data.data?.alerts)) {
          setActiveAlerts(data.data.alerts);
          setLastUpdated(data.data.last_fetched_at || new Date().toISOString());
        }
      }
    } catch (err) {
      console.warn('[Dishaara Travel Alerts] Fetch error, using cached state:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Polling setup with tab visibility awareness
  useEffect(() => {
    fetchAlerts();

    const interval = setInterval(() => {
      // Only poll if tab is active to save resources
      if (typeof document !== 'undefined' && !document.hidden) {
        fetchAlerts();
      }
    }, POLLING_INTERVAL_MS);

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchAlerts();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchAlerts]);

  // Dismissal check: an alert is dismissed if stored record matches its updatedAt and severity hasn't escalated
  const isAlertDismissed = useCallback(
    (alert: TravelAlert): boolean => {
      const record = dismissedMap[alert.alert_id];
      if (!record) return false;

      // If alert was updated since dismissal, surface it again
      if (new Date(alert.updated_at).getTime() > new Date(record.updatedAt).getTime()) {
        return false;
      }

      // If severity escalated (e.g. WARNING -> CRITICAL), surface it again
      const severityWeights: Record<string, number> = { INFO: 1, ADVISORY: 2, WARNING: 3, CRITICAL: 4 };
      if ((severityWeights[alert.severity] || 0) > (severityWeights[record.severity] || 0)) {
        return false;
      }

      return true;
    },
    [dismissedMap]
  );

  const dismissAlert = useCallback((alertId: string) => {
    const alert = activeAlerts.find((a) => a.alert_id === alertId);
    if (!alert) return;

    setDismissedMap((prev) => {
      const updated: Record<string, DismissalRecord> = {
        ...prev,
        [alertId]: {
          dismissedAt: new Date().toISOString(),
          updatedAt: alert.updated_at,
          severity: alert.severity,
        },
      };
      try {
        localStorage.setItem(DISMISSED_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore storage write error
      }
      return updated;
    });
  }, [activeAlerts]);

  const updateTravelContext = useCallback((partial: Partial<UserTravelContext>) => {
    setUserContext((prev) => ({
      ...prev,
      ...partial,
      activeItinerary: partial.activeItinerary !== undefined ? partial.activeItinerary : prev.activeItinerary,
    }));
  }, []);

  const openAlertDetails = useCallback((alert: TravelAlert) => {
    setSelectedAlertForDetails(alert);
  }, []);

  const closeAlertDetails = useCallback(() => {
    setSelectedAlertForDetails(null);
  }, []);

  // Deterministically compute relevant alerts based on user context
  const rankedRelevantAlerts = React.useMemo(() => {
    return filterAndRankRelevantAlerts(activeAlerts, userContext);
  }, [activeAlerts, userContext]);

  // Current primary floating alert (highest priority non-dismissed alert)
  const currentItem = React.useMemo(() => {
    for (const item of rankedRelevantAlerts) {
      if (!isAlertDismissed(item.alert)) {
        return item;
      }
    }
    return null;
  }, [rankedRelevantAlerts, isAlertDismissed]);

  const value: TravelAlertContextType = {
    activeAlerts,
    relevantAlerts: rankedRelevantAlerts,
    currentAlert: currentItem ? currentItem.alert : null,
    currentEvaluation: currentItem ? currentItem.evaluation : null,
    totalRelevantCount: rankedRelevantAlerts.length,
    lastUpdated,
    isLoading,
    userContext,
    updateTravelContext,
    dismissAlert,
    isAlertDismissed,
    selectedAlertForDetails,
    openAlertDetails,
    closeAlertDetails,
    refreshAlerts: fetchAlerts,
  };

  return (
    <TravelAlertContext.Provider value={value}>
      {children}
    </TravelAlertContext.Provider>
  );
}

export function useTravelAlert() {
  const context = useContext(TravelAlertContext);
  if (!context) {
    throw new Error('useTravelAlert must be used within a TravelAlertProvider');
  }
  return context;
}

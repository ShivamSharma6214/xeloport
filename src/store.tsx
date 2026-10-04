import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import {
  buildRollDecision,
  decisions as staticDecisions,
  handled as baseHandled,
  rollHandled,
  type Decision,
  type EventId,
  type HandledItem,
} from '@/data/mockData';

export type Channel = 'dashboard' | 'whatsapp';

interface Store {
  /** decisionId -> chosen optionId. Lives in memory only; refresh resets the demo. */
  decided: Record<string, string>;
  /** decisionId -> where the founder answered from. */
  channel: Record<string, Channel>;
  decide: (decisionId: string, optionId: string, via?: Channel) => void;
  undo: (decisionId: string) => void;
  events: EventId[];
  fireEvent: (id: EventId) => void;
  reset: () => void;
  demoOpen: boolean;
  setDemoOpen: (open: boolean) => void;
  navOpen: boolean;
  setNavOpen: (open: boolean) => void;
}

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [decided, setDecided] = useState<Record<string, string>>({});
  const [channel, setChannel] = useState<Record<string, Channel>>({});
  const [events, setEvents] = useState<EventId[]>([]);
  const [demoOpen, setDemoOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  const decide = useCallback((decisionId: string, optionId: string, via: Channel = 'dashboard') => {
    setDecided((d) => ({ ...d, [decisionId]: optionId }));
    setChannel((c) => ({ ...c, [decisionId]: via }));
  }, []);

  const undo = useCallback((decisionId: string) => {
    setDecided((d) => {
      const next = { ...d };
      delete next[decisionId];
      return next;
    });
    setChannel((c) => {
      const next = { ...c };
      delete next[decisionId];
      return next;
    });
  }, []);

  const fireEvent = useCallback((id: EventId) => setEvents((e) => (e.includes(id) ? e : [...e, id])), []);

  const reset = useCallback(() => {
    setDecided({});
    setChannel({});
    setEvents([]);
  }, []);

  const value: Store = {
    decided,
    channel,
    decide,
    undo,
    events,
    fireEvent,
    reset,
    demoOpen,
    setDemoOpen,
    navOpen,
    setNavOpen,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}

/** Units the founder added for Cyber Week, or 0 if they skipped or have not decided. */
function cyberUnits(decided: Record<string, string>): number {
  const c = decided['uae-cyberweek'];
  if (c === 'add-800') return 800;
  if (c === 'add-1400') return 1_400;
  return 0;
}

/**
 * All decisions that exist right now: the two static ones plus any created by an event.
 * The sailing roll only becomes a decision if the founder had extra stock on that sailing.
 */
export function useDecisions() {
  const { decided, events } = useStore();
  return useMemo(() => {
    const all: Decision[] = [...staticDecisions];
    const units = cyberUnits(decided);
    if (events.includes('uae-roll') && units > 0) all.push(buildRollDecision(units));
    return {
      all,
      get: (id: string) => all.find((d) => d.id === id),
    };
  }, [decided, events]);
}

/** Outcome of the roll event for the current state, or null if it has not fired. */
export function useRollOutcome(): null | 'absorbed' | 'decision' {
  const { decided, events } = useStore();
  if (!events.includes('uae-roll')) return null;
  return cyberUnits(decided) > 0 ? 'decision' : 'absorbed';
}

export function useHandled(): HandledItem[] {
  const { decided } = useStore();
  const outcome = useRollOutcome();
  if (!outcome) return baseHandled;
  return [...rollHandled(outcome, cyberUnits(decided)), ...baseHandled];
}

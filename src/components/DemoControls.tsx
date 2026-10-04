import { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, FlaskConical, Loader2, RotateCcw, Ship, X } from 'lucide-react';
import { useRouter } from '@/router';
import { useRollOutcome, useStore } from '@/store';
import { ROLLED_SAIL, rollSteps } from '@/data/mockData';
import { fmt } from '@/lib/dates';

const STEP_MS = 750;

/**
 * Demo-only controls. Not part of the product: they let a reviewer trigger a real-world change
 * and watch the system absorb it.
 */
export function DemoControls() {
  const { navigate } = useRouter();
  const { demoOpen, setDemoOpen, decided, fireEvent, reset } = useStore();
  const outcome = useRollOutcome();
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(0);

  const cyberDecided = Boolean(decided['uae-cyberweek']);

  useEffect(() => {
    if (!running) return;
    if (step >= rollSteps.length) {
      fireEvent('uae-roll');
      setRunning(false);
      return;
    }
    const t = setTimeout(() => setStep((s) => s + 1), STEP_MS);
    return () => clearTimeout(t);
  }, [running, step, fireEvent]);

  useEffect(() => {
    if (!demoOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setDemoOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [demoOpen, setDemoOpen]);

  const start = () => {
    setStep(0);
    setRunning(true);
  };

  const go = (to: string) => {
    navigate(to);
    setDemoOpen(false);
  };

  const showSteps = running || outcome !== null;
  const visibleSteps = outcome ? rollSteps.length : step;

  return (
    <>
      {!demoOpen && (
        <button
          onClick={() => setDemoOpen(true)}
          className="fixed bottom-4 right-4 z-30 inline-flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-ink-900 text-white text-sm font-medium shadow-card-hover hover:bg-ink-800"
        >
          <FlaskConical className="w-4 h-4" />
          Demo controls
          {!outcome && cyberDecided && <span className="w-2 h-2 rounded-full bg-amber-400" />}
        </button>
      )}

      {demoOpen && (
        <div className="fixed z-40 inset-x-0 bottom-0 sm:inset-x-auto sm:bottom-4 sm:right-4 sm:w-[400px] animate-slide-down">
          <div className="bg-white border border-ink-200 rounded-t-2xl sm:rounded-2xl shadow-card-hover max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3 px-5 pt-4 pb-3 border-b border-ink-100">
              <div>
                <p className="text-sm font-semibold text-ink-900 flex items-center gap-2">
                  <FlaskConical className="w-4 h-4" /> Demo controls
                </p>
                <p className="text-xs text-ink-500 mt-0.5">Not part of the product. Trigger a real-world change and watch the system absorb it.</p>
              </div>
              <button
                onClick={() => setDemoOpen(false)}
                className="p-1.5 -mr-1.5 rounded-lg text-ink-500 hover:text-ink-800 hover:bg-ink-50"
                aria-label="Close demo controls"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-5 py-4 space-y-3">
              <div className="rounded-xl border border-ink-200 p-4">
                <div className="flex items-start gap-3">
                  <Ship className="w-5 h-5 text-ink-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink-900">The carrier rolls the Oct 9 UAE sailing</p>
                    <p className="text-xs text-ink-500 mt-0.5">
                      It happens all the time in sea freight. The container moves to the next sailing, {fmt(ROLLED_SAIL)}.
                    </p>
                  </div>
                </div>

                {!showSteps && cyberDecided && (
                  <button
                    onClick={start}
                    className="mt-3 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg bg-ink-900 text-white hover:bg-ink-800"
                  >
                    Run it <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                {!showSteps && !cyberDecided && (
                  <div className="mt-3 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2.5">
                    <p className="text-xs text-amber-900">
                      First decide the UAE Cyber Week stock, either way. The system reacts differently depending on what you
                      chose.
                    </p>
                    <button
                      onClick={() => go('/decision/uae-cyberweek')}
                      className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-amber-900 underline underline-offset-2"
                    >
                      Decide it now <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {showSteps && (
                  <div className="mt-3 space-y-2">
                    {rollSteps.map((s, i) => {
                      const done = i < visibleSteps;
                      const active = running && i === step;
                      if (!done && !active) return null;
                      return (
                        <div key={s} className="flex items-start gap-2 text-xs animate-fade-in">
                          {done ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-px" />
                          ) : (
                            <Loader2 className="w-3.5 h-3.5 text-ink-400 flex-shrink-0 mt-px animate-spin" />
                          )}
                          <span className={done ? 'text-ink-700' : 'text-ink-500'}>{s}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {outcome === 'decision' && (
                  <div className="mt-3 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2.5 animate-fade-in">
                    <p className="text-xs text-amber-900">
                      <span className="font-semibold">1 new decision for Anika.</span> It spends money, so only she can make it.
                      Everything else was handled without her.
                    </p>
                    <button
                      onClick={() => go('/decision/uae-roll')}
                      className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-amber-900 underline underline-offset-2"
                    >
                      Open it <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {outcome === 'absorbed' && (
                  <div className="mt-3 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2.5 animate-fade-in">
                    <p className="text-xs text-emerald-900">
                      <span className="font-semibold">Absorbed. Nothing reached Anika.</span> She had no extra stock on that
                      sailing, so it is one line in &ldquo;Handled by Xeliport&rdquo;.
                    </p>
                    <button
                      onClick={() => go('/')}
                      className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-emerald-900 underline underline-offset-2"
                    >
                      See Home <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => go('/ops')}
                  className="flex-1 px-3 py-2 text-xs font-medium text-ink-700 border border-ink-200 rounded-lg hover:bg-ink-50"
                >
                  See it from Xeliport&apos;s side
                </button>
                <button
                  onClick={() => {
                    reset();
                    setStep(0);
                    setRunning(false);
                    go('/');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-ink-700 border border-ink-200 rounded-lg hover:bg-ink-50"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset demo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

import { useEffect, useState } from 'react';
import { CheckCheck } from 'lucide-react';
import { useStore } from '@/store';
import { accountManager, brand, type Decision } from '@/data/mockData';
import { fmtDay } from '@/lib/dates';
import { inr } from '@/lib/format';

/**
 * The first reminder in the escalation ladder, as the founder would get it on WhatsApp.
 * Replying with a number records the decision, the same as confirming in the dashboard.
 */
export function WhatsAppNudge({ decision }: { decision: Decision }) {
  const { decide } = useStore();
  const [reply, setReply] = useState<number | null>(null);
  const [acked, setAcked] = useState(false);

  const firstName = brand.founder.split(' ')[0];
  const amFirst = accountManager.name.split(' ')[0];
  const recIndex = decision.options.findIndex((o) => o.id === decision.recommendedId);
  const sentOn = decision.escalation[0]?.date ?? decision.dueDate;

  useEffect(() => {
    if (reply === null) return;
    const t1 = setTimeout(() => setAcked(true), 700);
    const t2 = setTimeout(() => decide(decision.id, decision.options[reply].id, 'whatsapp'), 2200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [reply, decide, decision]);

  const chosen = reply !== null ? decision.options[reply] : undefined;

  return (
    <div className="w-full max-w-sm rounded-2xl overflow-hidden border border-ink-200 shadow-card bg-[#efeae2]">
      <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-[#075e54] text-white">
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-semibold">X</div>
        <div className="min-w-0">
          <p className="text-sm font-semibold leading-tight">Xeliport · {amFirst}</p>
          <p className="text-[11px] text-white/70 leading-tight">Business account</p>
        </div>
      </div>

      <div className="px-3 py-3 space-y-2">
        <p className="text-center">
          <span className="inline-block px-2 py-0.5 rounded-md bg-white/80 text-[10px] text-ink-500">{fmtDay(sentOn)}</span>
        </p>

        <div className="max-w-[90%] rounded-lg rounded-tl-none bg-white px-3 py-2 shadow-sm">
          <p className="text-[13px] text-ink-900 leading-snug">
            Hi {firstName}, {amFirst} from Xeliport. <span className="font-semibold">{decision.title}.</span> We need
            your call by {fmtDay(decision.dueDate)}.
          </p>
          <div className="mt-2 space-y-1">
            {decision.options.map((o, i) => (
              <p key={o.id} className="text-[13px] text-ink-900 leading-snug">
                <span className="font-semibold">{i + 1}</span> · {o.short} · {o.cashInr === 0 ? '₹0' : inr(o.cashInr)}
                {i === recIndex && <span className="text-[#075e54] font-medium"> (we recommend)</span>}
              </p>
            ))}
          </div>
          <p className="text-[13px] text-ink-700 leading-snug mt-2">
            Reply 1, 2 or 3. Full details are on your dashboard.
          </p>
          <p className="text-right text-[10px] text-ink-400 mt-1">10:00</p>
        </div>

        {reply !== null && (
          <div className="flex justify-end animate-fade-in">
            <div className="rounded-lg rounded-tr-none bg-[#d9fdd3] px-3 py-1.5 shadow-sm">
              <p className="text-[13px] text-ink-900">{reply + 1}</p>
              <p className="flex items-center justify-end gap-1 text-[10px] text-ink-400">
                10:02 <CheckCheck className="w-3 h-3 text-sky-500" />
              </p>
            </div>
          </div>
        )}

        {acked && chosen && (
          <div className="max-w-[90%] rounded-lg rounded-tl-none bg-white px-3 py-2 shadow-sm animate-fade-in">
            <p className="text-[13px] text-ink-900 leading-snug">
              Done: <span className="font-semibold">{chosen.short}</span>. Xeliport takes it from here. Your dashboard is
              updated.
            </p>
            <p className="text-right text-[10px] text-ink-400 mt-1">10:02</p>
          </div>
        )}
      </div>

      <div className="px-3 pb-3">
        {reply === null ? (
          <div className="grid grid-cols-3 gap-2">
            {decision.options.map((o, i) => (
              <button
                key={o.id}
                onClick={() => setReply(i)}
                className="py-2.5 rounded-full bg-white text-sm font-semibold text-[#075e54] shadow-sm hover:bg-ink-50"
                aria-label={`Reply ${i + 1}: ${o.short}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-center text-[11px] text-ink-500">Recording your decision…</p>
        )}
      </div>
    </div>
  );
}

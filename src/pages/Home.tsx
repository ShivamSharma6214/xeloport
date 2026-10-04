import { useState } from 'react';
import { ArrowRight, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { useRouter } from '@/router';
import { useDecisions, useHandled, useStore } from '@/store';
import {
  LAYER_NAMES,
  UK_LAUNCH_TARGET,
  brand,
  corridors,
  getCorridor,
  getOption,
  settlement,
  uaeStats,
} from '@/data/mockData';
import { TODAY, diffDays, fmt, fmtDay, inDays } from '@/lib/dates';
import { inr, inrShort, pct } from '@/lib/format';
import { Card, Chip, OwnerTag, SectionHeader, layerIcons } from '@/components/ui';

type Tone = 'green' | 'amber';

function QuestionCard({
  question,
  answer,
  detail,
  tone,
}: {
  question: string;
  answer: string;
  detail: string;
  tone: Tone;
}) {
  return (
    <Card className="p-4">
      <p className="text-xs font-medium text-ink-500">{question}</p>
      <div className="flex items-start gap-2 mt-2">
        <span
          className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${tone === 'green' ? 'bg-emerald-500' : 'bg-amber-500'}`}
        />
        <p className="text-sm font-semibold text-ink-900 leading-snug">{answer}</p>
      </div>
      <p className="text-xs text-ink-500 mt-1.5 ml-4">{detail}</p>
    </Card>
  );
}

export function Home() {
  const { navigate } = useRouter();
  const { decided, channel } = useStore();
  const { all: decisions, get } = useDecisions();
  const handled = useHandled();
  const [showAll, setShowAll] = useState(false);

  const pending = decisions.filter((d) => !decided[d.id]);
  const done = decisions.filter((d) => decided[d.id]);

  const uk = getCorridor('uk')!;
  const ukDecision = get('uk-claims')!;
  const uaeDecision = get('uae-cyberweek')!;
  const rollDecision = get('uae-roll');
  const rollChoice = rollDecision && decided[rollDecision.id] ? getOption(rollDecision, decided[rollDecision.id]) : undefined;
  const ukChoice = decided[ukDecision.id] ? getOption(ukDecision, decided[ukDecision.id]) : undefined;
  const uaeChoice = decided[uaeDecision.id] ? getOption(uaeDecision, decided[uaeDecision.id]) : undefined;

  // Question 1: am I on track to launch?
  let q1: { answer: string; tone: Tone };
  if (!ukChoice) {
    q1 = {
      answer: `UK launch ${fmt(UK_LAUNCH_TARGET)}: on track if you decide by ${fmtDay(ukDecision.dueDate)}`,
      tone: 'amber',
    };
  } else {
    const delta = ukChoice.goLive ? diffDays(UK_LAUNCH_TARGET, ukChoice.goLive) : 0;
    q1 =
      delta === 0
        ? { answer: `UK launch on track for ${fmt(UK_LAUNCH_TARGET)}`, tone: 'green' }
        : { answer: `UK launch moves to ${fmt(ukChoice.goLive!)} (+${delta} days)`, tone: 'amber' };
  }
  const ukDay = diffDays(uk.startDate, TODAY) + 1;

  const visibleHandled = showAll ? handled : handled.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-xs text-ink-500 font-medium">
          {brand.name} · {fmtDay(TODAY)}
        </p>
        <h2 className="text-xl sm:text-2xl font-bold text-ink-900 tracking-tight mt-1">
          {pending.length > 0
            ? `${pending.length} ${pending.length === 1 ? 'decision needs' : 'decisions need'} you. Xeliport is handling the rest.`
            : 'Nothing needs you today.'}
        </h2>
        <p className="text-sm text-ink-500 mt-1">
          {pending.length > 0
            ? `${handled.length} other items were handled this week.`
            : `Xeliport handled ${handled.length} items this week. You'll hear from us only if something changes.`}
        </p>
      </div>

      {/* Three questions a founder actually asks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <QuestionCard
          question="Am I on track to launch?"
          answer={q1.answer}
          detail={`UK · Day ${ukDay} of 90`}
          tone={q1.tone}
        />
        <QuestionCard
          question="Is my stock ready to sell?"
          answer={`UAE: ${uaeStats.onHand.toLocaleString('en-IN')} units, ${uaeStats.coverDays} days of cover`}
          detail={
            rollDecision && !rollChoice
              ? `Cyber Week stock now lands late: decide by ${fmtDay(rollDecision.dueDate)}`
              : rollChoice
                ? `Cyber Week delay: ${rollChoice.short}`
                : uaeChoice
                  ? `Cyber Week: ${uaeChoice.label}`
                  : `Cyber Week stock: decide by ${fmtDay(uaeDecision.dueDate)}`
          }
          tone={(rollDecision && !rollChoice) || !uaeChoice ? 'amber' : 'green'}
        />
        <QuestionCard
          question="Is my money coming home?"
          answer={`${inrShort(settlement.net)} lands in your bank ${fmtDay(settlement.payoutDate)}`}
          detail={`Weekly payout · settlement cost ${pct(settlement.settlementCostPct)}`}
          tone="green"
        />
      </div>

      {/* Needs you */}
      {pending.length > 0 && (
        <div>
          <SectionHeader title="Needs you" subtitle="Only the decisions that are yours to make. Xeliport has already done the groundwork." />
          <div className="space-y-3">
            {pending.map((d) => {
              const rec = getOption(d, d.recommendedId)!;
              const corridor = getCorridor(d.corridorId)!;
              return (
                <Card key={d.id} hover className="p-4 sm:p-5" onClick={() => navigate(`/decision/${d.id}`)}>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {d.id === 'uae-roll' && <Chip tone="red">New</Chip>}
                    <Chip tone="amber">
                      Decide by {fmtDay(d.dueDate)} · {inDays(d.dueDate)}
                    </Chip>
                    <Chip>{corridor.code}</Chip>
                    <OwnerTag owner="You" />
                  </div>
                  <p className="text-base font-semibold text-ink-900">{d.title}</p>
                  <p className="text-sm text-ink-600 mt-1">{d.whyItMatters}</p>

                  <div className="mt-3 pt-3 border-t border-ink-100">
                    <p className="text-xs font-medium text-ink-500 mb-1.5">Xeliport has already</p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                      {d.alreadyDone.map((a) => (
                        <li key={a} className="flex items-start gap-1.5 text-xs text-ink-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-px flex-shrink-0" />
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                    <p className="text-sm text-ink-600">
                      <span className="text-ink-500">Xeliport recommends: </span>
                      <span className="font-medium text-ink-900">{rec.label}</span>
                      <span className="text-ink-500"> · {rec.cashInr === 0 ? 'no extra cost' : inr(rec.cashInr)}</span>
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 flex-shrink-0">
                      Review options
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* You decided */}
      {done.length > 0 && (
        <div>
          <SectionHeader title="You decided" subtitle="Xeliport is carrying these out." />
          <div className="space-y-2">
            {done.map((d) => {
              const opt = getOption(d, decided[d.id])!;
              return (
                <Card key={d.id} hover className="px-5 py-3.5" onClick={() => navigate(`/decision/${d.id}`)}>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <p className="text-sm text-ink-800 flex-1 min-w-0">
                      <span className="font-medium">{d.shortTitle}:</span> {opt.label}
                    </p>
                    <span className="hidden sm:inline-flex">
                      <Chip>{channel[d.id] === 'whatsapp' ? 'Answered on WhatsApp' : 'Xeliport is handling'}</Chip>
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Calm state */}
      {pending.length === 0 && (
        <Card className="p-6 sm:p-8 text-center bg-emerald-50/40 border-emerald-200">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
          <p className="text-lg font-semibold text-ink-900 mt-3">All clear</p>
          <p className="text-sm text-ink-600 mt-1 max-w-md mx-auto">
            Xeliport is carrying out your {done.length} {done.length === 1 ? 'decision' : 'decisions'} and handling{' '}
            {handled.length} other items. We will contact you only if we need something from you.
          </p>
        </Card>
      )}

      {/* Markets */}
      <div>
        <SectionHeader title="Your markets" subtitle="Your 90-day path, per market." />
        <div className="space-y-3">
          {corridors.map((c) => {
            const day = diffDays(c.startDate, TODAY) + 1;
            const progress = Math.min(100, (day / 90) * 100);
            const current = c.stages.find((s) => s.state === 'attention' || s.state === 'current');
            const pend = decisions.filter((d) => d.corridorId === c.id && !decided[d.id]).length;
            return (
              <Card key={c.id} hover className="p-4 sm:p-5" onClick={() => navigate(`/market/${c.id}`)}>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="text-xs font-mono font-semibold text-ink-400">{c.code}</span>
                  <span className="text-sm font-semibold text-ink-900">{c.name}</span>
                  {c.kind === 'live' ? <Chip tone="green">Live</Chip> : <Chip tone="blue">Launching</Chip>}
                  {pend > 0 && <Chip tone="amber">{pend} needs you</Chip>}
                  <span className="flex-1" />
                  <span className="text-xs text-ink-500 w-full sm:w-auto">
                    {c.kind === 'live' ? `Live since ${fmt(c.goLiveDate)}` : `Goes live ${fmt(c.goLiveDate)}`}
                  </span>
                </div>
                {c.kind === 'launching' ? (
                  <>
                    <div className="h-1.5 rounded-full bg-ink-100 overflow-hidden">
                      <div className="h-full rounded-full bg-ink-900" style={{ width: `${progress}%` }} />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5 mt-2 text-xs text-ink-500">
                      <span>
                        Day {day} of 90{current ? ` · ${current.label}` : ''}
                      </span>
                      <span>{current?.detail}</span>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-ink-600">
                    {uaeStats.unitsLast7Days} units sold in the last 7 days · {inrShort(settlement.gross)} collected
                  </p>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {/* Handled by Xeliport */}
      <div>
        <SectionHeader
          title="Handled by Xeliport this week"
          subtitle="Work you didn't have to do or check."
          right={<Chip tone="green">{handled.length} items</Chip>}
        />
        <Card className="divide-y divide-ink-100">
          {visibleHandled.map((h, i) => {
            const Icon = layerIcons[h.layer];
            return (
              <div key={i} className="flex items-start sm:items-center gap-3 px-4 sm:px-5 py-3">
                <Icon className="w-4 h-4 text-ink-400 flex-shrink-0 mt-0.5 sm:mt-0" />
                <p className="text-sm text-ink-800 flex-1">{h.text}</p>
                <span className="text-xs text-ink-400 hidden lg:inline">{LAYER_NAMES[h.layer]}</span>
                <span className="text-xs text-ink-500 w-12 text-right">{fmt(h.date)}</span>
              </div>
            );
          })}
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full flex items-center justify-center gap-1.5 px-5 py-3 text-sm font-medium text-ink-600 hover:bg-ink-50 transition-colors rounded-b-xl"
          >
            {showAll ? (
              <>
                Show fewer <ChevronUp className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                Show all {handled.length} <ChevronDown className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </Card>
      </div>
    </div>
  );
}

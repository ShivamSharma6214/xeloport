import { useState } from 'react';
import { AlertCircle, ArrowRight, CheckCircle2, ChevronDown, ChevronUp, Circle, CircleDot } from 'lucide-react';
import { useRouter } from '@/router';
import { useDecisions, useRollOutcome, useStore } from '@/store';
import {
  LAYER_NAMES,
  ROLLED_SAIL,
  getCorridor,
  getOption,
  settlement,
  uaeStats,
  type Layer,
  type LayerItem,
  type Stage,
} from '@/data/mockData';
import { TODAY, diffDays, fmt, fmtDay, fmtLong } from '@/lib/dates';
import { inr, pct } from '@/lib/format';
import { Breadcrumbs, Card, Chip, ItemIcon, SectionHeader, layerIcons } from '@/components/ui';

function StageIcon({ state }: { state: Stage['state'] }) {
  const cls = 'w-5 h-5';
  if (state === 'done') return <CheckCircle2 className={`${cls} text-emerald-600`} />;
  if (state === 'attention') return <AlertCircle className={`${cls} text-amber-600`} />;
  if (state === 'current') return <CircleDot className={`${cls} text-ink-900`} />;
  return <Circle className={`${cls} text-ink-300`} />;
}

export function Market({ corridorId }: { corridorId: string }) {
  const { navigate } = useRouter();
  const { decided } = useStore();
  const { all: decisions, get } = useDecisions();
  const rollOutcome = useRollOutcome();
  const corridor = getCorridor(corridorId);
  const [open, setOpen] = useState<Record<string, boolean>>({});

  if (!corridor) {
    return (
      <div className="space-y-6">
        <Breadcrumbs items={[{ label: 'Home', onClick: () => navigate('/') }, { label: 'Not found' }]} />
        <p className="text-sm text-ink-500">Market not found.</p>
      </div>
    );
  }

  const day = diffDays(corridor.startDate, TODAY) + 1;
  const pending = decisions.filter((d) => d.corridorId === corridor.id && !decided[d.id]);

  const stageState = (s: Stage): Stage['state'] =>
    s.state === 'attention' && pending.length === 0 ? 'current' : s.state;

  const itemView = (item: LayerItem): LayerItem => {
    if (item.decisionId && decided[item.decisionId]) {
      const d = get(item.decisionId)!;
      const opt = getOption(d, decided[item.decisionId])!;
      return { ...item, state: 'working', note: `You chose: ${opt.label}` };
    }
    return item;
  };

  // The sailing roll adds a line to the UAE shipping layer, and possibly a follow-up decision.
  const itemsFor = (layer: Layer): LayerItem[] => {
    if (corridor.id !== 'uae' || layer.id !== 'shipping' || !rollOutcome) return layer.items;
    const extra: LayerItem =
      rollOutcome === 'decision'
        ? { label: `Cyber Week stock rebooked on the ${fmt(ROLLED_SAIL)} sailing after a carrier roll`, state: 'needs-you', note: 'Lands after Cyber Week starts · choose how to recover', decisionId: 'uae-roll' }
        : { label: `Carrier rolled the Oct 9 sailing to ${fmt(ROLLED_SAIL)}`, state: 'done', note: 'No extra stock on it · nothing changes for you' };
    return [...layer.items, extra];
  };

  const summaryFor = (layer: Layer) => {
    if (corridor.id === 'uae' && layer.id === 'shipping' && rollOutcome === 'decision' && !decided['uae-roll'])
      return 'Carrier rolled your Cyber Week sailing · 1 decision';
    return layer.dependsOn && decided[layer.dependsOn] && layer.summaryDone ? layer.summaryDone : layer.summary;
  };

  const layerNeedsYou = (layer: Layer) => itemsFor(layer).some((i) => itemView(i).state === 'needs-you');

  const isOpen = (layer: Layer) => open[layer.id] ?? layerNeedsYou(layer);

  return (
    <div className="space-y-8">
      <Breadcrumbs items={[{ label: 'Home', onClick: () => navigate('/') }, { label: corridor.name }]} />

      {/* Header */}
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-mono font-semibold text-ink-400">{corridor.code}</span>
          <h2 className="text-xl sm:text-2xl font-bold text-ink-900 tracking-tight">{corridor.name}</h2>
          {corridor.kind === 'live' ? <Chip tone="green">Live</Chip> : <Chip tone="blue">Launching</Chip>}
        </div>
        <p className="text-sm text-ink-500 mt-1">
          {corridor.kind === 'live'
            ? `Live since ${fmtLong(corridor.goLiveDate)}. ${corridor.blurb}`
            : `Day ${day} of 90 · goes live ${fmtLong(corridor.goLiveDate)}. ${corridor.blurb}`}
        </p>
      </div>

      {/* What needs you */}
      {pending.length > 0 ? (
        <div className="space-y-2">
          {pending.map((d) => (
            <Card
              key={d.id}
              hover
              className="p-4 border-amber-200 bg-amber-50/50"
              onClick={() => navigate(`/decision/${d.id}`)}
            >
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <div className="flex-1 min-w-[70%]">
                  <p className="text-sm font-semibold text-ink-900">{d.title}</p>
                  <p className="text-xs text-ink-600 mt-0.5">Decide by {fmtDay(d.dueDate)}. Everything else in this market is handled.</p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600">
                  Review options <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-4 bg-emerald-50/40 border-emerald-200">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <p className="text-sm text-ink-800">Nothing needs you in {corridor.name}. Xeliport is handling everything here.</p>
          </div>
        </Card>
      )}

      {/* Launch track */}
      <div>
        <SectionHeader title={corridor.kind === 'live' ? 'How you got here' : 'Your 90-day path'} />
        <Card className="p-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {corridor.stages.map((s, i) => {
              const st = stageState(s);
              return (
                <div key={s.label} className="relative">
                  {i < corridor.stages.length - 1 && (
                    <div className={`hidden md:block absolute top-2.5 left-7 right-[-16px] h-px ${st === 'done' ? 'bg-emerald-200' : 'bg-ink-200'}`} />
                  )}
                  <div className="relative bg-white w-fit pr-2">
                    <StageIcon state={st} />
                  </div>
                  <p className={`text-sm font-medium mt-2 ${st === 'attention' ? 'text-amber-800' : 'text-ink-900'}`}>{s.label}</p>
                  <p className="text-xs text-ink-500 mt-0.5">{s.detail}</p>
                  <p className="text-xs text-ink-400 mt-1">{fmt(s.date)}</p>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* UAE: live numbers and money */}
      {corridor.kind === 'live' && (
        <div>
          <SectionHeader title="Sales, stock and money" subtitle="Every payout is itemised, so nothing is hidden in a bundled fee." />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
            <Card className="p-4">
              <p className="text-xs text-ink-500 font-medium">Sold, last 7 days</p>
              <p className="text-xl font-bold text-ink-900 mt-1">{uaeStats.unitsLast7Days} units</p>
            </Card>
            <Card className="p-4">
              <p className="text-xs text-ink-500 font-medium">In the Dubai warehouse</p>
              <p className="text-xl font-bold text-ink-900 mt-1">{uaeStats.onHand.toLocaleString('en-IN')} units</p>
              <p className="text-xs text-ink-500 mt-0.5">{uaeStats.coverDays} days of cover</p>
            </Card>
            <Card className="p-4">
              <p className="text-xs text-ink-500 font-medium">Last payout</p>
              <p className="text-xl font-bold text-ink-900 mt-1">{inr(settlement.lastPayoutInr)}</p>
              <p className="text-xs text-ink-500 mt-0.5">{fmtDay(settlement.lastPayoutDate)}</p>
            </Card>
          </div>
          <Card className="p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <p className="text-sm font-semibold text-ink-900">Next payout: {fmtDay(settlement.payoutDate)}</p>
              <Chip>{settlement.periodLabel}</Chip>
            </div>
            <table className="w-full text-sm">
              <tbody>
                <tr>
                  <td className="py-1.5 text-ink-600">Collected from customers</td>
                  <td className="py-1.5 text-right text-ink-900 font-medium">{inr(settlement.gross)}</td>
                </tr>
                {settlement.lines.map((l) => (
                  <tr key={l.label}>
                    <td className="py-1.5 text-ink-600">{l.label}</td>
                    <td className="py-1.5 text-right text-ink-700">−{inr(l.amount)}</td>
                  </tr>
                ))}
                <tr className="border-t border-ink-200">
                  <td className="pt-2.5 text-ink-900 font-semibold">Lands in your bank</td>
                  <td className="pt-2.5 text-right text-ink-900 font-semibold">{inr(settlement.net)}</td>
                </tr>
              </tbody>
            </table>
            <p className="text-xs text-ink-500 mt-3">
              Settlement cost (gateway, FX and transfer): {pct(settlement.settlementCostPct)} of sales. UAE VAT is handled
              under Xeliport&apos;s registration and is not part of your payout.
            </p>
          </Card>
        </div>
      )}

      {/* Six layers */}
      <div>
        <SectionHeader
          title="What Xeliport is running"
          subtitle="All six layers are handled by Xeliport. Open one to see the detail."
        />
        <Card className="divide-y divide-ink-100">
          {corridor.layers.map((layer) => {
            const Icon = layerIcons[layer.id];
            const needs = layerNeedsYou(layer);
            const expanded = isOpen(layer);
            return (
              <div key={layer.id}>
                <button
                  onClick={() => setOpen({ ...open, [layer.id]: !expanded })}
                  className="w-full flex items-start md:items-center gap-3 px-4 sm:px-5 py-3.5 text-left hover:bg-ink-50 transition-colors"
                >
                  <Icon className="w-4 h-4 text-ink-500 flex-shrink-0 mt-0.5 md:mt-0" />
                  <span className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center gap-0.5 md:gap-3">
                    <span className="text-sm font-medium text-ink-900 md:w-56 md:flex-shrink-0">{LAYER_NAMES[layer.id]}</span>
                    <span className="text-sm text-ink-500 flex-1">{summaryFor(layer)}</span>
                  </span>
                  {needs ? <Chip tone="amber">Needs you</Chip> : <span className="hidden sm:inline-flex"><Chip>Xeliport is handling</Chip></span>}
                  {expanded ? (
                    <ChevronUp className="w-4 h-4 text-ink-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-ink-400" />
                  )}
                </button>
                {expanded && (
                  <div className="px-4 sm:px-5 pb-4 pl-11 sm:pl-12 space-y-2.5 animate-slide-down">
                    {itemsFor(layer).map((raw) => {
                      const item = itemView(raw);
                      return (
                        <div key={item.label} className="flex flex-wrap sm:flex-nowrap items-start gap-2.5">
                          <span className="mt-0.5">
                            <ItemIcon state={item.state} />
                          </span>
                          <div className="flex-1 min-w-[75%]">
                            <p className="text-sm text-ink-800">{item.label}</p>
                            {item.note && <p className="text-xs text-ink-500 mt-0.5">{item.note}</p>}
                          </div>
                          {item.state === 'needs-you' && item.decisionId && (
                            <button
                              onClick={() => navigate(`/decision/${item.decisionId}`)}
                              className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700"
                            >
                              Review options <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </Card>
      </div>
    </div>
  );
}

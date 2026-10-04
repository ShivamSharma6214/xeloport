import { ArrowRight, Bot, Building2, CheckCircle2, Circle, Handshake, MessageCircle, User } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useRouter } from '@/router';
import { useDecisions, useHandled, useRollOutcome, useStore } from '@/store';
import {
  HOLDER_NAMES,
  accountManager,
  brand,
  getCorridor,
  getOption,
  opsTasks,
  type Decision,
  type Holder,
  type OpsTask,
} from '@/data/mockData';
import { TODAY, fmt } from '@/lib/dates';
import { Card, Chip, SectionHeader } from '@/components/ui';

const holderIcon: Record<Holder, LucideIcon> = { system: Bot, team: Building2, partner: Handshake };

interface Row extends OpsTask {
  fromDecision?: string;
}

function LedgerTile({
  icon: Icon,
  title,
  big,
  label,
  sub,
  tone = 'neutral',
}: {
  icon: LucideIcon;
  title: string;
  big: number;
  label: string;
  sub: string;
  tone?: 'neutral' | 'amber';
}) {
  return (
    <Card className={`p-4 ${tone === 'amber' ? 'border-amber-200 bg-amber-50/40' : ''}`}>
      <div className="flex items-center gap-2 text-xs font-medium text-ink-500">
        <Icon className="w-3.5 h-3.5" /> {title}
      </div>
      <p className="text-2xl font-bold text-ink-900 mt-2">{big}</p>
      <p className="text-xs text-ink-600">{label}</p>
      <p className="text-xs text-ink-400 mt-1">{sub}</p>
    </Card>
  );
}

function FounderTrack({ decision }: { decision: Decision }) {
  const { navigate } = useRouter();
  const { decided, channel } = useStore();
  const chosenId = decided[decision.id];
  const chosen = chosenId ? getOption(decision, chosenId) : undefined;
  const corridor = getCorridor(decision.corridorId)!;

  const steps: { label: string; date?: string; state: 'done' | 'next' | 'later' | 'skipped' }[] = [
    { label: 'Flagged by the system', date: decision.flaggedOn, state: 'done' },
    { label: 'Options priced, one recommended', date: decision.flaggedOn, state: 'done' },
    { label: 'On her Home screen', date: decision.flaggedOn, state: 'done' },
    ...decision.escalation.map((e, i) => ({
      label: i === 0 ? 'WhatsApp reminder' : i === 1 ? `${accountManager.name.split(' ')[0]} calls her` : 'Safe default, no spend',
      date: e.date,
      state: (chosen
        ? i === 0 && channel[decision.id] === 'whatsapp'
          ? 'done'
          : 'skipped'
        : i === 0
          ? 'next'
          : 'later') as 'done' | 'skipped' | 'next' | 'later',
    })),
  ];

  return (
    <Card hover className="p-4 sm:p-5" onClick={() => navigate(`/decision/${decision.id}`)}>
      <div className="flex flex-wrap items-center gap-2">
        <Chip>{corridor.code}</Chip>
        <p className="text-sm font-semibold text-ink-900 flex-1 min-w-0">{decision.title}</p>
        {chosen ? (
          <Chip tone="green">
            {channel[decision.id] === 'whatsapp' ? (
              <>
                <MessageCircle className="w-3 h-3" /> Answered on WhatsApp
              </>
            ) : (
              'Answered in the dashboard'
            )}
          </Chip>
        ) : (
          <Chip tone="amber">Waiting on {brand.founder.split(' ')[0]} · due {fmt(decision.dueDate)}</Chip>
        )}
      </div>
      {chosen && <p className="text-xs text-ink-600 mt-1.5">She chose: {chosen.label}</p>}
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        {steps.map((s) => (
          <span
            key={s.label}
            className={`inline-flex items-center gap-1.5 text-xs ${
              s.state === 'done'
                ? 'text-ink-700'
                : s.state === 'next'
                  ? 'text-amber-800 font-medium'
                  : s.state === 'skipped'
                    ? 'text-ink-300 line-through'
                    : 'text-ink-400'
            }`}
          >
            {s.state === 'done' ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Circle className={`w-3.5 h-3.5 ${s.state === 'next' ? 'text-amber-500' : 'text-ink-300'}`} />
            )}
            {s.label}
            {s.date && s.state !== 'done' && <span className="text-ink-400 font-normal">{fmt(s.date)}</span>}
          </span>
        ))}
      </div>
    </Card>
  );
}

export function Ops() {
  const { decided } = useStore();
  const { all: decisions } = useDecisions();
  const handled = useHandled();
  const rollOutcome = useRollOutcome();
  const founder = brand.founder.split(' ')[0];

  // Open work: standing tasks (minus ones a decision has replaced) plus work spawned by her decisions.
  const rows: Row[] = opsTasks.filter((t) => !(t.waitsOn && decided[t.waitsOn]));
  if (rollOutcome === 'decision' && !decided['uae-roll']) {
    rows.push({
      holder: 'team',
      owner: accountManager.name,
      text: `Make sure ${founder} has seen the Cyber Week delay decision`,
      date: '2026-10-10',
      waitsOn: 'uae-roll',
    });
  }
  for (const d of decisions) {
    const opt = decided[d.id] ? getOption(d, decided[d.id]) : undefined;
    if (!opt) continue;
    for (const s of opt.nextSteps) {
      if (s.who !== 'Xeliport' || s.date < TODAY) continue;
      rows.push({
        holder: s.holder ?? 'team',
        owner: s.owner ?? accountManager.name,
        text: s.text,
        date: s.date,
        fromDecision: d.shortTitle,
      });
    }
  }

  const holders: Holder[] = ['system', 'team', 'partner'];
  const openBy = (h: Holder) => rows.filter((r) => r.holder === h).sort((a, b) => a.date.localeCompare(b.date));
  const handledBy = (h: Holder) => handled.filter((x) => x.by === h).length;
  const answered = decisions.filter((d) => decided[d.id]).length;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs text-ink-500 font-medium">
          Xeliport team view · {brand.name} account · {accountManager.name}, account manager
        </p>
        <h2 className="text-xl sm:text-2xl font-bold text-ink-900 tracking-tight mt-1">Where the complexity went</h2>
        <p className="text-sm text-ink-600 mt-1 max-w-3xl">
          {founder} sees {decisions.length} {decisions.length === 1 ? 'decision' : 'decisions'}. This is everything else on her
          account, and who is carrying it. Complexity doesn&apos;t disappear; this screen shows where it moved.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <LedgerTile
          icon={Bot}
          title={HOLDER_NAMES.system}
          big={handledBy('system')}
          label="handled this week"
          sub={`${openBy('system').length} running now`}
        />
        <LedgerTile
          icon={Building2}
          title={HOLDER_NAMES.team}
          big={handledBy('team')}
          label="handled this week"
          sub={`${openBy('team').length} open now`}
        />
        <LedgerTile
          icon={Handshake}
          title={HOLDER_NAMES.partner}
          big={handledBy('partner')}
          label="handled this week"
          sub={`${openBy('partner').length} open now`}
        />
        <LedgerTile
          icon={User}
          title={`${founder} (founder)`}
          big={decisions.length}
          label={decisions.length === 1 ? 'decision asked of her' : 'decisions asked of her'}
          sub={`${answered} answered · ${handled.length} items handled without her`}
          tone="amber"
        />
      </div>

      <div>
        <SectionHeader
          title={`What we asked ${founder}`}
          subtitle="Only decisions that are legally hers, risk her stock, or spend her money. Each one has a reminder ladder, so none can stall silently."
        />
        <div className="space-y-3">
          {decisions.map((d) => (
            <FounderTrack key={d.id} decision={d} />
          ))}
        </div>
      </div>

      <div>
        <SectionHeader title="Open work on this account" subtitle="Who holds each piece. None of this appears on the founder's screen." />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {holders.map((h) => {
            const Icon = holderIcon[h];
            const list = openBy(h);
            return (
              <Card key={h} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-ink-900 inline-flex items-center gap-2">
                    <Icon className="w-4 h-4 text-ink-500" /> {HOLDER_NAMES[h]}
                  </p>
                  <Chip>{list.length}</Chip>
                </div>
                <div className="space-y-3">
                  {list.map((r, i) => (
                    <div key={i} className="border-t border-ink-100 pt-3 first:border-0 first:pt-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm text-ink-800">{r.text}</p>
                        <span className="text-xs text-ink-500 flex-shrink-0">{fmt(r.date)}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                        <span className="text-[11px] text-ink-500">{r.owner}</span>
                        {r.waitsOn && !decided[r.waitsOn] && <Chip tone="amber">Waiting on {founder}</Chip>}
                        {r.fromDecision && (
                          <Chip tone="blue">
                            <ArrowRight className="w-3 h-3" /> From her decision
                          </Chip>
                        )}
                        {r.internal && <Chip>She never sees this</Chip>}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

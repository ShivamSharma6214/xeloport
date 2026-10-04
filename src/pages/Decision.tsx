import { useState } from 'react';
import { AlertCircle, ArrowRight, CheckCircle2, ChevronDown, ChevronUp, Circle, Lock, MessageCircle, Phone, ShieldCheck, Undo2 } from 'lucide-react';
import { useRouter } from '@/router';
import { useDecisions, useRollOutcome, useStore } from '@/store';
import { ROLLED_SAIL, accountManager, getCorridor, getOption, type Decision, type Option } from '@/data/mockData';
import { TODAY, fmt, fmtDay, inDays } from '@/lib/dates';
import { inr } from '@/lib/format';
import { Breadcrumbs, Card, CertaintyTag, Chip, OwnerTag, PrimaryButton, SecondaryButton, SectionHeader } from '@/components/ui';
import { WhatsAppNudge } from '@/components/WhatsAppNudge';

function Cost({ option }: { option: Option }) {
  return (
    <div className="sm:text-right flex-shrink-0 pl-7 sm:pl-0">
      <p className="text-base font-semibold text-ink-900">{option.cashInr === 0 ? '₹0' : inr(option.cashInr)}</p>
      <p className="text-[11px] text-ink-500 sm:max-w-[200px]">{option.cashNote}</p>
      {option.atStake && (
        <p className="text-[11px] text-amber-700 mt-1 sm:max-w-[200px]">
          + {inr(option.atStake.inr)} · {option.atStake.label}
        </p>
      )}
    </div>
  );
}

function OptionCard({
  option,
  recommended,
  selected,
  onSelect,
}: {
  option: Option;
  recommended: boolean;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <Card
      hover
      onClick={onSelect}
      className={`p-4 sm:p-5 ${selected ? 'border-ink-900 ring-1 ring-ink-900' : ''}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
        <span
          className={`mt-1 w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
            selected ? 'border-ink-900' : 'border-ink-300'
          }`}
        >
          {selected && <span className="w-2 h-2 rounded-full bg-ink-900" />}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-ink-900">{option.label}</p>
            {recommended && <Chip tone="blue">Xeliport recommends</Chip>}
          </div>
          <p className="text-sm text-ink-600 mt-1">{option.summary}</p>
          <div className="mt-3 space-y-1">
            <p className="text-xs text-ink-700">
              <span className="text-ink-500">Result: </span>
              {option.outcome}
            </p>
            <p className="text-xs text-ink-700">
              <span className="text-ink-500">Trade-off: </span>
              {option.tradeoff}
            </p>
          </div>
        </div>
        </div>
        <Cost option={option} />
      </div>
    </Card>
  );
}

function WhyPanel({ decision }: { decision: Decision }) {
  const { why } = decision;
  return (
    <Card className="p-5 space-y-6 animate-slide-down">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-ink-500">
        <span className="flex items-center gap-1.5">
          <CertaintyTag certainty="checked" /> a fixed rule or a booked fact
        </span>
        <span className="flex items-center gap-1.5">
          <CertaintyTag certainty="estimate" /> an assumption, shown as a range
        </span>
      </div>

      <div>
        <p className="text-sm font-semibold text-ink-900 mb-3">{why.scheduleTitle}</p>
        <div className="space-y-0">
          {[...why.schedule].reverse().map((row, i, arr) => (
            <div key={row.label} className="flex items-stretch gap-3">
              <div className="flex flex-col items-center">
                <span className={`mt-1.5 w-2.5 h-2.5 rounded-full ${i === 0 ? 'bg-ink-900 ring-4 ring-ink-100' : 'bg-ink-300'}`} />
                {i < arr.length - 1 && <span className="w-px flex-1 bg-ink-200 my-1" />}
              </div>
              <div className="pb-4 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="text-sm font-medium text-ink-900">{fmtDay(row.date)}</span>
                  <span className="text-sm text-ink-700">{row.label}</span>
                  <OwnerTag owner={row.owner} />
                </div>
                {row.note && <p className="text-xs text-ink-500 mt-0.5">{row.note}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-ink-900 mb-2">{why.costTitle}</p>
        <table className="w-full text-sm">
          <tbody>
            {why.costLines.map((l) => (
              <tr key={l.label} className="border-b border-ink-100 last:border-0">
                <td className="py-1.5 text-ink-600">{l.label}</td>
                <td className="py-1.5 text-right text-ink-900 font-medium">{l.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <p className="text-sm font-semibold text-ink-900 mb-2">Assumptions</p>
        <ul className="space-y-1">
          {why.assumptions.map((a) => (
            <li key={a} className="text-xs text-ink-600 flex gap-2">
              <span className="text-ink-300">•</span>
              {a}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-lg bg-ink-50 border border-ink-200 p-3">
        <p className="text-xs text-ink-600">
          <span className="font-medium text-ink-800">How this works in the real product: </span>
          fixed rules check labels and documents, dates are worked back from booked freight and warehouse slots, and
          costs come from quoted rate cards. No model predicts approval. Where the future is uncertain, the
          screen shows an assumption and a range, never a made-up percentage. This prototype uses mock data.
        </p>
      </div>
    </Card>
  );
}

export function DecisionPage({ decisionId }: { decisionId: string }) {
  const { navigate } = useRouter();
  const { decided, decide, undo, channel } = useStore();
  const { get } = useDecisions();
  const rollOutcome = useRollOutcome();
  const [selected, setSelected] = useState<string | null>(null);
  const [whyOpen, setWhyOpen] = useState(false);

  const decision = get(decisionId);
  if (!decision) {
    return (
      <div className="space-y-6">
        <Breadcrumbs items={[{ label: 'Home', onClick: () => navigate('/') }, { label: 'Not found' }]} />
        <p className="text-sm text-ink-500">Decision not found.</p>
      </div>
    );
  }

  const corridor = getCorridor(decision.corridorId)!;
  const chosenId = decided[decision.id];
  const chosen = chosenId ? getOption(decision, chosenId) : undefined;
  const selectedOption = selected ? getOption(decision, selected) : undefined;
  // Once the sailing has been rolled, the Cyber Week plan is superseded by the follow-up decision.
  const lockedByRoll = decision.id === 'uae-cyberweek' && rollOutcome !== null;
  const followUp = decision.id === 'uae-cyberweek' && rollOutcome === 'decision' ? get('uae-roll') : undefined;

  return (
    <div className="space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Home', onClick: () => navigate('/') },
          { label: corridor.name, onClick: () => navigate(`/market/${corridor.id}`) },
          { label: decision.shortTitle },
        ]}
      />

      {/* Header */}
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {chosen ? (
            <Chip tone="green">{channel[decision.id] === 'whatsapp' ? 'Decided on WhatsApp' : 'Decided'}</Chip>
          ) : (
            <Chip tone="amber">
              Decide by {fmtDay(decision.dueDate)} · {inDays(decision.dueDate)}
            </Chip>
          )}
          <Chip>{corridor.code}</Chip>
          {!chosen && <OwnerTag owner="You" />}
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-ink-900 tracking-tight">{decision.title}</h2>
        <p className="text-sm text-ink-600 mt-1.5 max-w-2xl">{decision.whyItMatters}</p>
      </div>

      {lockedByRoll && (
        <Card className={`p-4 ${followUp && !decided[followUp.id] ? 'border-amber-200 bg-amber-50/50' : 'border-ink-200'}`}>
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-ink-900">Update: the carrier rolled the Oct 9 sailing to {fmt(ROLLED_SAIL)}</p>
              <p className="text-xs text-ink-600 mt-0.5">
                {followUp
                  ? 'Xeliport rebooked your stock and re-ran this plan. The new dates miss the start of Cyber Week, so there is one follow-up decision.'
                  : 'You had no extra stock on that sailing, so nothing changes for you.'}
              </p>
              {followUp && (
                <button
                  onClick={() => navigate(`/decision/${followUp.id}`)}
                  className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700"
                >
                  {decided[followUp.id] ? 'See the follow-up decision' : 'Review the follow-up'} <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* What Xeliport found */}
      <div>
        <SectionHeader title="What Xeliport found" />
        <Card className="p-4 sm:p-5 space-y-5">
          <p className="text-sm text-ink-700 leading-relaxed">{decision.situation}</p>
          {decision.whatChanged && (
            <p className="text-sm text-ink-700 leading-relaxed">
              <span className="font-medium text-ink-900">What changed: </span>
              {decision.whatChanged}
            </p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {decision.facts.map((f) => (
              <div key={f.label} className="p-3 rounded-lg bg-ink-50 border border-ink-200">
                <p className="text-xs text-ink-500">{f.label}</p>
                <p className="text-sm font-semibold text-ink-900 mt-0.5">{f.value}</p>
                <div className="mt-1.5">
                  <CertaintyTag certainty={f.certainty} />
                </div>
              </div>
            ))}
          </div>

          {decision.checks && (
            <div>
              <p className="text-xs font-semibold text-ink-500 uppercase tracking-wide mb-2">Label check results</p>
              <div className="border border-ink-200 rounded-lg overflow-hidden">
                {decision.checks.map((c) => (
                  <div key={c.sku} className="flex items-start gap-3 px-4 py-3 border-b border-ink-100 last:border-0">
                    {c.result === 'pass' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-ink-900">
                        {c.sku} <span className="font-normal text-ink-600">{c.text}</span>
                      </p>
                      <p className="text-xs text-ink-500 mt-0.5">{c.rule}</p>
                    </div>
                    {c.result === 'fail' ? <Chip tone="red">Fails</Chip> : <Chip tone="green">Passes</Chip>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {decision.draftCopy && (
            <div>
              <p className="text-xs font-semibold text-ink-500 uppercase tracking-wide mb-2">Wording Xeliport drafted for you</p>
              <div className="space-y-2">
                {decision.draftCopy.map((d) => (
                  <div key={d.sku} className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3 text-sm">
                    <span className="md:w-44 font-medium text-ink-800">{d.sku}</span>
                    <span className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
                      <span className="text-ink-400 line-through">{d.from}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-ink-400 flex-shrink-0" />
                      <span className="text-ink-900">{d.to}</span>
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-ink-500 mt-2">
                Nothing is printed until Xeliport&apos;s UK compliance partner has reviewed the final wording.
              </p>
            </div>
          )}

          <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3">
            <p className="text-sm text-amber-900">
              <span className="font-medium">If nothing changes: </span>
              {decision.ifNothingChanges}
            </p>
          </div>
        </Card>
      </div>

      {/* Options or confirmation */}
      {!chosen ? (
        <div>
          <SectionHeader
            title="Your options"
            subtitle="Each one is already priced. Xeliport recommends one, and you decide."
          />
          <div className="space-y-3">
            {decision.options.map((o) => (
              <OptionCard
                key={o.id}
                option={o}
                recommended={o.id === decision.recommendedId}
                selected={selected === o.id}
                onSelect={() => setSelected(o.id)}
              />
            ))}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-4">
            <PrimaryButton
              disabled={!selectedOption}
              onClick={() => selectedOption && decide(decision.id, selectedOption.id)}
              icon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              {selectedOption ? 'Confirm and let Xeliport proceed' : 'Choose an option to continue'}
            </PrimaryButton>
            <button
              onClick={() => setWhyOpen(!whyOpen)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-600 hover:text-ink-900"
            >
              <ShieldCheck className="w-4 h-4" />
              How Xeliport worked this out
              {whyOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
          {decision.confirmNote && <p className="text-xs text-ink-500 mt-3 max-w-2xl">{decision.confirmNote}</p>}
          {whyOpen && (
            <div className="mt-4">
              <WhyPanel decision={decision} />
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <Card className="p-4 sm:p-6 border-emerald-200 bg-emerald-50/40">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
              <div>
                <p className="text-base font-semibold text-ink-900">Decision recorded</p>
                <p className="text-sm text-ink-700 mt-0.5">You chose: {chosen.label}</p>
                {channel[decision.id] === 'whatsapp' && (
                  <p className="text-xs text-emerald-800 mt-1 inline-flex items-center gap-1">
                    <MessageCircle className="w-3.5 h-3.5" /> Answered by WhatsApp reply. No dashboard visit needed.
                  </p>
                )}
                <p className="text-sm text-ink-600 mt-1">
                  Xeliport takes it from here. You will hear from us only if something changes.
                </p>
              </div>
            </div>
          </Card>

          <div>
            <SectionHeader title="What happens next" />
            <Card className="p-5">
              {chosen.nextSteps.map((s, i) => {
                const done = s.who === 'You' && s.date <= TODAY;
                return (
                <div key={i} className="flex items-stretch gap-3">
                  <div className="flex flex-col items-center">
                    <span className={`mt-1.5 w-2.5 h-2.5 rounded-full ${done ? 'bg-emerald-500' : s.who === 'You' ? 'bg-amber-500' : 'bg-ink-300'}`} />
                    {i < chosen.nextSteps.length - 1 && <span className="w-px flex-1 bg-ink-200 my-1" />}
                  </div>
                  <div className="pb-4 flex-1 flex flex-wrap sm:flex-nowrap items-center gap-x-2 gap-y-1">
                    <span className="text-sm font-medium text-ink-900 w-14 flex-shrink-0">{fmt(s.date)}</span>
                    <span className="text-sm text-ink-700 flex-1 min-w-[60%]">{s.text}</span>
                    {done ? <Chip tone="green">You did this</Chip> : <OwnerTag owner={s.who} />}
                  </div>
                </div>
                );
              })}
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <PrimaryButton onClick={() => navigate('/')} icon={<ArrowRight className="w-3.5 h-3.5" />}>
              Back to home
            </PrimaryButton>
            {lockedByRoll ? (
              <span className="inline-flex items-center gap-1.5 text-xs text-ink-500">
                <Lock className="w-3.5 h-3.5" /> Superseded by the sailing update
              </span>
            ) : (
              <SecondaryButton
                onClick={() => {
                  undo(decision.id);
                  setSelected(null);
                }}
                icon={<Undo2 className="w-3.5 h-3.5" />}
              >
                Change my decision
              </SecondaryButton>
            )}
            <button
              onClick={() => setWhyOpen(!whyOpen)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-600 hover:text-ink-900"
            >
              <ShieldCheck className="w-4 h-4" />
              How Xeliport worked this out
              {whyOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
          {whyOpen && <WhyPanel decision={decision} />}
        </div>
      )}

      {/* If you don't decide */}
      {!chosen && (
        <div>
          <SectionHeader title="If you don't decide" subtitle="No decision is never a silent failure." />
          <Card className="p-4 sm:p-5">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-ink-700">{decision.ifYouDontDecide}</p>
                <div className="mt-4 space-y-2.5">
                  {decision.escalation.map((e) => (
                    <div key={e.date} className="flex items-start gap-3 text-sm">
                      <Phone className="w-3.5 h-3.5 text-ink-300 mt-1 flex-shrink-0" />
                      <span className="w-14 font-medium text-ink-900 flex-shrink-0">{fmt(e.date)}</span>
                      <span className="text-ink-700">{e.text.replace('Meera Nair', accountManager.name)}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-ink-500 mt-5 leading-relaxed">
                  <span className="font-medium text-ink-700">The first reminder, as {accountManager.name.split(' ')[0]}&apos;s
                  WhatsApp. </span>
                  Founders live on WhatsApp, so the decision goes there too. Replying with a number decides it, exactly like
                  the button above. Try it.
                </p>
              </div>
              <div className="flex md:justify-end">
                <WhatsAppNudge decision={decision} />
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

import type { ReactNode } from 'react';
import { ArrowRight, Bot, Building2, Compass, User } from 'lucide-react';
import { useRouter } from '@/router';
import { useStore } from '@/store';

/* A single, self-contained write-up of the proposal, so a reviewer never has to piece it together from the demo. */

function Section({ id, n, title, children }: { id: string; n: number; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20">
      <p className="text-xs font-semibold text-ink-400 tracking-wide">{String(n).padStart(2, '0')}</p>
      <h2 className="text-lg sm:text-xl font-bold text-ink-900 tracking-tight mt-1">{title}</h2>
      <div className="mt-3 text-[15px] text-ink-700 leading-relaxed space-y-3">{children}</div>
    </section>
  );
}

function Bullets({ items }: { items: ReactNode[] }) {
  return (
    <ul className="space-y-2">
      {items.map((it, i) => (
        <li key={i} className="flex gap-2.5">
          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-ink-300 flex-shrink-0" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

function SeeIt({ to, label = 'See it in the prototype', before }: { to: string; label?: string; before?: () => void }) {
  const { navigate } = useRouter();
  return (
    <button
      onClick={() => {
        before?.();
        navigate(to);
      }}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700"
    >
      {label} <ArrowRight className="w-3.5 h-3.5" />
    </button>
  );
}

const changes: { title: string; what: string; why: string; to: string; demo?: boolean }[] = [
  {
    title: 'Home answers three questions, not six layers',
    what: 'The first screen answers what a founder actually asks: am I on track to launch, is my stock ready to sell, is my money coming home. Below that: only the decisions that need them, then everything Xeliport handled this week.',
    why: 'The six service layers are how Xeliport is organised. Founders think in outcomes. The layers are still there, one level down.',
    to: '/',
  },
  {
    title: 'Issues arrive as decisions, already worked out',
    what: 'Instead of a red status in a layer, the founder gets a decision: what happened, what Xeliport already did, three priced options, a recommendation, and a deadline worked back from a real date (a sailing, a launch, a sale).',
    why: 'Turning "label check failed" into "here are your options and what each costs" is the expensive part. The system and the team do it, not the founder.',
    to: '/decision/uk-claims',
  },
  {
    title: 'Show the working, and never fake certainty',
    what: 'Every number is tagged Checked (a fixed rule or a booked fact) or Estimate (an assumption, with the assumption written down). "How Xeliport worked this out" shows the dates, the costs and the assumptions behind the recommendation.',
    why: 'Founders are being asked to spend money on our recommendation. Trust comes from showing the maths, not from a confidence score.',
    to: '/decision/uk-claims',
  },
  {
    title: 'No decision fails silently, and nothing spends their money by default',
    what: 'Each decision has a ladder: WhatsApp reminder, then a call from the account manager, then a safe default. The default never spends money. It ships what is already fine and holds the rest.',
    why: 'Pushing work onto the system only works if the system is safe when the founder is busy.',
    to: '/decision/uae-cyberweek',
  },
  {
    title: 'Decide from WhatsApp',
    what: 'The reminder is a WhatsApp message with numbered, priced options. Replying "1" records the decision exactly like the dashboard does.',
    why: 'Indian D2C founders run their business on WhatsApp. The best dashboard is often the one you do not have to open.',
    to: '/decision/uk-claims',
  },
  {
    title: 'When the world changes, the system re-plans',
    what: 'In the demo, the carrier rolls a sailing. The system rebooks, works the dates again and checks them against Cyber Week. If the founder had stock on that sailing, they get one priced decision. If not, it never reaches them: it is one line in "Handled".',
    why: 'This is Tesler’s Law in motion: the same event costs the founder one decision or nothing, depending on whether it is actually theirs.',
    to: '/decision/uae-cyberweek',
    demo: true,
  },
  {
    title: 'The stack, one level down',
    what: 'Each market page shows the 90-day path, then all six layers with their status. For a live market it also itemises the payout, so every fee is visible.',
    why: 'Hiding the stack would remove control. Moving it one level down keeps it a click away for founders who want detail.',
    to: '/market/uk',
  },
  {
    title: 'A team view that shows where the complexity went',
    what: 'The same account from Xeliport’s side: what the system, the team and partners are carrying, what is waiting on the founder, and which reminder fires next.',
    why: 'Complexity is conserved. If the founder sees less, someone else holds more. This screen makes that load visible so it can be staffed and automated.',
    to: '/ops',
  },
];

export function Proposal() {
  const { navigate } = useRouter();
  const { setDemoOpen } = useStore();

  return (
    <div className="min-h-full bg-white">
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-ink-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-ink-900 flex items-center justify-center flex-shrink-0">
              <Compass className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-ink-900 truncate">Dashboard redesign · proposal</span>
          </div>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-ink-900 text-white hover:bg-ink-800 flex-shrink-0"
          >
            Open the prototype <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-12">
        {/* Title */}
        <div>
          <p className="text-sm text-ink-500">Satyam Sharma · Product assignment for Xeliport · October 2026</p>
          <h1 className="text-2xl sm:text-4xl font-bold text-ink-900 tracking-tight mt-2 leading-tight">
            Redesigning the brand dashboard so Xeliport carries the complexity, not the founder
          </h1>
          <div className="mt-6 rounded-xl border border-ink-200 bg-ink-50 p-5">
            <p className="text-xs font-semibold text-ink-500 uppercase tracking-wide">In one minute</p>
            <p className="mt-2 text-[15px] text-ink-800 leading-relaxed">
              Xeliport promises founders &ldquo;You sell. We handle everything else.&rdquo; A dashboard organised around
              the six service layers still hands the founder the work of turning statuses into decisions. I propose
              flipping it: the system and the team detect, check, schedule and price; the founder only makes the calls
              that are truly theirs (their claims, their stock risk, their money), each one arriving ready to decide, on
              the dashboard or on WhatsApp. The prototype shows this on a fictional brand with Xeliport&apos;s real
              markets and 90-day path.
            </p>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
              <SeeIt to="/" label="Open the prototype" />
              <button
                onClick={() => document.getElementById('tour')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-600 hover:text-ink-900"
              >
                Take the 2-minute tour <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <p className="mt-4 text-sm text-ink-500 leading-relaxed">
            <span className="font-medium text-ink-700">A note on polish: </span>
            I spent my time on the product thinking: who carries which work, how decisions are framed, and the logic and
            numbers behind every screen. The visual design is intentionally plain. With proper time on the front end, the
            look and feel would go a lot further than what you see here.
          </p>
        </div>

        <Section id="problem" n={1} title="The problem">
          <p>
            From Xeliport&apos;s site and pitch, the product is organised around six service layers: compliance, shipping
            and customs, 3PL, marketplace ops, retail and B2B, and forex and banking. That is the right way to run the
            operation. It is the wrong way to show it to a founder.
          </p>
          <p>
            When something goes wrong in a layer, a stack-shaped dashboard shows a status. The founder then has to work
            out what it means for their launch, what the options are, what each costs and by when they must choose. That
            translation is the hardest part of the job, and it is exactly what Xeliport is paid to take away.
          </p>
        </Section>

        <Section id="principle" n={2} title="The principle: Tesler’s Law">
          <p>
            Every process has a certain amount of complexity that cannot be removed, only moved. A simpler-looking screen
            that leaves the same thinking with the user just hides the complexity. The real design question is{' '}
            <span className="font-semibold text-ink-900">who carries each piece</span>, and the answer should be whoever can
            carry it most cheaply and safely.
          </p>
        </Section>

        <Section id="who" n={3} title="Where each piece of complexity goes">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl border border-ink-200 p-4">
              <p className="text-sm font-semibold text-ink-900 inline-flex items-center gap-2">
                <Bot className="w-4 h-4 text-ink-500" /> The system
              </p>
              <ul className="mt-2 space-y-1.5 text-sm text-ink-700">
                <li>Re-checks every label when a rule moves</li>
                <li>Watches sailings, slots and payouts</li>
                <li>Works dates back from launch and sale dates</li>
                <li>Prices each way out from rate cards</li>
                <li>Drafts the fix</li>
              </ul>
            </div>
            <div className="rounded-xl border border-ink-200 p-4">
              <p className="text-sm font-semibold text-ink-900 inline-flex items-center gap-2">
                <Building2 className="w-4 h-4 text-ink-500" /> Xeliport team and partners
              </p>
              <ul className="mt-2 space-y-1.5 text-sm text-ink-700">
                <li>File, clear customs, run the warehouse</li>
                <li>Review wording with compliance partners</li>
                <li>Rebook freight when plans change</li>
                <li>Settle money to the brand every week</li>
                <li>Call the founder if a deadline is close</li>
              </ul>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
              <p className="text-sm font-semibold text-ink-900 inline-flex items-center gap-2">
                <User className="w-4 h-4 text-amber-700" /> The founder
              </p>
              <ul className="mt-2 space-y-1.5 text-sm text-ink-700">
                <li>Claim wording (legally theirs)</li>
                <li>How much stock to put at risk</li>
                <li>Which sale to aim for</li>
                <li>Anything that spends their money</li>
              </ul>
            </div>
          </div>
          <p>
            The founder&apos;s column is deliberately not empty. Hiding these calls would take control away from them, so
            the product makes them quick to decide instead.
          </p>
        </Section>

        <Section id="changes" n={4} title="What I’m proposing">
          <div className="space-y-4">
            {changes.map((c, i) => (
              <div key={c.title} className="rounded-xl border border-ink-200 p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-ink-900 text-white text-xs font-semibold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-semibold text-ink-900">{c.title}</p>
                    <p className="text-sm text-ink-700 mt-1.5 leading-relaxed">{c.what}</p>
                    <p className="text-sm text-ink-500 mt-1.5 leading-relaxed">
                      <span className="font-medium text-ink-600">Why: </span>
                      {c.why}
                    </p>
                    <div className="mt-2.5">
                      {c.demo ? (
                        <SeeIt to="/decision/uae-cyberweek" label="Try it: decide Cyber Week stock, then open Demo controls" />
                      ) : (
                        <SeeIt to={c.to} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section id="before-after" n={5} title="The same job, before and after">
          <p>Example: two UK product labels use wording that could be read as a medicinal claim, a week before the sailing.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-xl border border-ink-200 p-4">
              <p className="text-xs font-semibold text-ink-500 uppercase tracking-wide">Before · about 8 steps</p>
              <ol className="mt-2 space-y-1 text-sm text-ink-700 list-decimal list-inside">
                <li>Open the compliance layer</li>
                <li>Find the label check</li>
                <li>Read which products failed</li>
                <li>Work out which rule applies</li>
                <li>Message the account manager</li>
                <li>Work back the sailing date</li>
                <li>Ask for cost quotes</li>
                <li>Decide</li>
              </ol>
            </div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4">
              <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wide">After · 3 steps, or 1 reply</p>
              <ol className="mt-2 space-y-1 text-sm text-ink-700 list-decimal list-inside">
                <li>See it on Home</li>
                <li>Compare three priced options</li>
                <li>Confirm, or reply &ldquo;1&rdquo; on WhatsApp</li>
              </ol>
            </div>
          </div>
          <p className="text-sm text-ink-500">Step counts are my estimate, not measured.</p>
        </Section>

        <Section id="not" n={6} title="What I deliberately did not do">
          <Bullets
            items={[
              <>
                <span className="font-medium text-ink-900">No AI chatbot.</span> A chat box puts the founder back in
                charge of asking the right questions, which is exactly the work this redesign takes off them. AI is more
                useful behind the screen (next section).
              </>,
              <>
                <span className="font-medium text-ink-900">No approval-probability scores.</span> Where the future is
                uncertain, the screen states the assumption instead of inventing a percentage.
              </>,
              <>
                <span className="font-medium text-ink-900">No hiding the stack.</span> All six layers are still one click
                away.
              </>,
              <>
                <span className="font-medium text-ink-900">No auto-spending.</span> Defaults only ever hold or ship what is
                already fine.
              </>,
            ]}
          />
        </Section>

        <Section id="ai" n={7} title="Where AI fits, and where it doesn’t">
          <p>
            I work as an AI product manager, and a big part of that job is deciding when a product should not use AI. The
            core of this redesign doesn&apos;t need it. Label checks are rules. Deadlines come from real bookings. Prices come
            from rate cards. Founders approve spend based on these numbers, so they have to be exact and explainable every
            time, and plain rules do that better than a model.
          </p>
          <p>
            If Xeliport wants AI in the product, these are the places where I think it would do far more than a chatbot.
            Each one works behind the screen, and none of them shows the founder an unchecked answer.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              [
                'Reading what partners send',
                'Carrier notices, customs queries and 3PL emails arrive as PDFs and free text. AI can turn them into structured events the moment they land, like the sailing roll in this demo, so nobody has to re-type them.',
              ],
              [
                'Drafting compliant wording',
                'When a claim fails, suggest replacement label and listing copy. The rule checks and the compliance partner still approve it before the founder sees it.',
              ],
              [
                'Sharper demand ranges',
                'Replace the fixed Cyber Week uplift with a forecast learned from similar brands and categories, shown as a range, so stock decisions get better over time.',
              ],
              [
                'Localising the catalogue',
                'Arabic listings for the UAE, UK English product copy and first-pass HS code suggestions, all reviewed by the customs broker or the team.',
              ],
              [
                'Understanding WhatsApp replies',
                'Founders won’t always reply with “1”. AI can match “go with the sticker one” to the right option and confirm it back before anything happens.',
              ],
              [
                'Briefing the account manager',
                'A short weekly summary of each brand for the account manager before their call, built from everything in the team view.',
              ],
            ].map(([t, d]) => (
              <div key={t} className="rounded-xl border border-ink-200 p-4">
                <p className="text-sm font-semibold text-ink-900">{t}</p>
                <p className="text-sm text-ink-600 mt-1 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
          <p>
            The rule I&apos;d hold to:{' '}
            <span className="font-semibold text-ink-900">
              AI reads and drafts, rules and people check, and the founder only ever sees a decision that has been checked.
            </span>
          </p>
        </Section>

        <Section id="build" n={8} title="What it takes to build, and in what order">
          <p>Most of the work is behind the screen. That is the point.</p>
          <div className="rounded-xl border border-ink-200 overflow-hidden text-sm">
            {[
              ['Phase 1 · weeks 1–4', 'Home and the decision format for the two most common issue types. Account managers fill in options and prices by hand. The goal is to prove founders decide faster.'],
              ['Phase 2 · weeks 5–10', 'A date engine fed by freight and 3PL bookings, so deadlines are worked out automatically. Rate cards price options. Rule checks for labels and documents.'],
              ['Phase 3 · weeks 11–16', 'WhatsApp decisions through the WhatsApp Business API, the escalation ladder, and the team view for account managers.'],
            ].map(([phase, text]) => (
              <div key={phase} className="grid grid-cols-1 sm:grid-cols-[170px_1fr] gap-1 sm:gap-4 px-4 py-3 border-b border-ink-100 last:border-0">
                <p className="font-semibold text-ink-900">{phase}</p>
                <p className="text-ink-700">{text}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-ink-500">Timings are a rough plan to discuss with engineering, not an estimate.</p>
        </Section>

        <Section id="measure" n={9} title="How I’d know it worked">
          <Bullets
            items={[
              'Share of issues resolved with zero founder involvement (should go up)',
              'Median time from flag to founder decision (should go down)',
              'Share of brands live on day 90 (should go up)',
              '"Where is my stock or my money?" messages per brand per month (should go down)',
              'Share of decisions answered on WhatsApp, and how often founders override the recommendation (a trust check)',
            ]}
          />
        </Section>

        <Section id="risks" n={10} title="Risks, and how I’d test them first">
          <Bullets
            items={[
              <>
                <span className="font-medium text-ink-900">Founders may not trust the recommendation.</span> Run Phase 1 with
                5 pilot brands and track how often they pick it and why not.
              </>,
              <>
                <span className="font-medium text-ink-900">Partner data may be late or messy.</span> Start with the dates we
                already book ourselves (sailings, 3PL slots) before relying on partner feeds.
              </>,
              <>
                <span className="font-medium text-ink-900">Account managers carry more.</span> The team view exists to make
                that load visible, so it can be automated first where it is heaviest.
              </>,
            ]}
          />
        </Section>

        <Section id="tour" n={11} title="Try it in two minutes">
          <ol className="space-y-3">
            {[
              { t: 'Home: two decisions need Anika. Everything else was handled this week.', to: '/' },
              { t: 'Open the UK label decision. See what was found, the three priced options and “How Xeliport worked this out”.', to: '/decision/uk-claims' },
              { t: 'Scroll to “If you don’t decide” and reply 1 on the WhatsApp message. The decision is recorded.', to: '/decision/uk-claims' },
              { t: 'Decide the UAE Cyber Week stock, then open Demo controls and roll the sailing. Watch the system re-plan.', to: '/decision/uae-cyberweek', demo: true },
              { t: 'Switch to “Xeliport team” at the top to see who is carrying everything.', to: '/ops' },
            ].map((s, i) => (
              <li key={i} className="flex gap-3">
                <span className="w-6 h-6 rounded-full border border-ink-300 text-xs font-semibold text-ink-600 flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </span>
                <div>
                  <p>{s.t}</p>
                  <SeeIt to={s.to} label="Go" before={s.demo ? () => setDemoOpen(false) : undefined} />
                </div>
              </li>
            ))}
          </ol>
        </Section>

        <Section id="mocked" n={12} title="What is mocked">
          <p className="text-sm">
            The brand (Nilgiri Botanics), people, numbers, dates, rules, rates and transit times are all invented for the
            prototype. The markets (UAE live, UK launching, Singapore and US coming) and the 90-day path follow
            Xeliport&apos;s public pitch. &ldquo;Today&rdquo; is fixed at Oct 4, 2026 so every date on screen agrees.
            Refreshing the page resets the demo.
          </p>
        </Section>

        <div className="pt-4 border-t border-ink-200 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-ink-500">Satyam Sharma · October 2026</p>
          <SeeIt to="/" label="Open the prototype" />
        </div>
      </main>
    </div>
  );
}

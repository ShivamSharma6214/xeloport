import { TODAY, addDays, diffDays, fmt, fmtDay } from '@/lib/dates';

const TODAY_FOR_DATA = TODAY;
import { inrShort } from '@/lib/format';

/* ------------------------------------------------------------------ *
 *  Everything below is fictional demo data. "Nilgiri Botanics" is an
 *  invented Indian wellness & skincare brand. Rules, rates and
 *  transit times are illustrative assumptions, not real regulation.
 * ------------------------------------------------------------------ */

export const brand = {
  name: 'Nilgiri Botanics',
  category: 'Wellness & skincare',
  founder: 'Anika Rao',
  initials: 'AR',
  skus: 12,
};

export const accountManager = { name: 'Meera Nair' };

export type LayerId = 'compliance' | 'shipping' | '3pl' | 'marketplace' | 'retail' | 'forex';

export const LAYER_NAMES: Record<LayerId, string> = {
  compliance: 'Incorporation & Compliance',
  shipping: 'Shipping & Customs',
  '3pl': '3PL & Warehousing',
  marketplace: 'D2C & Marketplace Ops',
  retail: 'Retail & B2B Distribution',
  forex: 'Forex & Banking',
};

export type StageState = 'done' | 'current' | 'attention' | 'upcoming';
export interface Stage {
  label: string;
  detail: string;
  state: StageState;
  date: string;
}

export type ItemState = 'done' | 'working' | 'needs-you' | 'upcoming' | 'later';
export interface LayerItem {
  label: string;
  state: ItemState;
  note?: string;
  decisionId?: string;
}
export interface Layer {
  id: LayerId;
  summary: string;
  /** Decision this layer's status depends on. Once decided, summaryDone replaces summary. */
  dependsOn?: string;
  summaryDone?: string;
  items: LayerItem[];
}

export interface Corridor {
  id: 'uk' | 'uae';
  name: string;
  code: string;
  kind: 'launching' | 'live';
  startDate: string;
  goLiveDate: string;
  blurb: string;
  stages: Stage[];
  layers: Layer[];
}

const UK_START = '2026-08-07';
const UAE_START = '2026-06-04';

const ukCorridor: Corridor = {
  id: 'uk',
  name: 'United Kingdom',
  code: 'UK',
  kind: 'launching',
  startDate: UK_START,
  goLiveDate: addDays(UK_START, 89),
  blurb: 'Launching under Xeliport’s vendor licence. No UK company needed.',
  stages: [
    { label: 'Brand onboarded', detail: 'Catalogue, volumes and corridor agreed', state: 'done', date: UK_START },
    { label: 'Compliance cleared', detail: 'VAT, EORI and origin proof in place', state: 'done', date: '2026-09-11' },
    { label: 'Warehouse live', detail: 'UK 3PL contracted · stock sails Oct 9', state: 'attention', date: '2026-10-09' },
    { label: 'Customers receive', detail: 'Day 90 · launch', state: 'upcoming', date: addDays(UK_START, 89) },
  ],
  layers: [
    {
      id: 'compliance',
      summary: '4 of 5 done · 1 needs your wording',
      dependsOn: 'uk-claims',
      summaryDone: 'Label wording decided · Xeliport is carrying it out',
      items: [
        { label: 'UK VAT and EORI in place (Xeliport’s setup)', state: 'done', note: 'Done Aug 21' },
        { label: 'Proof of origin route chosen for CETA preference', state: 'done', note: 'Done Sep 2' },
        { label: 'Packaging fee exposure modelled for all 12 SKUs', state: 'done', note: 'Re-checked Oct 2' },
        { label: 'HS codes consistent across invoice, origin proof and entry', state: 'done', note: 'Checked Sep 30' },
        { label: 'Label and claims check, 12 SKUs', state: 'needs-you', note: '10 pass · 2 need your wording', decisionId: 'uk-claims' },
      ],
    },
    {
      id: 'shipping',
      summary: 'Sailing booked · final paperwork waits on your decision',
      dependsOn: 'uk-claims',
      summaryDone: 'Sailing booked · final paperwork in progress',
      items: [
        { label: 'Importer of record set up', state: 'done', note: 'Done' },
        { label: 'Export set-up: IEC, AD Code at Mundra, LUT', state: 'done', note: 'Done' },
        { label: 'Sea freight Mundra → UK, loading cut-off Oct 9', state: 'done', note: 'Booked Oct 1' },
        { label: 'Commercial invoice and packing list', state: 'working', note: 'Drafted · finalised once labels are settled' },
        { label: 'UK customs entry with CETA preference claimed', state: 'upcoming', note: 'Filed on arrival' },
      ],
    },
    {
      id: '3pl',
      summary: 'All set',
      items: [
        { label: 'UK 3PL matched to your category and volume', state: 'done', note: 'Contracted Sep 18' },
        { label: 'Shopify integration live (orders, stock, tracking)', state: 'done', note: 'Live Sep 25' },
        { label: 'Inbound slot reserved Oct 30 – Nov 1', state: 'done', note: 'Reserved Sep 29' },
      ],
    },
    {
      id: 'marketplace',
      summary: '10 of 12 listings drafted',
      dependsOn: 'uk-claims',
      summaryDone: 'Last 2 listings follow once labels are fixed',
      items: [
        { label: 'GBP checkout on your Shopify store', state: 'done', note: 'Live Sep 28' },
        { label: 'Amazon UK seller account under Xeliport’s entity', state: 'done', note: 'Approved Sep 20' },
        { label: 'Listings drafted for 10 of 12 SKUs', state: 'working', note: '2 held until label wording is settled' },
      ],
    },
    {
      id: 'retail',
      summary: 'Phase 2 · not started',
      items: [{ label: 'UK retail and B2B conversations', state: 'later', note: 'Starts after launch' }],
    },
    {
      id: 'forex',
      summary: 'All set',
      items: [
        { label: 'GBP collection account', state: 'done', note: 'Opened Sep 11' },
        { label: 'Weekly GBP → INR settlement with FIRC paperwork', state: 'done', note: 'Ready' },
      ],
    },
  ],
};

const uaeCorridor: Corridor = {
  id: 'uae',
  name: 'United Arab Emirates',
  code: 'AE',
  kind: 'live',
  startDate: UAE_START,
  goLiveDate: addDays(UAE_START, 89),
  blurb: 'Live on Amazon.ae, noon and your own Shopify store.',
  stages: [
    { label: 'Brand onboarded', detail: 'Catalogue, volumes and corridor agreed', state: 'done', date: UAE_START },
    { label: 'Compliance cleared', detail: 'VAT, ECAS and Montaji registrations', state: 'done', date: '2026-07-24' },
    { label: 'Warehouse live', detail: 'Dubai 3PL stocked', state: 'done', date: '2026-08-14' },
    { label: 'Customers receive', detail: 'Live since launch', state: 'done', date: addDays(UAE_START, 89) },
  ],
  layers: [
    {
      id: 'compliance',
      summary: 'All current · nothing needed from you',
      items: [
        { label: 'UAE VAT handled under Xeliport’s registration', state: 'done', note: 'Ongoing' },
        { label: 'Cosmetics registration (ECAS + Montaji) for 8 hero SKUs', state: 'done', note: 'Valid to Sep 2027' },
        { label: 'E-invoicing deadline tracked (provider by Mar 31, 2027)', state: 'working', note: 'Watching · no action yet' },
      ],
    },
    {
      id: 'shipping',
      summary: 'Cyber Week stock needs your call',
      dependsOn: 'uae-cyberweek',
      summaryDone: 'Cyber Week stock decided · Xeliport is booking it',
      items: [
        { label: 'Regular replenishment, timed to land before stock runs out', state: 'working', note: 'Booked by Xeliport' },
        { label: 'Extra stock for Cyber Week (sailing loads Oct 9)', state: 'needs-you', note: 'Choose how much to add', decisionId: 'uae-cyberweek' },
      ],
    },
    {
      id: '3pl',
      summary: '1,840 units on hand · stock count 99.6% accurate',
      items: [
        { label: 'Dubai 3PL stock reconciled', state: 'done', note: 'Oct 1' },
        { label: 'Customer returns processed with refund on pickup', state: 'done', note: '6 this week' },
      ],
    },
    {
      id: 'marketplace',
      summary: 'Live on 3 channels',
      items: [
        { label: 'Amazon.ae and noon listings', state: 'done', note: 'Live' },
        { label: 'Prices keep 20% headroom for Cyber Week promotions', state: 'done', note: 'Checked Oct 3' },
      ],
    },
    {
      id: 'retail',
      summary: 'Phase 2 · not started',
      items: [{ label: 'UAE retail and distributor conversations', state: 'later', note: 'Starts when volumes justify' }],
    },
    {
      id: 'forex',
      summary: 'Weekly payout on schedule',
      items: [
        { label: 'Weekly AED → INR settlement', state: 'done', note: 'Last paid Oct 2' },
        { label: 'Export proceeds matched to shipping bills', state: 'done', note: '0 overdue entries' },
      ],
    },
  ],
};

export const corridors: Corridor[] = [ukCorridor, uaeCorridor];

export function getCorridor(id: string): Corridor | undefined {
  return corridors.find((c) => c.id === id);
}

export const comingSoon = [
  { name: 'Singapore', when: 'Q3 2026 waitlist' },
  { name: 'United States', when: 'Q4 2026 waitlist' },
];

/* ------------------------------ UAE numbers ------------------------------ */

export const uaeStats = {
  unitsLast7Days: 612,
  grossLast7Days: 502_000,
  onHand: 1_840,
  get perDay() {
    return this.unitsLast7Days / 7;
  },
  get coverDays() {
    return Math.floor(this.onHand / this.perDay);
  },
  get pricePerUnit() {
    return Math.round(this.grossLast7Days / this.unitsLast7Days);
  },
};

const GATEWAY_FEE = 13_550;
const FX_FEE = 4_520;

export const settlement = {
  periodLabel: 'Sales Sep 27 – Oct 3',
  payoutDate: '2026-10-09',
  lastPayoutDate: '2026-10-02',
  lastPayoutInr: 398_000,
  gross: 502_000,
  lines: [
    { label: 'Amazon.ae and noon fees', amount: 62_250 },
    { label: 'Payment gateway', amount: GATEWAY_FEE },
    { label: 'FX and transfer', amount: FX_FEE },
  ],
  get net() {
    return this.gross - this.lines.reduce((s, l) => s + l.amount, 0);
  },
  /** gateway + FX/transfer as a share of gross. Channel fees are a separate, expected cost. */
  get settlementCostPct() {
    return ((GATEWAY_FEE + FX_FEE) / this.gross) * 100;
  },
};

/* ------------------------- handled by Xeliport feed ------------------------- */

/** Who actually carries a piece of work. The redesign is about moving work from the founder to these three. */
export type Holder = 'system' | 'team' | 'partner';

export interface HandledItem {
  layer: LayerId;
  text: string;
  date: string;
  by: Holder;
}

export const handled: HandledItem[] = [
  { layer: 'compliance', text: 'Re-ran the UK label and claims check on all 12 SKUs', date: '2026-10-03', by: 'system' },
  { layer: 'compliance', text: 'Re-checked UK packaging fee exposure for 2026-27 rates', date: '2026-10-02', by: 'system' },
  { layer: 'compliance', text: 'Checked HS codes match across invoice, origin proof and entry (12 SKUs)', date: '2026-09-30', by: 'system' },
  { layer: 'compliance', text: 'Tracked UAE e-invoicing deadline (provider by Mar 31, 2027). Nothing needed yet', date: '2026-09-29', by: 'system' },
  { layer: 'shipping', text: 'Booked sea freight Mundra to UK with loading cut-off Oct 9', date: '2026-10-01', by: 'team' },
  { layer: 'shipping', text: 'Drafted commercial invoice and packing list for the UK shipment', date: '2026-10-02', by: 'team' },
  { layer: 'shipping', text: 'Booked the regular UAE replenishment to land before current stock runs out', date: '2026-10-02', by: 'team' },
  { layer: '3pl', text: 'Reserved the UK 3PL inbound slot for Oct 30 – Nov 1', date: '2026-09-29', by: 'team' },
  { layer: '3pl', text: 'Reconciled Dubai stock: 1,840 units, 99.6% accurate', date: '2026-10-01', by: 'partner' },
  { layer: '3pl', text: 'Processed 6 UAE customer returns, refunds triggered on pickup', date: '2026-10-02', by: 'partner' },
  { layer: 'marketplace', text: 'Drafted UK listings for 10 of 12 SKUs (2 held for label wording)', date: '2026-10-03', by: 'team' },
  { layer: 'marketplace', text: 'Checked UAE prices keep 20% headroom for Cyber Week promotions', date: '2026-10-03', by: 'system' },
  { layer: 'forex', text: 'Settled last week’s UAE sales: ₹3,98,000 to your bank, FIRC issued', date: '2026-10-02', by: 'partner' },
  { layer: 'forex', text: 'Matched 9 export shipping bills to receipts. 0 overdue', date: '2026-09-30', by: 'system' },
];

/* ------------------------------- decisions ------------------------------- */

export type Certainty = 'checked' | 'estimate';

export interface Fact {
  label: string;
  value: string;
  certainty: Certainty;
}

export interface Check {
  sku: string;
  text: string;
  rule: string;
  result: 'pass' | 'fail';
}

export interface NextStep {
  who: 'You' | 'Xeliport';
  text: string;
  date: string;
  /** For Xeliport steps: who inside Xeliport carries it (shown in the team view). Defaults to the team. */
  holder?: Holder;
  /** Named owner shown in the team view, e.g. 'UK compliance partner'. */
  owner?: string;
}

export interface Option {
  id: string;
  label: string;
  /** Short form used in the WhatsApp nudge. */
  short: string;
  summary: string;
  cashInr: number;
  cashNote: string;
  /** a second, non-cash cost, e.g. sales pushed back or sales at stake */
  atStake?: { label: string; inr: number };
  outcome: string;
  tradeoff: string;
  /** For launch decisions: the day customers can buy. */
  goLive?: string;
  nextSteps: NextStep[];
}

export interface ScheduleRow {
  date: string;
  label: string;
  owner: 'You' | 'Xeliport';
  note?: string;
}

export interface Decision {
  id: string;
  corridorId: 'uk' | 'uae';
  /** When the system flagged it. Used in the team view. */
  flaggedOn: string;
  title: string;
  shortTitle: string;
  dueDate: string;
  whyItMatters: string;
  situation: string;
  whatChanged?: string;
  alreadyDone: string[];
  facts: Fact[];
  checks?: Check[];
  draftCopy?: { sku: string; from: string; to: string }[];
  ifNothingChanges: string;
  options: Option[];
  recommendedId: string;
  ifYouDontDecide: string;
  /** Shown under the confirm button, before the decision is made. */
  confirmNote?: string;
  escalation: { date: string; text: string }[];
  why: {
    scheduleTitle: string;
    schedule: ScheduleRow[];
    costTitle: string;
    costLines: { label: string; value: string }[];
    assumptions: string[];
  };
}

/* ---- UK: label wording ---- */

export const UK_LAUNCH_TARGET = addDays(UK_START, 89);
const UK_SAIL = '2026-10-09';
const UK_TRANSIT = 21;
const UK_CLEARANCE = 3;
const UK_INTAKE = 2;
const ukGoLive = (sailDate: string) => addDays(sailDate, UK_TRANSIT + UK_CLEARANCE + UK_INTAKE);
const UK_DAILY_SALES_ESTIMATE = 18_000;
const FLAGGED_UNITS = 1_200;
const OVERLABEL_PER_UNIT = 18;
const AIR_TRANSIT = 5;
const ukLateSail = '2026-10-16';
const ukLateGoLive = ukGoLive(ukLateSail);
const ukDaysLate = diffDays(UK_LAUNCH_TARGET, ukLateGoLive);

const ukClaims: Decision = {
  id: 'uk-claims',
  corridorId: 'uk',
  flaggedOn: '2026-10-03',
  title: '2 UK product labels need your decision',
  shortTitle: 'UK labels: 2 of 12 products',
  dueDate: '2026-10-07',
  whyItMatters: `Your first UK shipment sails ${fmt(UK_SAIL)}. Two labels could make the UK treat those products as medicines, not supplements.`,
  situation:
    'Before your first UK shipment, Xeliport re-ran its label and claims check on all 12 products. 10 pass. 2 use wording that could make the UK treat them as medicines instead of food supplements. Fixing the wording is the one part only you can decide, because the claims are yours.',
  whatChanged:
    'On Sep 8 the UK Committee on Toxicity discussed a working draft on ashwagandha, a live review. Xeliport re-checked your labels against the stricter reading.',
  alreadyDone: [
    'Re-checked all 12 labels',
    'Drafted compliant wording for the 2 flagged products',
    'Worked back the shipping deadline from your Nov 4 launch',
    'Priced 3 ways to fix it',
  ],
  facts: [
    { label: 'Labels checked', value: '12 products', certainty: 'checked' },
    { label: 'Passing', value: '10 products', certainty: 'checked' },
    { label: 'Need your wording', value: '2 products', certainty: 'checked' },
    { label: 'Sailing loads at Mundra', value: fmtDay(UK_SAIL), certainty: 'checked' },
  ],
  checks: [
    {
      sku: 'Ashwa Calm Gummies',
      text: '“Relieves stress and anxiety”',
      rule: 'Relieving a condition is a medicinal claim. Supplements may only use authorised health claims.',
      result: 'fail',
    },
    {
      sku: 'Deep Sleep Drops',
      text: '“Treats occasional insomnia”',
      rule: 'Treating a condition is a medicinal claim.',
      result: 'fail',
    },
    { sku: '10 other products', text: 'No claim wording flagged', rule: 'Descriptive wording only', result: 'pass' },
  ],
  draftCopy: [
    { sku: 'Ashwa Calm Gummies', from: 'Relieves stress and anxiety', to: 'Ashwagandha root extract, 300 mg per gummy' },
    { sku: 'Deep Sleep Drops', from: 'Treats occasional insomnia', to: 'Herbal drops with chamomile and lemon balm' },
  ],
  ifNothingChanges: `Without a decision by ${fmt('2026-10-07')}, those 2 products can’t go on the ${fmt(UK_SAIL)} sailing as labelled. Your other 10 still ship on time.`,
  options: [
    {
      id: 'overlabel',
      label: 'Approve new wording now and fix labels in the UK',
      short: 'Approve wording, sticker in the UK',
      summary: 'Ship all 12 products on time. The UK warehouse applies compliant stickers before stock goes on sale.',
      cashInr: FLAGGED_UNITS * OVERLABEL_PER_UNIT,
      cashNote: `${FLAGGED_UNITS.toLocaleString('en-IN')} units × ₹${OVERLABEL_PER_UNIT} per sticker`,
      outcome: `All 12 products on sale ${fmtDay(ukGoLive(UK_SAIL))}, on your launch date.`,
      tradeoff: `You must approve the drafted wording by ${fmt('2026-10-07')}. Xeliport’s UK compliance partner reviews it before anything is printed.`,
      goLive: ukGoLive(UK_SAIL),
      nextSteps: [
        { who: 'You', text: 'Approve the new wording for 2 products', date: '2026-10-04' },
        { who: 'Xeliport', text: 'UK compliance partner reviews the wording', date: '2026-10-08', holder: 'partner', owner: 'UK compliance partner' },
        { who: 'Xeliport', text: 'Ship all 12 products from Mundra', date: UK_SAIL, holder: 'partner', owner: 'Freight forwarder' },
        { who: 'Xeliport', text: 'Print stickers in the UK and send them to the 3PL', date: '2026-10-28', holder: 'partner', owner: 'UK print partner' },
        { who: 'Xeliport', text: 'UK 3PL applies stickers at check-in and listings go live', date: ukGoLive(UK_SAIL), holder: 'partner', owner: 'UK 3PL' },
      ],
    },
    {
      id: 'air-later',
      label: 'Ship 10 now, air-freight the other 2 later',
      short: 'Ship 10 now, fly 2 later',
      summary: 'Buys you until Oct 20 to settle the wording. Costs more.',
      cashInr: 41_000 + 6_500,
      cashNote: '₹41,000 air freight + ₹6,500 reprint in India',
      outcome: `All 12 on sale ${fmtDay(UK_LAUNCH_TARGET)} only if you approve wording by ${fmt('2026-10-20')}. After that, the 2 products slip day for day.`,
      tradeoff: 'Highest cash cost, but the only option that lets you take more time to decide.',
      goLive: UK_LAUNCH_TARGET,
      nextSteps: [
        { who: 'Xeliport', text: 'Ship the 10 passing products from Mundra', date: UK_SAIL, holder: 'partner', owner: 'Freight forwarder' },
        { who: 'You', text: 'Approve the new wording for 2 products', date: '2026-10-20' },
        { who: 'Xeliport', text: 'Reprint labels in India', date: '2026-10-23', holder: 'team', owner: 'Meera Nair' },
        { who: 'Xeliport', text: `Air-freight the 2 products (${AIR_TRANSIT} days)`, date: '2026-10-23', holder: 'partner', owner: 'Air freight partner' },
        { who: 'Xeliport', text: 'All 12 products on sale in the UK', date: UK_LAUNCH_TARGET, holder: 'team', owner: 'Meera Nair' },
      ],
    },
    {
      id: 'reprint-all',
      label: 'Hold the whole shipment and reprint in India',
      short: 'Hold and reprint in India',
      summary: 'Fix the labels at source and sail a week later. Launch moves.',
      cashInr: 9_000,
      cashNote: 'Rush reprint in India',
      atStake: { label: 'Sales pushed back (estimate)', inr: ukDaysLate * UK_DAILY_SALES_ESTIMATE },
      outcome: `All 12 on sale ${fmtDay(ukLateGoLive)}, ${ukDaysLate} days after your target.`,
      tradeoff: 'Lowest cash, but the launch slips and the UK 3PL slot has to be moved.',
      goLive: ukLateGoLive,
      nextSteps: [
        { who: 'You', text: 'Approve the new wording for 2 products', date: '2026-10-07' },
        { who: 'Xeliport', text: 'Move the UK 3PL inbound slot by 7 days', date: '2026-10-08', holder: 'team', owner: 'Meera Nair' },
        { who: 'Xeliport', text: 'Reprint labels in India', date: '2026-10-15', holder: 'team', owner: 'Meera Nair' },
        { who: 'Xeliport', text: 'Ship all 12 products from Mundra', date: ukLateSail, holder: 'partner', owner: 'Freight forwarder' },
        { who: 'Xeliport', text: 'All 12 products on sale in the UK', date: ukLateGoLive, holder: 'team', owner: 'Meera Nair' },
      ],
    },
  ],
  recommendedId: 'overlabel',
  ifYouDontDecide: `Xeliport ships the 10 passing products on ${fmt(UK_SAIL)} and holds the 2 flagged ones. Nothing is spent or printed until you choose.`,
  confirmNote:
    'Choosing the first or third option approves the drafted wording today. Nothing is printed until Xeliport’s UK compliance partner has signed it off.',
  escalation: [
    { date: '2026-10-06', text: 'Reminder in the dashboard and on WhatsApp' },
    { date: '2026-10-07', text: 'Meera Nair, your account manager, calls you' },
    { date: '2026-10-08', text: 'The 10 passing products are booked to ship. The 2 flagged are held' },
  ],
  why: {
    scheduleTitle: `Worked back from your ${fmt(UK_LAUNCH_TARGET)} launch`,
    schedule: [
      { date: '2026-10-07', label: 'Your decision', owner: 'You', note: 'Leaves time for partner review before the sailing' },
      { date: UK_SAIL, label: 'Sailing loads at Mundra', owner: 'Xeliport', note: 'Booked loading cut-off' },
      { date: addDays(UK_SAIL, UK_TRANSIT), label: 'Arrives at the UK port', owner: 'Xeliport', note: `${UK_TRANSIT} days at sea (assumption)` },
      { date: addDays(UK_SAIL, UK_TRANSIT + UK_CLEARANCE), label: 'UK customs cleared', owner: 'Xeliport', note: `${UK_CLEARANCE} days (assumption)` },
      { date: ukGoLive(UK_SAIL), label: 'Stickers applied, listings live', owner: 'Xeliport', note: `${UK_INTAKE} days at the 3PL (assumption)` },
    ],
    costTitle: 'Cost of the recommended option',
    costLines: [
      { label: 'Units needing a sticker', value: FLAGGED_UNITS.toLocaleString('en-IN') },
      { label: 'Sticker and labour per unit', value: `₹${OVERLABEL_PER_UNIT}` },
      { label: 'Total', value: `₹${(FLAGGED_UNITS * OVERLABEL_PER_UNIT).toLocaleString('en-IN')}` },
    ],
    assumptions: [
      'Sea transit 21 days, customs 3 days, 3PL intake 2 days',
      'Over-labelling before sale is accepted by the UK 3PL and the compliance partner',
      `Sales pushed back by a late launch use the demand-test run rate of ₹${UK_DAILY_SALES_ESTIMATE.toLocaleString('en-IN')} per day (estimate)`,
      'Claim rules shown are an illustrative rule set for this prototype',
    ],
  },
};

/* ---- UAE: Cyber Week stock ---- */

const UAE_SAIL = '2026-10-09';
const UAE_TRANSIT_AND_CLEARANCE = 35;
const UAE_INBOUND_QUEUE = 14;
const CYBER_WEEK_START = '2026-12-01';
const CYBER_UPLIFT = 2.2;
const BIG_UPLIFT = 3.0;
const CYBER_DAYS = 7;
const LOGISTICS_PER_UNIT = 80;

const uaeArrive = addDays(UAE_SAIL, UAE_TRANSIT_AND_CLEARANCE);
const uaeSellable = addDays(uaeArrive, UAE_INBOUND_QUEUE);
const uaeBuffer = diffDays(uaeSellable, CYBER_WEEK_START);
const extraUnits = Math.round((CYBER_UPLIFT - 1) * uaeStats.perDay * CYBER_DAYS);
const bigExtraUnits = Math.round((BIG_UPLIFT - 1) * uaeStats.perDay * CYBER_DAYS);
const salesAtStake = extraUnits * uaeStats.pricePerUnit;

const uaeCyber: Decision = {
  id: 'uae-cyberweek',
  corridorId: 'uae',
  flaggedOn: '2026-10-03',
  title: 'Cyber Week: choose how much extra stock to ship',
  shortTitle: 'UAE Cyber Week stock',
  dueDate: '2026-10-08',
  whyItMatters: `Stock for Cyber Week (starts ${fmt(CYBER_WEEK_START)}) has to sail by ${fmt(UAE_SAIL)}. Miss it and the sale goes by without stock.`,
  situation: `Your UAE sales are running at ${Math.round(uaeStats.perDay)} units a day. Xeliport already booked your regular replenishment, timed to land before current stock runs out. This decision is only about extra stock for Cyber Week, which is yours to decide because you carry the stock risk.`,
  alreadyDone: [
    'Calculated demand from your last 7 days of UAE sales',
    `Worked back the ship-by date from ${fmt(CYBER_WEEK_START)}`,
    'Checked prices keep 20% headroom for promotions',
    'Priced 3 stock levels',
  ],
  facts: [
    { label: 'Current pace', value: `${Math.round(uaeStats.perDay)} units/day`, certainty: 'checked' },
    { label: 'Stock on hand', value: `${uaeStats.onHand.toLocaleString('en-IN')} units (${uaeStats.coverDays} days)`, certainty: 'checked' },
    { label: 'Ship-by for Cyber Week', value: fmtDay(UAE_SAIL), certainty: 'checked' },
    { label: 'Expected extra demand', value: `~${extraUnits} units`, certainty: 'estimate' },
  ],
  ifNothingChanges: `Without extra stock, Cyber Week sells from regular stock only. Estimated sales at stake: ${inrShort(salesAtStake)}.`,
  options: [
    {
      id: 'add-800',
      label: 'Add 800 units to the Oct 9 sailing',
      short: 'Add 800 units',
      summary: 'Covers the expected spike with a small buffer.',
      cashInr: 800 * LOGISTICS_PER_UNIT,
      cashNote: `800 units × ₹${LOGISTICS_PER_UNIT} freight and clearance`,
      outcome: `Sellable by ${fmtDay(uaeSellable)}, ${uaeBuffer} days before Cyber Week. Covers the expected extra ~${extraUnits} units.`,
      tradeoff: 'If Cyber Week sells below the estimate, leftover units carry into the year-end sale.',
      nextSteps: [
        { who: 'You', text: 'Confirm 800 extra units', date: '2026-10-04' },
        { who: 'Xeliport', text: 'Add the units to the Oct 9 sailing', date: UAE_SAIL, holder: 'partner', owner: 'Freight forwarder' },
        { who: 'Xeliport', text: 'Clear at Jebel Ali and truck to the 3PL', date: uaeArrive, holder: 'partner', owner: 'UAE customs broker' },
        { who: 'Xeliport', text: 'Book marketplace inbound slots and Arabic listings', date: '2026-11-20', holder: 'team', owner: 'Meera Nair' },
        { who: 'Xeliport', text: 'Stock sellable on Amazon.ae and noon', date: uaeSellable, holder: 'system', owner: 'Stock monitor' },
      ],
    },
    {
      id: 'add-1400',
      label: 'Add 1,400 units to the Oct 9 sailing',
      short: 'Add 1,400 units',
      summary: `Covers a stronger spike (${BIG_UPLIFT.toFixed(1)}× normal pace, ~${bigExtraUnits.toLocaleString('en-IN')} extra units).`,
      cashInr: 1_400 * LOGISTICS_PER_UNIT,
      cashNote: `1,400 units × ₹${LOGISTICS_PER_UNIT} freight and clearance`,
      atStake: { label: 'Leftover storage if the spike is as expected (estimate)', inr: 9_000 },
      outcome: `Sellable by ${fmtDay(uaeSellable)}. Safe against a sell-out.`,
      tradeoff: `At the expected spike ~${1_400 - extraUnits} units are left over and wait for the year-end sale.`,
      nextSteps: [
        { who: 'You', text: 'Confirm 1,400 extra units', date: '2026-10-04' },
        { who: 'Xeliport', text: 'Add the units to the Oct 9 sailing', date: UAE_SAIL, holder: 'partner', owner: 'Freight forwarder' },
        { who: 'Xeliport', text: 'Clear at Jebel Ali and truck to the 3PL', date: uaeArrive, holder: 'partner', owner: 'UAE customs broker' },
        { who: 'Xeliport', text: 'Book marketplace inbound slots and Arabic listings', date: '2026-11-20', holder: 'team', owner: 'Meera Nair' },
        { who: 'Xeliport', text: 'Stock sellable on Amazon.ae and noon', date: uaeSellable, holder: 'system', owner: 'Stock monitor' },
      ],
    },
    {
      id: 'skip',
      label: 'No extra stock for Cyber Week',
      short: 'No extra stock',
      summary: 'Spend nothing extra and sell from regular stock.',
      cashInr: 0,
      cashNote: 'No extra cost',
      atStake: { label: 'Sales at stake (estimate)', inr: salesAtStake },
      outcome: 'Cyber Week runs on regular stock only.',
      tradeoff: `The extra ~${extraUnits} units of expected demand go unserved.`,
      nextSteps: [
        { who: 'You', text: 'Confirm no extra stock', date: '2026-10-04' },
        { who: 'Xeliport', text: 'Release the Oct 9 sailing booking. No extra stock', date: UAE_SAIL, holder: 'team', owner: 'Meera Nair' },
        { who: 'Xeliport', text: 'Re-check stock levels before Cyber Week', date: '2026-11-24', holder: 'system', owner: 'Stock monitor' },
      ],
    },
  ],
  recommendedId: 'add-800',
  ifYouDontDecide: `Xeliport will not spend your money. The ${fmt(UAE_SAIL)} booking is released and no extra stock ships.`,
  escalation: [
    { date: '2026-10-07', text: 'Reminder in the dashboard and on WhatsApp' },
    { date: '2026-10-08', text: 'Meera Nair, your account manager, calls you before the booking closes' },
    { date: UAE_SAIL, text: `The ${fmt(UAE_SAIL)} booking is released and no extra stock ships` },
  ],
  why: {
    scheduleTitle: `Worked back from Cyber Week, ${fmt(CYBER_WEEK_START)}`,
    schedule: [
      { date: '2026-10-08', label: 'Your decision', owner: 'You', note: 'Xeliport needs a day to pack and book' },
      { date: UAE_SAIL, label: 'Sailing loads', owner: 'Xeliport', note: 'Latest ship date for Cyber Week' },
      { date: uaeArrive, label: 'Cleared at Jebel Ali and trucked to the 3PL', owner: 'Xeliport', note: `${UAE_TRANSIT_AND_CLEARANCE} days (assumption)` },
      { date: uaeSellable, label: 'Marketplace inbound done, listings live', owner: 'Xeliport', note: `${UAE_INBOUND_QUEUE}-day queue buffer (assumption)` },
      { date: CYBER_WEEK_START, label: 'Cyber Week starts', owner: 'Xeliport', note: `${uaeBuffer} days of buffer` },
    ],
    costTitle: 'Demand and cost behind the recommendation',
    costLines: [
      { label: 'Current pace', value: `${Math.round(uaeStats.perDay)} units/day (612 units in 7 days)` },
      { label: `Cyber Week pace (${CYBER_UPLIFT}×, ${CYBER_DAYS} days)`, value: `${Math.round(CYBER_UPLIFT * uaeStats.perDay * CYBER_DAYS)} units` },
      { label: 'Extra over normal', value: `~${extraUnits} units` },
      { label: 'Average revenue per unit', value: `₹${uaeStats.pricePerUnit}` },
      { label: 'Freight and clearance', value: `₹${LOGISTICS_PER_UNIT} per unit` },
    ],
    assumptions: [
      `Cyber Week sells ${CYBER_UPLIFT}× your current pace for ${CYBER_DAYS} days (estimate; the real range is 2–3×)`,
      `Sea freight and clearance ${UAE_TRANSIT_AND_CLEARANCE} days, marketplace inbound queue ${UAE_INBOUND_QUEUE} days`,
      'Regular replenishment is separate and already booked',
      'Rates and timings are illustrative for this prototype',
    ],
  },
};

export const decisions: Decision[] = [ukClaims, uaeCyber];

export function getDecision(id: string): Decision | undefined {
  return decisions.find((d) => d.id === id);
}

export function getOption(decision: Decision, optionId: string): Option | undefined {
  return decision.options.find((o) => o.id === optionId);
}

/* ------------------------------------------------------------------ *
 *  Simulated event: the carrier rolls the Oct 9 UAE sailing.
 *  Fired from the demo controls. What it does depends on the
 *  founder's Cyber Week choice, which is the point of the demo.
 * ------------------------------------------------------------------ */

export type EventId = 'uae-roll';

export const ROLL_NOTICE_DATE = TODAY_FOR_DATA;
export const ROLLED_SAIL = addDays(UAE_SAIL, 6);
const rolledArrive = addDays(ROLLED_SAIL, UAE_TRANSIT_AND_CLEARANCE);
export const ROLLED_SELLABLE = addDays(rolledArrive, UAE_INBOUND_QUEUE);
export const ROLL_GAP_DAYS = diffDays(CYBER_WEEK_START, ROLLED_SELLABLE);
const gapExtraUnits = Math.round((CYBER_UPLIFT - 1) * uaeStats.perDay * ROLL_GAP_DAYS);
const gapSalesAtStake = gapExtraUnits * uaeStats.pricePerUnit;
const SELF_FULFIL_EXTRA_PER_UNIT = 45;
const AIR_EXTRA_PER_UNIT = 150;
const AIR_UNITS = 400;
const airShip = '2026-10-16';
const airSellable = addDays(airShip, 5 + UAE_INBOUND_QUEUE);

/** The working the system shows while it absorbs the event. */
export const rollSteps = [
  `Carrier notice: the ${fmt(UAE_SAIL)} Mundra → Jebel Ali sailing is overbooked`,
  `Rebooked your container on the ${fmt(ROLLED_SAIL)} sailing at no extra cost`,
  `Worked the dates again: marketplace-ready ${fmtDay(ROLLED_SELLABLE)}`,
  `Compared with Cyber Week (${fmt(CYBER_WEEK_START)}): ${ROLL_GAP_DAYS} days short`,
  'Priced 3 ways to recover',
];

export function buildRollDecision(units: number): Decision {
  const air = Math.min(AIR_UNITS, units);
  return {
    id: 'uae-roll',
    corridorId: 'uae',
    flaggedOn: ROLL_NOTICE_DATE,
    title: `Your Cyber Week stock now lands ${ROLL_GAP_DAYS} days late`,
    shortTitle: 'UAE Cyber Week stock delay',
    dueDate: '2026-10-12',
    whyItMatters: `The carrier moved your ${units.toLocaleString('en-IN')} extra units from the ${fmt(UAE_SAIL)} sailing to ${fmt(ROLLED_SAIL)}. They are now marketplace-ready ${fmt(ROLLED_SELLABLE)}, ${ROLL_GAP_DAYS} days after Cyber Week starts.`,
    situation: `Carriers often overbook and push containers to the next sailing. Xeliport rebooked yours straight away, so nothing is lost, but the new dates miss the first ${ROLL_GAP_DAYS} days of Cyber Week. Choosing how much to spend to recover those days is yours, because it is your money.`,
    whatChanged: `On ${fmt(ROLL_NOTICE_DATE)} the carrier rolled the ${fmt(UAE_SAIL)} sailing. You decided on Cyber Week stock before this happened; the system re-ran that plan as soon as the notice arrived.`,
    alreadyDone: [
      `Rebooked your container on ${fmt(ROLLED_SAIL)} at no cost`,
      'Worked out the new arrival and sell dates',
      'Checked the Dubai 3PL can ship marketplace orders itself',
      'Priced 3 ways to recover the lost days',
    ],
    facts: [
      { label: 'New sailing', value: fmtDay(ROLLED_SAIL), certainty: 'checked' },
      { label: 'At the Dubai 3PL', value: fmtDay(rolledArrive), certainty: 'estimate' },
      { label: 'Marketplace-ready', value: fmtDay(ROLLED_SELLABLE), certainty: 'estimate' },
      { label: 'Cyber Week days missed', value: `${ROLL_GAP_DAYS} days (~${gapExtraUnits} extra units)`, certainty: 'estimate' },
    ],
    ifNothingChanges: `Your Cyber Week stock goes on sale ${fmt(ROLLED_SELLABLE)}. The first ${ROLL_GAP_DAYS} days run on regular stock only. Estimated sales at stake: ${inrShort(gapSalesAtStake)}.`,
    options: [
      {
        id: 'self-fulfil',
        label: 'Ship from the Dubai 3PL until the marketplace stock is ready',
        short: 'Ship from the Dubai 3PL',
        summary: `Your stock reaches the 3PL ${fmt(rolledArrive)}, well before the sale. For the first ${ROLL_GAP_DAYS} days the 3PL ships Amazon.ae and noon orders itself.`,
        cashInr: gapExtraUnits * SELF_FULFIL_EXTRA_PER_UNIT,
        cashNote: `~${gapExtraUnits} orders × ₹${SELF_FULFIL_EXTRA_PER_UNIT} extra fulfilment`,
        outcome: `Cyber Week orders are served from ${fmtDay(CYBER_WEEK_START)}. Marketplace-fulfilled from ${fmt(ROLLED_SELLABLE)}.`,
        tradeoff: `Delivery is a day slower for those ${ROLL_GAP_DAYS} days, so a few shoppers may pick a faster seller.`,
        nextSteps: [
          { who: 'You', text: 'Approve 3PL shipping for the first days of Cyber Week', date: TODAY_FOR_DATA },
          { who: 'Xeliport', text: `Container sails on ${fmt(ROLLED_SAIL)}`, date: ROLLED_SAIL, holder: 'partner', owner: 'Freight forwarder' },
          { who: 'Xeliport', text: 'Stock cleared and at the Dubai 3PL', date: rolledArrive, holder: 'partner', owner: 'UAE customs broker' },
          { who: 'Xeliport', text: 'Switch listings to 3PL shipping for the gap days', date: addDays(CYBER_WEEK_START, -1), holder: 'team', owner: 'Meera Nair' },
          { who: 'Xeliport', text: 'Switch back to marketplace shipping', date: ROLLED_SELLABLE, holder: 'system', owner: 'Stock monitor' },
        ],
      },
      {
        id: 'air-400',
        label: `Air-freight ${air} units so they are ready well before the sale`,
        short: `Air-freight ${air} units`,
        summary: `Fly ${air} units on ${fmt(airShip)} and send the rest by sea on ${fmt(ROLLED_SAIL)}.`,
        cashInr: air * AIR_EXTRA_PER_UNIT,
        cashNote: `${air} units × ₹${AIR_EXTRA_PER_UNIT} more than sea freight`,
        outcome: `${air} units marketplace-ready by ${fmtDay(airSellable)}. The rest from ${fmt(ROLLED_SELLABLE)}.`,
        tradeoff: `Costs the most, and covers more than the ${ROLL_GAP_DAYS} days you actually lose.`,
        nextSteps: [
          { who: 'You', text: `Approve air freight for ${air} units`, date: TODAY_FOR_DATA },
          { who: 'Xeliport', text: `Split the shipment: ${air} by air, the rest by sea`, date: '2026-10-13', holder: 'team', owner: 'Meera Nair' },
          { who: 'Xeliport', text: `Rest of the container sails on ${fmt(ROLLED_SAIL)}`, date: ROLLED_SAIL, holder: 'partner', owner: 'Freight forwarder' },
          { who: 'Xeliport', text: `Fly ${air} units to Dubai`, date: airShip, holder: 'partner', owner: 'Air freight partner' },
          { who: 'Xeliport', text: `${air} units marketplace-ready`, date: airSellable, holder: 'system', owner: 'Stock monitor' },
        ],
      },
      {
        id: 'accept-late',
        label: 'Accept the later date',
        short: 'Accept the later date',
        summary: `Spend nothing extra. Cyber Week stock goes on sale ${fmt(ROLLED_SELLABLE)}.`,
        cashInr: 0,
        cashNote: 'No extra cost',
        atStake: { label: 'Sales at stake (estimate)', inr: gapSalesAtStake },
        outcome: `The first ${ROLL_GAP_DAYS} days of Cyber Week run on regular stock only.`,
        tradeoff: `~${gapExtraUnits} units of extra demand in those days go unserved.`,
        nextSteps: [
          { who: 'You', text: 'Confirm the later date', date: TODAY_FOR_DATA },
          { who: 'Xeliport', text: `Container sails on ${fmt(ROLLED_SAIL)}`, date: ROLLED_SAIL, holder: 'partner', owner: 'Freight forwarder' },
          { who: 'Xeliport', text: 'Cyber Week stock on sale', date: ROLLED_SELLABLE, holder: 'system', owner: 'Stock monitor' },
        ],
      },
    ],
    recommendedId: 'self-fulfil',
    ifYouDontDecide: `Xeliport will not spend your money. Your stock sails ${fmt(ROLLED_SAIL)} and goes on sale ${fmt(ROLLED_SELLABLE)}.`,
    escalation: [
      { date: '2026-10-10', text: 'Reminder in the dashboard and on WhatsApp' },
      { date: '2026-10-11', text: 'Meera Nair, your account manager, calls you' },
      { date: '2026-10-12', text: 'Stock ships on the later date. Nothing extra is spent' },
    ],
    why: {
      scheduleTitle: `Worked forward from the new ${fmt(ROLLED_SAIL)} sailing`,
      schedule: [
        { date: ROLLED_SAIL, label: 'Rebooked sailing loads', owner: 'Xeliport', note: 'Confirmed by the carrier' },
        { date: rolledArrive, label: 'Cleared at Jebel Ali and at the Dubai 3PL', owner: 'Xeliport', note: `${UAE_TRANSIT_AND_CLEARANCE} days (assumption)` },
        { date: CYBER_WEEK_START, label: 'Cyber Week starts', owner: 'Xeliport', note: 'Stock is in Dubai, not yet at the marketplace' },
        { date: ROLLED_SELLABLE, label: 'Marketplace inbound done', owner: 'Xeliport', note: `${UAE_INBOUND_QUEUE}-day queue (assumption)` },
      ],
      costTitle: 'What the late days cost',
      costLines: [
        { label: 'Days of Cyber Week without marketplace stock', value: `${ROLL_GAP_DAYS}` },
        { label: `Extra demand in those days (${CYBER_UPLIFT}× pace)`, value: `~${gapExtraUnits} units` },
        { label: 'Average revenue per unit', value: `₹${uaeStats.pricePerUnit}` },
        { label: 'Sales at stake if nothing is done', value: inrShort(gapSalesAtStake) },
        { label: 'Extra 3PL fulfilment per order', value: `₹${SELF_FULFIL_EXTRA_PER_UNIT}` },
      ],
      assumptions: [
        `Same Cyber Week pace as the original plan (${CYBER_UPLIFT}×, estimate)`,
        'The Dubai 3PL can fulfil marketplace orders directly for a short period',
        'Rebooking after a carrier roll costs nothing extra',
        'Rates and timings are illustrative for this prototype',
      ],
    },
  };
}

/** Feed items the event adds to "Handled by Xeliport", per branch. */
export function rollHandled(branch: 'absorbed' | 'decision', units = 0): HandledItem[] {
  if (branch === 'absorbed') {
    return [
      {
        layer: 'shipping',
        text: `Carrier rolled the ${fmt(UAE_SAIL)} Jebel Ali sailing. You had no extra stock on it, so nothing changes for you`,
        date: ROLL_NOTICE_DATE,
        by: 'system',
      },
    ];
  }
  return [
    { layer: 'shipping', text: `Rebooked your ${units.toLocaleString('en-IN')} Cyber Week units on the ${fmt(ROLLED_SAIL)} sailing at no extra cost`, date: ROLL_NOTICE_DATE, by: 'team' },
    { layer: 'shipping', text: `Re-worked Cyber Week dates after the carrier rolled the ${fmt(UAE_SAIL)} sailing`, date: ROLL_NOTICE_DATE, by: 'system' },
  ];
}

/* ------------------------------------------------------------------ *
 *  Xeliport-team view: open work on this account and who holds it.
 * ------------------------------------------------------------------ */

export interface OpsTask {
  holder: Holder;
  owner: string;
  text: string;
  date: string;
  /** Waiting on this founder decision. */
  waitsOn?: string;
  /** Internal work the founder never sees. */
  internal?: boolean;
}

export const opsTasks: OpsTask[] = [
  { holder: 'system', owner: 'Rules engine', text: 'Re-check all 12 UK labels each night against the claims rule set', date: TODAY_FOR_DATA, internal: true },
  { holder: 'system', owner: 'Schedule watcher', text: `Watch both ${fmt(UK_SAIL)} sailings for carrier changes`, date: TODAY_FOR_DATA, internal: true },
  { holder: 'system', owner: 'Stock monitor', text: `Recompute UAE stock cover daily (now ${uaeStats.coverDays} days)`, date: TODAY_FOR_DATA, internal: true },
  { holder: 'system', owner: 'Settlement matcher', text: `Match the ${fmt(settlement.payoutDate)} payout to marketplace reports`, date: settlement.payoutDate, internal: true },
  { holder: 'team', owner: 'Meera Nair', text: 'Finalise the UK commercial invoice and packing list', date: '2026-10-08', waitsOn: 'uk-claims' },
  { holder: 'team', owner: 'Meera Nair', text: 'Weekly account review with Anika', date: '2026-10-09', internal: true },
  { holder: 'partner', owner: 'UK compliance partner', text: 'Review the drafted wording for 2 products', date: '2026-10-08', waitsOn: 'uk-claims' },
  { holder: 'partner', owner: 'Freight forwarder', text: `Hold container space on the ${fmt(UAE_SAIL)} UAE sailing for Cyber Week`, date: UAE_SAIL, waitsOn: 'uae-cyberweek' },
  { holder: 'partner', owner: 'Dubai 3PL', text: 'Cycle count before the Cyber Week inbound', date: '2026-10-08', internal: true },
];

export const HOLDER_NAMES: Record<Holder, string> = {
  system: 'The system',
  team: 'Xeliport team',
  partner: 'Partners',
};

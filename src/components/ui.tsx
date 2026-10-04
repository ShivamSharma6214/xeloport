import type { ReactNode } from 'react';
import {
  Banknote,
  CheckCircle2,
  Circle,
  CircleDot,
  Landmark,
  Loader2,
  Package,
  Store,
  Truck,
  Warehouse,
  type LucideIcon,
} from 'lucide-react';
import type { Certainty, ItemState, LayerId } from '@/data/mockData';

export function Card({
  children,
  className = '',
  onClick,
  hover = false,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-white border border-ink-200 rounded-xl shadow-card ${
        hover ? 'transition-all duration-200 hover:shadow-card-hover hover:border-ink-300 cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionHeader({ title, subtitle, right }: { title: string; subtitle?: string; right?: ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-4 mb-3">
      <div>
        <h3 className="text-base font-semibold text-ink-900">{title}</h3>
        {subtitle && <p className="text-sm text-ink-500 mt-0.5">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; onClick?: () => void }[] }) {
  return (
    <nav className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-ink-300">/</span>}
          {item.onClick ? (
            <button onClick={item.onClick} className="text-left text-ink-500 hover:text-ink-800 transition-colors">
              {item.label}
            </button>
          ) : (
            <span className="text-ink-800 font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function PrimaryButton({
  children,
  onClick,
  icon,
  disabled = false,
  className = '',
}: {
  children: ReactNode;
  onClick?: () => void;
  icon?: ReactNode;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
        disabled
          ? 'bg-ink-100 text-ink-400 cursor-not-allowed'
          : 'bg-ink-900 text-white hover:bg-ink-800 active:bg-ink-700'
      } ${className}`}
    >
      {children}
      {icon}
    </button>
  );
}

export function SecondaryButton({
  children,
  onClick,
  icon,
  className = '',
}: {
  children: ReactNode;
  onClick?: () => void;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2 bg-white text-ink-700 text-sm font-medium rounded-lg border border-ink-200 hover:bg-ink-50 hover:border-ink-300 transition-colors ${className}`}
    >
      {icon}
      {children}
    </button>
  );
}

type Tone = 'neutral' | 'green' | 'amber' | 'red' | 'blue';

const toneClasses: Record<Tone, string> = {
  neutral: 'bg-ink-100 text-ink-600 border-ink-200',
  green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  amber: 'bg-amber-50 text-amber-800 border-amber-200',
  red: 'bg-red-50 text-red-700 border-red-200',
  blue: 'bg-brand-50 text-brand-700 border-brand-200',
};

export function Chip({ tone = 'neutral', children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] font-medium whitespace-nowrap ${toneClasses[tone]}`}
    >
      {children}
    </span>
  );
}

/** Who owns this item. The whole redesign hinges on the split between these two. */
export function OwnerTag({ owner }: { owner: 'You' | 'Xeliport' }) {
  return owner === 'You' ? <Chip tone="amber">Needs you</Chip> : <Chip>Xeliport is handling</Chip>;
}

/** Separates a fixed rule check from an estimate, so nothing pretends to be more certain than it is. */
export function CertaintyTag({ certainty }: { certainty: Certainty }) {
  return certainty === 'checked' ? <Chip tone="green">Checked</Chip> : <Chip tone="blue">Estimate</Chip>;
}

export const layerIcons: Record<LayerId, LucideIcon> = {
  compliance: Landmark,
  shipping: Truck,
  '3pl': Warehouse,
  marketplace: Store,
  retail: Package,
  forex: Banknote,
};

export function ItemIcon({ state }: { state: ItemState }) {
  switch (state) {
    case 'done':
      return <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />;
    case 'working':
      return <Loader2 className="w-4 h-4 text-ink-400 flex-shrink-0" />;
    case 'needs-you':
      return <CircleDot className="w-4 h-4 text-amber-600 flex-shrink-0" />;
    default:
      return <Circle className="w-4 h-4 text-ink-300 flex-shrink-0" />;
  }
}

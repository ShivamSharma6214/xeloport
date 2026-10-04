import { useEffect, useRef } from 'react';
import { Compass, FileText, Home, Lock, Menu, X } from 'lucide-react';
import { useRouter } from '@/router';
import { useDecisions, useStore } from '@/store';
import { comingSoon, corridors } from '@/data/mockData';

const author = { name: 'Shivam Sharma', initials: 'SS', title: 'AI Product Manager' };
import { Chip } from '@/components/ui';
import { DemoControls } from '@/components/DemoControls';

function ViewSwitch() {
  const { path, navigate } = useRouter();
  const team = path === '/ops';
  const btn = (active: boolean) =>
    `px-2.5 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium transition-colors ${
      active ? 'bg-white text-ink-900 shadow-card' : 'text-ink-500 hover:text-ink-800'
    }`;
  return (
    <div className="flex items-center gap-2">
      <span className="hidden lg:inline text-xs text-ink-500">Viewing as</span>
      <div className="inline-flex p-0.5 rounded-lg bg-ink-100 border border-ink-200">
        <button className={btn(!team)} onClick={() => navigate('/')}>
          Founder
        </button>
        <button className={btn(team)} onClick={() => navigate('/ops')}>
          Xeliport team
        </button>
      </div>
    </div>
  );
}

function Sidebar({ onNavigate }: { onNavigate: () => void }) {
  const { path, navigate } = useRouter();
  const { decided } = useStore();
  const { all } = useDecisions();

  const go = (to: string) => {
    navigate(to);
    onNavigate();
  };

  const pendingFor = (corridorId: string) => all.filter((d) => d.corridorId === corridorId && !decided[d.id]).length;

  const navBtn = (active: boolean) =>
    `w-full flex items-center gap-3 px-3 py-2.5 md:py-2 rounded-lg text-sm font-medium transition-colors ${
      active ? 'bg-ink-100 text-ink-900' : 'text-ink-500 hover:text-ink-800 hover:bg-ink-50'
    }`;

  return (
    <>
      <nav className="flex-1 py-4 px-3 space-y-5 overflow-y-auto">
        <div>
          <button onClick={() => go('/')} className={navBtn(path === '/')}>
            <Home className="w-4 h-4" />
            Home
          </button>
        </div>

        <div>
          <p className="px-3 mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-400">Your markets</p>
          <div className="space-y-0.5">
            {corridors.map((c) => {
              const pending = pendingFor(c.id);
              return (
                <button key={c.id} onClick={() => go(`/market/${c.id}`)} className={navBtn(path === `/market/${c.id}`)}>
                  <span className="w-4 text-[11px] font-mono font-semibold text-ink-400">{c.code}</span>
                  <span className="flex-1 text-left">{c.id === 'uk' ? 'UK' : 'UAE'}</span>
                  {c.kind === 'live' && pending === 0 && <span className="text-[11px] text-emerald-600">Live</span>}
                  {pending > 0 && (
                    <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-amber-500 text-white text-[11px] font-semibold flex items-center justify-center">
                      {pending}
                    </span>
                  )}
                </button>
              );
            })}
            {comingSoon.map((m) => (
              <div key={m.name} className="flex items-center gap-3 px-3 py-2 text-sm text-ink-400 cursor-default">
                <Lock className="w-3.5 h-3.5" />
                <span className="flex-1">{m.name === 'Singapore' ? 'Singapore' : 'US'}</span>
                <span className="text-[11px]">Soon</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="px-3 mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-400">About this work</p>
          <button onClick={() => go('/proposal')} className={navBtn(false)}>
            <FileText className="w-4 h-4" />
            Read the proposal
          </button>
        </div>
      </nav>

      <div className="py-3 px-3 border-t border-ink-200">
        <div className="flex items-center gap-2.5 px-3 py-2">
          <div className="w-7 h-7 rounded-full bg-ink-800 flex items-center justify-center text-white text-xs font-semibold">
            {author.initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-ink-900 truncate">{author.name}</p>
            <p className="text-xs text-ink-500 truncate">{author.title}</p>
          </div>
        </div>
      </div>
    </>
  );
}

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-7 h-7 rounded-lg bg-ink-900 flex items-center justify-center">
        <Compass className="w-4 h-4 text-white" />
      </div>
      <span className="text-[15px] font-bold text-ink-900 tracking-tight">Xeliport</span>
    </div>
  );
}

export function AppShell({ title, children }: { title: string; children: React.ReactNode }) {
  const { path, navigate } = useRouter();
  const { navOpen, setNavOpen } = useStore();
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    mainRef.current?.scrollTo(0, 0);
    setNavOpen(false);
  }, [path, setNavOpen]);

  return (
    <div className="flex h-screen overflow-hidden bg-ink-50">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 flex-shrink-0 flex-col bg-white border-r border-ink-200">
        <div className="h-14 flex items-center px-5 border-b border-ink-200">
          <Logo />
        </div>
        <Sidebar onNavigate={() => {}} />
      </aside>

      {/* Phone drawer */}
      {navOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-ink-900/30 animate-fade-in" onClick={() => setNavOpen(false)} />
          <aside className="relative w-72 max-w-[85%] h-full bg-white flex flex-col animate-slide-in shadow-card-hover">
            <div className="h-14 flex items-center justify-between px-5 border-b border-ink-200">
              <Logo />
              <button
                onClick={() => setNavOpen(false)}
                className="p-2 -mr-2 rounded-lg text-ink-500 hover:bg-ink-50"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <Sidebar onNavigate={() => setNavOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="h-14 flex-shrink-0 flex items-center justify-between gap-3 px-4 sm:px-6 bg-white border-b border-ink-200">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => setNavOpen(true)}
              className="md:hidden p-2 -ml-2 rounded-lg text-ink-600 hover:bg-ink-50"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-sm font-semibold text-ink-900 truncate">{title}</h1>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="hidden xl:inline-flex">
              <Chip tone="neutral">Prototype · mock data</Chip>
            </span>
            <ViewSwitch />
            <button
              onClick={() => navigate('/proposal')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-ink-700 border border-ink-200 rounded-lg hover:bg-ink-50 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              Proposal
            </button>
          </div>
        </header>

        <main ref={mainRef} className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-24 animate-fade-in">{children}</div>
        </main>
      </div>

      <DemoControls />
    </div>
  );
}

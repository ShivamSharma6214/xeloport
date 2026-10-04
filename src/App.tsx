import { RouterProvider, useRouter } from '@/router';
import { StoreProvider, useDecisions } from '@/store';
import { AppShell } from '@/components/AppShell';
import { Home } from '@/pages/Home';
import { Market } from '@/pages/Market';
import { DecisionPage } from '@/pages/Decision';
import { Ops } from '@/pages/Ops';
import { Proposal } from '@/pages/Proposal';
import { getCorridor } from '@/data/mockData';

function Routes() {
  const { path } = useRouter();
  const { get } = useDecisions();
  const parts = path.split('/').filter(Boolean);

  // The proposal is a standalone document, outside the product shell.
  if (parts[0] === 'proposal') return <Proposal />;

  let title = 'Home';
  let content: React.ReactNode = <Home />;

  if (parts[0] === 'market' && parts[1]) {
    const corridor = getCorridor(parts[1]);
    title = corridor ? corridor.name : 'Market';
    content = <Market corridorId={parts[1]} />;
  } else if (parts[0] === 'decision' && parts[1]) {
    title = get(parts[1]) ? 'Decision' : 'Not found';
    content = <DecisionPage decisionId={parts[1]} />;
  } else if (parts[0] === 'ops') {
    title = 'Xeliport team view';
    content = <Ops />;
  } else if (parts.length > 0) {
    title = 'Page not found';
    content = <p className="text-sm text-ink-500">Page not found.</p>;
  }

  return <AppShell title={title}>{content}</AppShell>;
}

export default function App() {
  return (
    <RouterProvider>
      <StoreProvider>
        <Routes />
      </StoreProvider>
    </RouterProvider>
  );
}

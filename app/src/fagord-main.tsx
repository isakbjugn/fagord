import { Navigate, Route, Routes, useLocation } from '@remix-run/react';
import { DictionaryPage } from '~/src/pages/dictionary-page/dictionary-page';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClientOnly } from 'remix-utils/client-only';
import { useState } from 'react';
import { PageAlert } from '~/src/components/page-alert/page-alert';
import { TermPage } from '~/src/pages/term-page/term-page';
import { NewTermPage } from '~/src/pages/new-term-page/new-term-page';

export default function App() {
  const { search } = useLocation();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            staleTime: 30 * 1000,
          },
        },
      }),
  );

  return (
    <ClientOnly fallback={null}>
      {() => (
        <QueryClientProvider client={queryClient}>
          <PageAlert />
          <Routes>
            <Route path="/termliste" element={<DictionaryPage />} />
            <Route path="/term/:termId" element={<TermPage />} />
            <Route path="/gammel/ny-term" element={<NewTermPage />} />
            <Route path="/gammel/ny-term/:term" element={<NewTermPage />} />
            <Route path="*" element={<Navigate to={{ pathname: '/hjem', search: search }} />} />
          </Routes>
        </QueryClientProvider>
      )}
    </ClientOnly>
  );
}

import { Navigate, Route, Routes, useLocation } from '@remix-run/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClientOnly } from 'remix-utils/client-only';
import { useState } from 'react';
import { PageAlert } from '~/src/components/page-alert/page-alert';

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
            <Route path="*" element={<Navigate to={{ pathname: '/hjem', search: search }} />} />
          </Routes>
        </QueryClientProvider>
      )}
    </ClientOnly>
  );
}

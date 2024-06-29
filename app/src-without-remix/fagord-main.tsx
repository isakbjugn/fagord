import { Route, Routes } from '@remix-run/react';
import { ContactPage } from '~/src-without-remix/pages/contact-page/contact-page';
import { AboutPage } from '~/src-without-remix/pages/about-page/about-page';
import Termliste from '~/src-without-remix/pages/dictionary-page/dictionary-page';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 30 * 1000,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/termliste" element={<Termliste />} />
        <Route path="/om-oss" element={<AboutPage />} />
        <Route path="/kontakt" element={<ContactPage />} />
      </Routes>
    </QueryClientProvider>
  );
}
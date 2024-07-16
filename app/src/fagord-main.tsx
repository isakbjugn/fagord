import { Navigate, Route, Routes } from '@remix-run/react';
import { ContactPage } from '~/src/pages/contact-page/contact-page';
import { AboutPage } from '~/src/pages/about-page/about-page';
import { DictionaryPage } from '~/src/pages/dictionary-page/dictionary-page';
import { ArticlePage } from '~/src/pages/article-page/article-page';
import { Article } from '~/src/pages/article-page/article/article';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { featureToggles } from '~/src/utils/feature-toggles.client';
import { Header } from '~/src/components/header/header';
import { ClientOnly } from 'remix-utils/client-only';
import { useState } from 'react';
import { HomePage } from '~/src/pages/home-page/home-page';
import { PageAlert } from '~/src/components/page-alert/page-alert';
import { TermPage } from '~/src/pages/term-page/term-page';
import { NewTermPage } from '~/src/pages/new-term-page/new-term-page';

export default function App() {
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
          <Header />
          <PageAlert />
          <Routes>
            <Route path="/hjem" element={<HomePage />} />
            {featureToggles('articles') && (
              <Route path="/artikler" element={<ArticlePage />}>
                <Route path=":articleKey" element={<Article />} />
              </Route>
            )}
            <Route path="/termliste" element={<DictionaryPage />} />
            <Route path="/term/:termId" element={<TermPage />} />
            <Route path="/ny-term" element={<NewTermPage />} />
            <Route path="/ny-term/:term" element={<NewTermPage />} />
            <Route path="/om-oss" element={<AboutPage />} />
            <Route path="/kontakt" element={<ContactPage />} />
            <Route path="*" element={<Navigate to="/hjem" replace />} />
          </Routes>
        </QueryClientProvider>
      )}
    </ClientOnly>
  );
}

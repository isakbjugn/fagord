import { useQueryClient } from '@tanstack/react-query';
import { Navigate, Route, Routes } from 'react-router-dom';

import { Footer } from '../components/footer/footer';
import { Header } from '../components/header/header';
import { PageAlert } from '../components/page-alert/page-alert';
import { fetchTerms } from '../lib/fetch';
import { featureToggles } from '../utils/feature-toggles';
import { AboutPage } from './about-page/about-page';
import { Article } from './article-page/article/article';
import { ArticlePage } from './article-page/article-page';
import { ContactPage } from './contact-page/contact-page';
import { DictionaryPage } from './dictionary-page/dictionary-page';
import { HomePage } from './home-page/home-page';
import { NewTermPage } from './new-term-page/new-term-page';
import { TermPage } from './term-page/term-page';

export const Router = () => {
  const queryClient = useQueryClient();
  void queryClient.prefetchQuery({ queryKey: ['dictionary'], queryFn: fetchTerms });

  return (
    <>
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
      <Footer />
    </>
  );
};

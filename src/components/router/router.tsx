import { useQueryClient } from '@tanstack/react-query';
import { Navigate, Route, Routes } from 'react-router-dom';

import { fetchTerms } from '../../lib/fetch';
import { AboutPage } from '../about-page/about-page';
import { Article } from '../article-page/article/article';
import { ArticlePage } from '../article-page/article-page';
import { Footer } from '../common/footer/footer';
import { Header } from '../common/header/header';
import { ContactPage } from '../contact-page/contact-page';
import { DictionaryPage } from '../dictionary-page/dictionary-page';
import { Home } from '../home-page/home-page';
import { NewTermPage } from '../new-term-page/new-term-page';
import { TermPage } from '../term-page/term-page';

export const Router = (): JSX.Element => {
  const queryClient = useQueryClient();
  void queryClient.prefetchQuery(['dictionary'], fetchTerms);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/hjem" element={<Home />} />
        <Route path="/artikkel" element={<ArticlePage />}>
          <Route path=":articleKey" element={<Article />} />
        </Route>
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

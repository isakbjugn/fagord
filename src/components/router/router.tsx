import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../home-page/home-page';
import Header from '../common/header/header';
import DictionaryPage from '../dictionary-page/dictionary-page';
import TermPage from '../term-page/term-page';
import Footer from '../common/footer/footer';
import NewTermPage from '../new-term-page/new-term-page';
import { useQueryClient } from '@tanstack/react-query';
import { fetchTerms } from '../../lib/fetch';
import { ArticlePage } from '../article-page/article-page';
import { Article } from '../article-page/article/article';
import { AboutPage } from '../about-page/about-page';

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
        <Route path="*" element={<Navigate to="/hjem" replace />} />
      </Routes>
      <Footer />
    </>
  );
};

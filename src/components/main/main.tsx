import { Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Home from '../home-page/home-page';
import Header from '../common/header/header';
import DictionaryPage from '../dictionary-page/dictionary-page';
import TermPage from '../term-page/term-page';
import Footer from '../common/footer/footer';
import styles from './main.module.css';
import NewTermPage from '../new-term-page/new-term-page';
import { useQueryClient } from 'react-query';
import { fetchTerms } from '../../lib/fetch';

function Redirect({ to }: any) {
  let navigate = useNavigate();
  useEffect(() => {
    navigate(to);
  });
  return null;
}

const Main = () => {
  const queryClient = useQueryClient();
  queryClient.prefetchQuery('dictionary', fetchTerms);

  return (
    <div className={styles.wrapper}>
      <Header />
      <Routes>
        <Route path="/hjem" element={<Home />} />
        <Route path="/termliste" element={<DictionaryPage />} />
        <Route path="/term/:termId" element={<TermPage />} />
        <Route path="/ny-term" element={<NewTermPage />} />
        <Route path="/ny-term/:term" element={<NewTermPage />} />
        <Route path="" element={<Redirect to="/hjem" />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default Main;

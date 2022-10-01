import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react'
import Home from '../home-page/home-page';
import Header from '../common/header/header'
import TermList from '../term-list-page/term-list'
import TermPage from '../term-page/term-page'
import { Term } from "../../types/term"
import Footer from '../common/footer/footer'
import styles from "./main.module.css"
import useDictionary from '../utils/use-dictionary'
import Loader from '../common/loader/loader'
import NewTermPage from '../new-term-page/new-term-page'

function Redirect({ to }: any) {
  let navigate = useNavigate();
  useEffect(() => {
    navigate(to);
  });
  return null;
}

const Main = () => {

  const dictionary = useDictionary();

  const RenderTermPage = () => {
    let { termId } = useParams();
    if (dictionary.isLoading) return <Loader/>;
    if (dictionary.error) return <p>Kunne ikke laste side.</p>;
    return (
      <TermPage term={dictionary.data.filter((someTerm: Term) => someTerm._id === termId)[0]} />
    )
  }
    
  return (
    <div className={styles.wrapper}>
      <Header/>
      <Routes>
        <Route path="/hjem" element={<Home/>} />
        <Route path="/termliste" element={<TermList dictionary={dictionary.data} />} />
        <Route path="/term/:termId" element={<RenderTermPage />} />
        <Route path="/ny-term" element={<NewTermPage />} />
        <Route path="/ny-term/:term" element={<NewTermPage />} />
        <Route path="" element={<Redirect to="/hjem" />} />
      </Routes>
      <Footer/>
    </div>
  )
}

export default Main;
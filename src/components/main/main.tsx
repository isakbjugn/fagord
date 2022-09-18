import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react'
import Home from '../home-page/home-page';
import Header from '../header/header'
import TermList from '../termlist-page/term-list'
import TermPage from '../term-page/term-page'
import { Term } from "../../types/term"
import Footer from '../footer/footer'
import styles from "./main.module.css"
import useDictionary from '../utils/use-dictionary'
import Loader from '../loader/loader'

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
    let { term } = useParams();
    if (dictionary.isLoading) return <Loader/>;
    if (dictionary.error) return <p>Kunne ikke laste side.</p>;
    return (
      <TermPage term={dictionary.data.filter((someTerm: Term) => someTerm.en === term)[0]} />
    )
  }
    
  return (
    <div className={styles.wrapper}>
      <Header/>
      <Routes>
        <Route path="/hjem" element={<Home/>} />
        <Route path="/termliste" element={<TermList dictionary={dictionary.data} />} />
        <Route path="/termliste/:term" element={<RenderTermPage />} />
        <Route path="" element={<Redirect to="/hjem" />} />
      </Routes>
      <Footer/>
    </div>
  )
}

export default Main;
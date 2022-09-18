import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react'
import Home from '../home-page/home-page';
import Header from '../header/header'
import TermList from '../termlist-page/term-list'
import TermPage from '../term-page/term-page'
import { Term } from "../../types/term"
import { fetchTerms } from '../../lib/fetch'
import Footer from '../footer/footer'
import styles from "./main.module.css"

function Redirect({ to }: any) {
  let navigate = useNavigate();
  useEffect(() => {
    navigate(to);
  });
  return null;
}

const Main = () => {

  const [dictionary, setDictionary] = useState<Term[]>([]);

  useEffect(() => {
    fetchTerms()
    .then((terms) => {
      setDictionary(terms)
    });
  }, [])

  const RenderTermPage = () => {
    let { term } = useParams();
    return (
      <TermPage term={dictionary.filter((someTerm: Term) => someTerm.en === term)[0]} />
    )
  }
    
  return (
    <div className={styles.wrapper}>
      <Header/>
      <Routes>
        <Route path="/hjem" element={<Home/>} />
        <Route path="/termliste" element={<TermList dictionary={dictionary} />} />
        <Route path="/termliste/:term" element={<RenderTermPage />} />
        <Route path="" element={<Redirect to="/hjem" />} />
      </Routes>
      <Footer/>
    </div>
  )
}

export default Main;
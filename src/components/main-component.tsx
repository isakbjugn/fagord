import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react'
import Home from './home-page';
import Header from './header-component'
import TermList from './termlist-page/term-list'
import TermPage from './termlist-page/term-page'
import { Term } from "../types/term"
import { fetchTerms } from '../lib/fetch'

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
    <div style={{backgroundColor: "#2E9CCA", color: "white"}}>
      <Header/>
      <Routes>
        <Route path="/hjem" element={<Home/>} />
        <Route path="/termliste" element={<TermList dictionary={dictionary} />}>
          <Route path=":term" element={<RenderTermPage />} />
        </Route>
        <Route path="" element={<Redirect to="/hjem" />} />
      </Routes>
    </div>
  )
}

export default Main;
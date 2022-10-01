import { useCallback, useState } from "react"
import { Link } from "react-router-dom"
import { Table } from "reactstrap"
import { Term } from "../../types/term"
import Loader from "../common/loader/loader"
import Paginator from "../common/paginator/paginator"
import TermComponent from "../common/term-component/term-component"
import TermEntry from "./term-entry"
import styles from "./term-list.module.css"

interface TermListProps {
  dictionary: Term[];
}

const TermList = ({dictionary = []}: TermListProps)  => {
  const [selectedTerm, setSelectedTerm] = useState<Term>();
  const [dictionaryView, setDictionaryView] = useState<Term[]>([]);
  const pageSize = 10;

  const onPageChange = useCallback(
    (page: number) => {
    setDictionaryView(dictionary.slice(page*pageSize, (page+1)*pageSize)
  )}, [dictionary]);

  if (dictionary.length === 0) return <Loader />;

  const selectTerm = (selectedId: string) => {
    setSelectedTerm(dictionary.filter(term => term._id === selectedId)[0]);
  }
  
  return (
    <div className="container-sm my-2">
      <div className="col-12 col-lg-10 mx-auto">
        <Table hover className={"table-light text-break " + styles.table} striped>
          <thead>
            <tr>
              <th>Engelsk</th>
              <th>Bokmål</th>
              <th>Nynorsk</th>
            </tr>
          </thead>
          <tbody>
            {dictionaryView.map((term: Term) =>
              <TermEntry term={term} key={term._id} onSelect={selectTerm} />
            )}
          </tbody>
        </Table>
        <Paginator onPageChange={onPageChange} pageSize={pageSize} tableLength={dictionary.length} />
        {selectedTerm && (
          <div>
            <TermComponent term={selectedTerm} />
            <div className="col text-center my-2" >
              <Link className="btn btn-outline-light btn-lg" to={"/term/" + selectedTerm._id} role="button">Til termside</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TermList;

import { useCallback, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Table } from "reactstrap"
import { Term } from "../../../types/term"
import Paginator from "../../common/paginator/paginator"
import TermComponent from "../../common/term-component/term-component"
import useToggle from "../../utils/use-toggle"
import TermEntry from "../term-entry/term-entry"
import styles from "./term-list.module.css"

interface TermListProps {
  dictionary: Term[];
}

const TermList = ({dictionary = []}: TermListProps)  => {
  const [selectedTermId, setSelectedTermId] = useState<string>();
  const [resetPage, toggleResetPage] = useToggle(false);
  const [dictionaryView, setDictionaryView] = useState<Term[]>([]);
  const pageSize = 10;

  const onPageChange = useCallback(
    (page: number) => {
    setDictionaryView(dictionary.slice(page*pageSize, (page+1)*pageSize)
  )}, [dictionary]);

  useEffect(() => {
    toggleResetPage();
  }, [dictionary.length, toggleResetPage])
  
  return (
    <>
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
            <TermEntry term={term} key={term._id} onSelect={setSelectedTermId} />
          )}
        </tbody>
      </Table>
      <Paginator onPageChange={onPageChange} pageSize={pageSize} tableLength={dictionary.length} resetPaginator={resetPage} />
      {selectedTermId && (
        <div>
          <TermComponent term={dictionary.filter(term => term._id === selectedTermId)[0]} />
          <div className="col text-center my-2" >
            <Link className="btn btn-outline-light btn-lg" to={"/term/" + selectedTermId} role="button">Til termside</Link>
          </div>
        </div>
      )}
    </>
  )
}

export default TermList;

import { useState } from "react"
import { Link } from "react-router-dom"
import { Table } from "reactstrap"
import { Term } from "../../types/term"
import Loader from "../loader/loader"
import TermComponent from "../term-component/term-component"
import TermEntry from "./term-entry"

interface TermListProps {
  dictionary: Term[];
}

const TermList = ({dictionary = []}: TermListProps)  => {

  const [selectedTerm, setSelectedTerm] = useState<Term>();

  if (dictionary.length === 0) return <Loader />;

  const selectTerm = (selectedId: string) => {
    setSelectedTerm(dictionary.filter(term => term._id === selectedId)[0]);
  }
  
  return (
    <>
      <div className="container-sm my-2">
        <div className="col-12 col-lg-10 mx-auto">
          <Table hover className="table-light" striped>
            <thead>
              <tr>
                <th>
                  Engelsk
                </th>
                <th>
                  Bokmål
                </th>
                <th>
                  Nynorsk
                </th>
              </tr>
            </thead>
            <tbody>
              {dictionary.map((term: Term) =>
                <TermEntry term={term} key={term._id} onSelect={selectTerm} />
              )}
            </tbody>
          </Table>
          {selectedTerm && (
            <div>
              <TermComponent term={selectedTerm} />
              <div className="col text-center my-2" >
                <Link className="btn btn-outline-light btn-lg" to={"/termliste/" + selectedTerm.en} role="button">Til termside</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default TermList;

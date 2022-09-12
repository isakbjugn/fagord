import { Outlet } from "react-router-dom"
import { Table } from "reactstrap"
import { Term } from "../../types/term"
import Loader from "../loader/loader"
import TermEntry from "./term-entry"

const TermList = ({dictionary = []}: PropsType) => {

  if (dictionary.length === 0) return <Loader />
  
  return (
    <>
      <div className="container-sm mt-2">
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
                <TermEntry term={term} key={term.id} />
              )}
            </tbody>
          </Table>
        </div>
      </div>
      <Outlet/>
    </>
  )
}

interface PropsType {
  dictionary: Term[];
}

export default TermList;

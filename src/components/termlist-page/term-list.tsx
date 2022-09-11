import { Outlet } from "react-router-dom"
import { Table } from "reactstrap"
import { Term } from "../../types/term"
import TermEntry from "./term-entry"

const TermList = ({termList}: PropsType) => {
  
  return (
    <>
      <div className="container m-2">
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
            {termList.map((term: Term) =>
              <TermEntry term={term} key={term.id} />
            )}
          </tbody>
        </Table>
      </div>
      <Outlet/>
    </>
  )
}

interface PropsType {
  termList: Term[]
}

export default TermList;

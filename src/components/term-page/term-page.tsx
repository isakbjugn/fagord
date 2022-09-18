import { Link } from "react-router-dom";
import { Term } from "../../types/term"
import {
  Breadcrumb,
  BreadcrumbItem,
} from "reactstrap";
import TermComponent from "../term-component/term-component"
import Loader from "../loader/loader"

const TermPage = ({term}: PropsType) => {
  if (!term) return <Loader/>
  return (
    <div className="container my-3">
      <div className="col-12 col-lg-10 mx-auto ">
        <div className="row" style={{color: "white"}}>
          <Breadcrumb>
            <BreadcrumbItem>
              <Link to="/termliste">Termliste</Link>
            </BreadcrumbItem>
            <BreadcrumbItem active>{term.en}</BreadcrumbItem>
          </Breadcrumb>
        </div>
        <TermComponent term={term}/>
      </div>
    </div>
  );
}

interface PropsType {
  term: Term
}

export default TermPage;
import { Link } from "react-router-dom";
import { Term } from "../../../types/term"
import {
  Breadcrumb,
  BreadcrumbItem,
} from "reactstrap";
import styles from "./term-page.module.css";
import TermComponent from "../term-component/term-component"

const TermPage = ({term}: PropsType) => {
  return (
    <div className="container">
      <div className={"col-12 col-lg-10 mx-auto " + styles.wrapper}>
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
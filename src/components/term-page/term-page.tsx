import { Link } from "react-router-dom";
import { Term } from "../../types/term"
import {
  Breadcrumb,
  BreadcrumbItem,
} from "reactstrap";
import TermComponent from "../common/term-component/term-component"
import InfoMessage from "../common/info-message/info-message"
import VariantCloud from "./variant-cloud/variant-cloud"

const TermPage = ({term}: PropsType) => {

  if (!term) return (
    <InfoMessage>
      <p>Termen finnes ikke enda!</p>
    </InfoMessage>
  )

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
        <VariantCloud termId={term._id} variants={term.variants} />
      </div>
    </div>
  );
}

interface PropsType {
  term: Term
}

export default TermPage;
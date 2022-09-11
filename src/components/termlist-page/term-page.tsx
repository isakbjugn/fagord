import { Link } from "react-router-dom";
import { Term } from "../../types/term"
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Card,
  CardBody,
  CardText,
  CardTitle,
} from "reactstrap";

const TermPage = ({term}: PropsType) => {
  return (
    <div className="container">
      <div className="row" style={{color: "white"}}>
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to="/termliste">Termliste</Link>
          </BreadcrumbItem>
          <BreadcrumbItem active>{term.en}</BreadcrumbItem>
        </Breadcrumb>
        <div className="col-12">
          <h1 className="display-5" style={{display: "inline"}}><em><strong>{term.en}</strong></em></h1>
          <h2 className="display-5" style={{display: "inline"}}> ({term.subfield})</h2>
          <hr />
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-md-5 m-1">
          {term.definition}
        </div>
        <div className="col-12 col-md-5 m-1">
          <Card className="translation-card">
            <CardBody>
              <CardTitle tag="h5">Oversettelse</CardTitle>
              <CardText>Engelsk: <em>{term.en}</em></CardText>
              <CardText>Bokmål: <em>{term.nb}</em></CardText>
              <CardText>Nynorsk: <em>{term.nn}</em></CardText>
              <Button>Foreslå ny term</Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

interface PropsType {
  term: Term
}

export default TermPage;
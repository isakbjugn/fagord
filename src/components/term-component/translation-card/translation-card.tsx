import { Term } from "../../../types/term"
import {
  Button,
  Card,
  CardBody,
  CardText,
  CardTitle,
} from "reactstrap";
import styles from "./translation-card.module.css";

interface TranslationCardProps {
  term: Term;
}

const TranslationCard = ({term}: TranslationCardProps) =>
  <Card className={styles.card}>
    <CardBody>
      <CardTitle tag="h5">Oversettelse</CardTitle>
      <CardText>Engelsk: <em>{term.en}</em></CardText>
      <CardText>Bokmål: <em>{term.nb}</em></CardText>
      <CardText>Nynorsk: <em>{term.nn}</em></CardText>
      <Button>Foreslå ny term</Button>
    </CardBody>
  </Card>

export default TranslationCard;
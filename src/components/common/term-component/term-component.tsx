import { Term } from "../../../types/term"
import TranslationCard from "./translation-card/translation-card"

interface TermComponentProps {
  term: Term;
}

const TermComponent = ({term}: TermComponentProps) => {

  const fieldSpec = (term.subfield) ? term.subfield : term.field;
  const fieldSpecStr = (fieldSpec) ? " (" + fieldSpec + ")" : "";

  return (
    <div>
      <div className="row">
        <h1>{term.en} {fieldSpecStr}</h1>
        <hr />
      </div>
      <div className="row">
        <div className="col-12 col-md-6">
          {term.definition}
        </div>
        <div className="col-8 col-sm-8 col-md-6 mt-2">
          <TranslationCard term={term} />
        </div>
      </div>
    </div>
  )
}

export default TermComponent;
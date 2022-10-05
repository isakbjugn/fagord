import { Term } from "../../../types/term"
import Definition from "./definition/definition"
import TranslationCard from "./translation-card/translation-card"

interface TermComponentProps {
  term: Term;
}

const TermComponent = ({term}: TermComponentProps) => {

  if (!term) return null;

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
          <Definition termId={term._id} definition={term.definition} />
        </div>
        <div className="col-8 col-sm-8 col-md-6 mt-2">
          <TranslationCard term={term} />
        </div>
      </div>
    </div>
  )
}

export default TermComponent;
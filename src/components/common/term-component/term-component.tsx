import { Term } from "../../../types/term"
import TranslationCard from "./translation-card/translation-card"

interface TermComponentProps {
  term: Term;
}

const TermComponent = ({term}: TermComponentProps) => {
  return (
    <div>
      <div className="row">
        <h1><em>{term.en}</em> ({term.subfield})</h1>
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
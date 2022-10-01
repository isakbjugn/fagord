import { Term } from "../../types/term"

interface TermEntryProps {
  term: Term;
  onSelect: (id: string) => void;
}

const TermEntry = ({term, onSelect}: TermEntryProps) => {

  const handleClick = () => {
    onSelect(term._id);
  }

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') onSelect(term._id);
  }

  return (
    <tr onClick={handleClick}>
      <td tabIndex={0} onKeyDown={handleKeyDown}>
        {term.en}
      </td>
      <td tabIndex={0} onKeyDown={handleKeyDown}>
        {term.nb}
      </td>
      <td tabIndex={0} onKeyDown={handleKeyDown}>
        {term.nn}
      </td>
    </tr>
  )
}

export default TermEntry;
import { Term } from "../../types/term"
import { useNavigate } from "react-router-dom";

const TermEntry = ({term}: PropsType) => {
  let navigate = useNavigate();
  const handleClick = () => {
    navigate("/termliste/" + term.en.replace(" ", "_"))
  }

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter')
    navigate("/termliste/" + term.en.replace(" ", "_"))
  }

  return (
    <tr onClick={handleClick}>
      <th scope="row" tabIndex={0} onKeyDown={handleKeyDown}>
        {term.en}
      </th>
      <td tabIndex={0} onKeyDown={handleKeyDown}>
        {term.nb}
      </td>
      <td tabIndex={0} onKeyDown={handleKeyDown}>
        {term.nn}
      </td>
    </tr>
  )
}

interface PropsType {
  term: Term,
}

export default TermEntry;
import { Term } from "../../types/term"
import { useNavigate } from "react-router-dom";

const TermEntry = ({term}: PropsType) => {
  let navigate = useNavigate();
  const handleClick = () => {
    navigate("/termliste/" + term.en.replace(" ", "_"))
  }

  return (
    <tr onClick={handleClick}>
      <th scope="row">
        {term.en}
      </th>
      <td>
        {term.nb}
      </td>
      <td>
        {term.nn}
      </td>
    </tr>
  )
}

interface PropsType {
  term: Term,
}

export default TermEntry;
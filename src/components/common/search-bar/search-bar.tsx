import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Select from "react-select"
import { Button } from "reactstrap"
import { Term } from "../../../types/term"
import useDictionary from "../../utils/use-dictionary"
import styles from "./search-bar.module.css";

const SearchBar = () => {

  const [input, setInput] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const dictionary = useDictionary();
  let navigate = useNavigate();

  const options = (!dictionary.isLoading && !dictionary.error)
    ? dictionary.data
    : [];

  const openTermPage = (selected: any) => {
    navigate("/term/" + selected._id);
  }

  const SearchIcon = () => <div className="container mr-1"><span className="fa fa-search"></span></div>

  const selectStyles = {
    menuList: (styles: any) => {
      return {
        ...styles,
        maxHeight: 250
      };
    }
  };

  return (
    <div className={styles.search}>
      <Select
        value={null}
        menuIsOpen={menuOpen}
        className={styles.input}
        placeholder='Finn en term'
        components={{ DropdownIndicator: SearchIcon, IndicatorSeparator: null }}
        onChange={openTermPage}
        onInputChange={(str) => {
          setMenuOpen(!!str)
          setInput(str)
        }}
        options={options}
        getOptionLabel={(option: Term) => option.en}
        getOptionValue={(option: Term) => option._id}
        noOptionsMessage={() => <Button outline onClick={() => {
          setMenuOpen(false);
          navigate("/ny-term/" + input)
        }}>Legg til term</Button>}
        styles={selectStyles}
      />
    </div>
  )
}

export default SearchBar;
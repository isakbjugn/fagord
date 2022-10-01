import { useNavigate } from "react-router-dom"
import Select from "react-select"
import { Term } from "../../../types/term"
import useDictionary from "../../utils/use-dictionary"
import styles from "./search-bar.module.css";

const SearchBar = () => {

  const dictionary = useDictionary();
  let navigate = useNavigate();

  const options = (!dictionary.isLoading && !dictionary.error)
    ? dictionary.data
    : [];

  const openTermPage = (selected: any) => {
    navigate("/term/" + selected.en.replace(" ", "_"));
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
        placeholder='Søk'
        components={{ DropdownIndicator: SearchIcon, IndicatorSeparator: null }}
        onChange={openTermPage}
        options={options}
        getOptionLabel={(option: Term) => option.en}
        getOptionValue={(option: Term) => option._id}
        noOptionsMessage={() => 'Ingen termer samsvarer'}
        styles={selectStyles}
      />
    </div>
  )
}

export default SearchBar;
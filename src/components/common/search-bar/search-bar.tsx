import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { Button } from 'reactstrap';
import type { Term } from '../../../types/term';
import useDictionary from '../../utils/use-dictionary';
import styles from './search-bar.module.css';

const SearchBar = (): JSX.Element => {
  const [input, setInput] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const {
    isLoading: dictionaryLoading,
    isError: dictionaryError,
    data: dictionary,
  } = useDictionary();
  const navigate = useNavigate();

  const options = !dictionaryLoading && !dictionaryError ? dictionary : [];

  const openTermPage = (selected: any): void => {
    navigate('/term/' + (selected._id as string));
  };

  const SearchIcon = (): JSX.Element => (
    <div className="container mr-1">
      <span className="fa fa-search"></span>
    </div>
  );

  const selectStyles = {
    menuList: (styles: any) => {
      return {
        ...styles,
        maxHeight: 250,
      };
    },
  };

  return (
    <div className={styles.search}>
      <Select
        value={null}
        menuIsOpen={menuOpen}
        className={styles.input}
        placeholder="Finn en term"
        components={{ DropdownIndicator: SearchIcon, IndicatorSeparator: null }}
        onChange={openTermPage}
        onInputChange={(str: string) => {
          setMenuOpen(str !== '');
          setInput(str);
        }}
        options={options}
        getOptionLabel={(option: Term) => option.en}
        getOptionValue={(option: Term) => option._id}
        noOptionsMessage={() => (
          <Button
            outline
            onClick={() => {
              setMenuOpen(false);
              navigate('/ny-term/' + input);
            }}
          >
            Legg til term
          </Button>
        )}
        styles={selectStyles}
      />
    </div>
  );
};

export default SearchBar;

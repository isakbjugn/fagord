import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { SelectInstance, SingleValue } from 'react-select';
import AsyncSelect from 'react-select/async';
import { Button } from 'reactstrap';

import type { Term } from '../../types/term';
import { useDictionary } from '../../utils/use-dictionary';
import style from './search-bar.module.css';

const formatOptionLabel = (term: Term) => (
  <div>
    <div className={style['item-title']}>{term.en}</div>
    <div className={style['item-subtitle']}>
      {term.nb && <span>{term.nb}</span>}
      {term.nb && term.nn && <span>/</span>}
      {term.nn && <span>{term.nn}</span>}
    </div>
  </div>
);

export const SearchBar = (): JSX.Element => {
  const selectRef = useRef<SelectInstance<Term> | null>(null);
  const [input, setInput] = useState('');

  const dictionaryQuery = useDictionary();
  const navigate = useNavigate();

  const options = !dictionaryQuery.isPending && !dictionaryQuery.isError ? dictionaryQuery.data : [];

  const filterOptions = (input: string) =>
    options
      .filter(
        (term) =>
          term.en.toLowerCase().includes(input) ||
          term.nb.toLowerCase().includes(input) ||
          term.nn.toLowerCase().includes(input),
      )
      .slice(0, 5);

  const loadOptions = (input: string, callback: (options: Term[]) => void) => {
    setTimeout(() => {
      callback(filterOptions(input.toLowerCase()));
    }, 1000);
  };

  const openTermPage = (selected?: SingleValue<Term>): void => {
    if (selected) {
      setInput('');
      navigate('/term/' + (selected._id as string));
    }
  };

  const noOptionsMessage = () => {
    if (dictionaryQuery.isPending) return <p>Laster termliste</p>;
    if (dictionaryQuery.isError) return <p>Kunne ikke laste termliste</p>;
    if (input === '') return null;
    return (
      <Button
        outline
        onClick={() => {
          selectRef.current?.blur();
          navigate('/ny-term/' + input);
          setInput('');
        }}
      >
        Opprett ny term
      </Button>
    );
  };

  const SearchIcon = (): JSX.Element => (
    <div className="container mr-1">
      <span className="fa fa-search"></span>
    </div>
  );

  return (
    <div className={style.search}>
      <AsyncSelect
        ref={selectRef}
        className={style.select}
        placeholder="Søk etter term"
        formatOptionLabel={formatOptionLabel}
        components={{
          DropdownIndicator: SearchIcon,
          IndicatorSeparator: null,
        }}
        maxMenuHeight={400}
        options={options}
        getOptionValue={(option: Term) => option._id}
        value={null}
        inputValue={input}
        onInputChange={(value, action) => {
          if (action.action === 'input-change') setInput(value);
        }}
        onChange={openTermPage}
        noOptionsMessage={noOptionsMessage}
        cacheOptions
        defaultOptions
        loadOptions={loadOptions}
        loadingMessage={() => 'Laster...'}
      />
    </div>
  );
};

import { Suspense, useRef, useState } from 'react';
import { Await, useNavigate, useRouteLoaderData } from '@remix-run/react';
import type { SelectInstance, SingleValue } from 'react-select';
import AsyncSelect from 'react-select/async';
import { Button } from 'reactstrap';

import type { Term } from '~/types/term';
import style from './search-bar.module.css';
import { Spinner } from '../spinner/spinner';
import type { loader } from '~/root';

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

export const SearchBar = () => {
  const selectRef = useRef<SelectInstance<Term> | null>(null);
  const [input, setInput] = useState('');
  const { terms } = useRouteLoaderData<typeof loader>('root');
  const navigate = useNavigate();

  const filterOptions = (terms: Term[], input: string) =>
    input === ''
      ? []
      : terms
          .filter(
            (term: Term) =>
              term.en.toLowerCase().includes(input) ||
              term.nb.toLowerCase().includes(input) ||
              term.nn.toLowerCase().includes(input),
          )
          .slice(0, 5);

  const loadOptions = (input: string, callback: (options: Term[]) => void, terms: Term[]) => {
    setTimeout(() => {
      callback(filterOptions(terms, input.toLowerCase()));
    }, 1000);
  };

  const openTermPage = (selected?: SingleValue<Term>): void => {
    if (selected) {
      setInput('');
      navigate('/term/' + (selected._id as string));
    }
  };

  const noOptionsMessage = () => {
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

  const SearchIcon = () => (
    <div className="container mr-1">
      <span className="fa fa-search"></span>
    </div>
  );

  return (
    <div className={style.search}>
      <Suspense fallback={<Spinner />}>
        <Await resolve={terms}>
          {(terms) => (
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
              options={terms}
              getOptionValue={(option: Term) => option._id}
              value={null}
              inputValue={input}
              onInputChange={(value, action) => {
                console.log('AsyncSelect: ', value);
                if (action.action === 'input-change') setInput(value);
              }}
              onChange={openTermPage}
              noOptionsMessage={noOptionsMessage}
              cacheOptions
              defaultOptions
              loadOptions={(input, callback) => {
                loadOptions(input, callback, terms);
              }}
              loadingMessage={() => 'Laster...'}
            />
          )}
        </Await>
      </Suspense>
    </div>
  );
};

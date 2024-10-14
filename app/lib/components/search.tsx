import { Await, Form, Link, useLoaderData, useLocation, useNavigation } from '@remix-run/react';
import { useDebounceSubmit } from 'remix-utils/use-debounce-submit';
import type { loader as rootLoader } from '~/root';
import type { Term } from '~/types/term';
import { Suspense, useEffect, useState } from 'react';
import styles from '~/styles/search.module.css';
import { Button } from 'reactstrap';

export function Search() {
  const { q, searchResult } = useLoaderData<typeof rootLoader>();
  const [resultsOpen, setResultsOpen] = useState(false);
  const location = useLocation();
  const navigation = useNavigation();
  const submit = useDebounceSubmit();
  const searching = navigation.location && new URLSearchParams(navigation.location.search).has('q');

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (window.document.getElementById('search-form')?.contains(event.target as Node)) {
        setResultsOpen(true);
      } else {
        setResultsOpen(false);
      }
    }

    window.addEventListener('click', handleClick);

    return () => window.removeEventListener('click', handleClick);
  });

  useEffect(() => {
    const searchField = document.getElementById('q');
    if (searchField instanceof HTMLInputElement) {
      searchField.value = q || '';
    }
  }, [q]);

  return (
    <div className={styles.wrapper}>
      <Form
        id="search-form"
        role="search"
        action={location.pathname}
        onChange={(event) => {
          const isFirstSearch = q === null;
          submit(event.currentTarget, {
            replace: !isFirstSearch,
            debounceTimeout: 200,
          });
        }}
      >
        <input
          id="q"
          defaultValue={q || ''}
          placeholder="Søk etter term"
          type="search"
          name="q"
          className={`${styles.search} ${searching ? styles.loading : ''}`}
        />
        <div className={styles.spinner} aria-hidden hidden={!searching} />
      </Form>
      <Suspense fallback={null}>
        <Await resolve={searchResult}>
          {(terms) => (
            <nav className={styles.resultDropdown} hidden={!resultsOpen}>
              <ul className={styles.results}>
                {terms.map((term: Term) => (
                  <SearchResult term={term} key={term._id} />
                ))}
              </ul>
              <NoOptionsMessage q={q} />
            </nav>
          )}
        </Await>
      </Suspense>
    </div>
  );
}

function SearchResult({ term }: { term: Term }) {
  return (
    <li className={styles.item}>
      <Link to={`/term/${term._id}`} className={styles.itemLink}>
        <div className={styles.itemTitle}>{term.en}</div>
        <div className={styles.itemSubtitle}>
          {term.nb && <span>{term.nb}</span>}
          {term.nb && term.nn && <span>/</span>}
          {term.nn && <span>{term.nn}</span>}
        </div>
      </Link>
    </li>
  );
}

function NoOptionsMessage({ q }: { q: string | null }) {
  if (!q) return null;
  return (
    <Link to={`/ny-term/${q}`} className={styles.addButton}>
      <Button outline>Opprett ny term</Button>
    </Link>
  );
}

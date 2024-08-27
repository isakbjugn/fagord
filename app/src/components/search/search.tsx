import { Await, Form, Link, useLoaderData, useLocation, useNavigation, useSubmit } from '@remix-run/react';
import type { loader as rootLoader } from '~/root';
import type { Term } from '~/types/term';
import { Suspense, useEffect, useState } from 'react';
import styles from './search.module.css';
import { Button } from 'reactstrap';

export function Search() {
  const { terms, q } = useLoaderData<typeof rootLoader>();
  const [resultsOpen, setResultsOpen] = useState(false);
  const location = useLocation();
  const navigation = useNavigation();
  const submit = useSubmit();
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

  function filterTerms(terms: Term[], q: string) {
    if (!q) return [];
    return terms
      .filter(
        (term: Term) =>
          term.en.toLowerCase().includes(q) || term.nb.toLowerCase().includes(q) || term.nn.toLowerCase().includes(q),
      )
      .slice(0, 5);
  }

  useEffect(() => {
    const searchField = document.getElementById('q');
    if (searchField instanceof HTMLInputElement) {
      searchField.value = q || '';
    }
  }, [q]);

  const NoOptionsMessage = () => {
    if (!q) return null;
    return (
      <Link to={`/ny-term/${q}`} className={styles.addButton}>
        <Button outline>Opprett ny term</Button>
      </Link>
    );
  };

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
        <Await resolve={terms}>
          {(terms) => (
            <nav className={styles.resultDropdown} hidden={!resultsOpen}>
              <ul className={styles.results}>
                {filterTerms(terms, q).map((term: Term) => (
                  <SearchResult term={term} key={term._id} />
                ))}
              </ul>
              <NoOptionsMessage />
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

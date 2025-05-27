import { Form, Link, useLocation, useNavigation, useSearchParams } from '@remix-run/react';
import { type FormEvent, useEffect } from 'react';
import { Button } from 'reactstrap';

import styles from '~/styles/search.module.css';
import type { Term } from '~/types/term';
import { useDebounceFetcher } from 'remix-utils/use-debounce-fetcher';
import { useClickToOpen } from '~/lib/use-click-to-open';

export function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const resultsOpen = useClickToOpen('search-form', false);
  const location = useLocation();
  const navigation = useNavigation();
  const fetcher = useDebounceFetcher<{ searchResult: Term[] }>();
  const searching = navigation.location && new URLSearchParams(navigation.location.search).has('q');

  useEffect(() => {
    const searchField = document.getElementById('q');
    if (searchField instanceof HTMLInputElement) {
      searchField.value = searchParams.get('q') || '';
    }
  }, [searchParams]);

  function submitSearchTerm(event: FormEvent<HTMLFormElement>) {
    setSearchParams((prevParams) => {
      prevParams.set('q', (event.currentTarget as HTMLFormElement).q.value);
      return prevParams;
    });

    const formData = new FormData(event.currentTarget);
    fetcher.submit(formData, { method: 'post', action: '/api/termliste/søk', debounceTimeout: 200 });
  }

  return (
    <div className={styles.wrapper}>
      <Form
        id="search-form"
        role="search"
        action={location.pathname}
        onClick={submitSearchTerm}
        onChange={submitSearchTerm}
      >
        <input
          id="q"
          defaultValue={searchParams.get('q') ?? 'Søk etter term'}
          placeholder="Søk etter term"
          autoCapitalize="none"
          type="search"
          name="q"
          className={`${styles.search} ${searching ? styles.loading : ''}`}
        />
        <div className={styles.spinner} aria-hidden hidden={!searching} />
      </Form>
      {fetcher.data?.searchResult && (
        <nav className={styles.resultDropdown} hidden={!resultsOpen}>
          <ul className={styles.results}>
            {fetcher.data.searchResult.map((term: Term) => (
              <SearchResult term={term} key={term._id} />
            ))}
          </ul>
          <NoOptionsMessage q={searchParams.get('q')} />
        </nav>
      )}
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

function NoOptionsMessage({ q }: { q: string | null | undefined }) {
  if (!q) return null;
  return (
    <Link to={`/ny-term/${q}`} className={styles.addButton}>
      <Button outline>Opprett ny term</Button>
    </Link>
  );
}

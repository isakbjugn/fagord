import { Form, Link, useLocation, useNavigation, useSearchParams } from 'react-router';
import { type FormEvent } from 'react';

import styles from '~/styles/search.module.css';
import type { Term } from '~/types/term';
import { useClickToOpen } from '~/lib/use-click-to-open';
import { useDebounceFetcher } from '~/lib/use-debounce-fetcher';

export function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const resultsOpen = useClickToOpen('search-form', false);
  const location = useLocation();
  const navigation = useNavigation();
  const fetcher = useDebounceFetcher<{ searchResult: Term[] }>();
  const searching = navigation.location && new URLSearchParams(navigation.location.search).has('q');

  function submitSearchTerm(event: FormEvent<HTMLFormElement>) {
    const isFirstSearch = !searchParams.has('q');
    setSearchParams(
      (prevParams) => {
        prevParams.set('q', (event.currentTarget as HTMLFormElement).q.value);
        return prevParams;
      },
      { replace: !isFirstSearch },
    );

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
          defaultValue={searchParams.get('q') ?? undefined}
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
      <Link to={`/term/${term.slug}`} className={styles.itemLink}>
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
      <button className="btn btn-outline-secondary">Opprett ny term</button>
    </Link>
  );
}

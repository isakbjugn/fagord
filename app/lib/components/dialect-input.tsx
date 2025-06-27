import { useDebounceFetcher } from '~/lib/use-debounce-fetcher';

import type { DictionaryResponse } from '~/routes/api.ordbokene';
import style from '~/styles/dialect-input.module.css';

interface Props {
  name: string;
  dialect: 'nb' | 'nn';
}

export function DialectInput({ name, dialect }: Props) {
  const fetcher = useDebounceFetcher<DictionaryResponse>();

  function submitTerm(term: string) {
    const formData = new FormData();
    formData.append('term', term);
    formData.append('dialect', dialect);

    fetcher.submit(formData, { method: 'post', action: '/api/ordbokene', debounceTimeout: 200 });
  }

  function handleSuggestionClick(term: string | undefined) {
    if (term !== undefined) {
      const inputField = document.getElementById(name) as HTMLInputElement | null;
      if (inputField) {
        inputField.value = term;
        submitTerm(term);
      }
    }
  }

  return (
    <>
      <input
        id={name}
        name={name}
        className={'form-control' + (fetcher.data?.isValid ? ' is-valid' : '')}
        type="text"
        autoCapitalize="none"
        onChange={(event) => submitTerm(event.target.value)}
      />
      <div className="valid-feedback bright-feedback-text">{fetcher.data?.validationText}</div>
      {fetcher.data?.suggestion && (
        <div className={style.suggestionFeedback}>
          Mente du{' '}
          <button
            type="button"
            className={style.inlineButton}
            onClick={() => handleSuggestionClick(fetcher.data?.suggestion)}
          >
            {fetcher.data?.suggestion}
          </button>
          ?
        </div>
      )}
    </>
  );
}

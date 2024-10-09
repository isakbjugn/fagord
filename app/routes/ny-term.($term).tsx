import style from '~/styles/ny-term.module.css';
import { Form, useLoaderData, useNavigation } from '@remix-run/react';
import { json } from '@remix-run/node';
import type { LoaderFunction, LoaderFunctionArgs } from '@remix-run/node';
import { Button, Label, Row } from 'reactstrap';
import { useDebounceFetcher } from 'remix-utils/use-debounce-fetcher';
import type { DictionaryResponse } from '~/routes/api.ordbokene';

export const loader: LoaderFunction = ({ params }: LoaderFunctionArgs) => {
  return json({ termFromUrl: params.term });
};

export default function NyTerm() {
  const { termFromUrl } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const submitting = navigation.formAction === '/ny-term/legg-til';
  const bokmalFetcher = useDebounceFetcher<DictionaryResponse>();
  const nynorskFetcher = useDebounceFetcher<DictionaryResponse>();

  function submitTerm(term: string, dialect: 'nb' | 'nn', fetcher: ReturnType<typeof useDebounceFetcher>) {
    const formData = new FormData();
    formData.append('term', term);
    formData.append('dialect', dialect);

    fetcher.submit(formData, { method: 'post', action: '/api/ordbokene', debounceTimeout: 200 });
  }

  function handleSuggestionClick(
    term: string | undefined,
    dialect: 'nb' | 'nn',
    fetcher: ReturnType<typeof useDebounceFetcher>,
  ) {
    if (term !== undefined) {
      const inputField = document.getElementById(dialect) as HTMLInputElement | null;
      if (inputField) {
        inputField.value = term;
        submitTerm(term, dialect, fetcher);
      }
    }
  }

  return (
    <section className={style.form}>
      <Form method="post" action="legg-til">
        <h2>Legg til ny term</h2>
        <Row>
          <Label for="en">
            Engelsk term
            <input name="en" defaultValue={termFromUrl} className="form-control" type="text" autoCapitalize="none" />
          </Label>
        </Row>
        <Label>Norske termer</Label>
        <Row className="mb-4">
          <div className="col-sm-6">
            <Label for="nb">
              Bokmål
              <input
                id="nb"
                name="nb"
                className={'form-control' + (bokmalFetcher.data?.isValid ? ' is-valid' : '')}
                type="text"
                autoCapitalize="none"
                onChange={(event) => submitTerm(event.target.value, 'nb', bokmalFetcher)}
              />
              <div className="valid-feedback bright-feedback-text">{bokmalFetcher.data?.validationText}</div>
              {bokmalFetcher.data?.suggestion && (
                <div className={style.suggestionFeedback}>
                  Mente du{' '}
                  <button
                    type="button"
                    className={style.inlineButton}
                    onClick={() => handleSuggestionClick(bokmalFetcher.data?.suggestion, 'nb', bokmalFetcher)}
                  >
                    {bokmalFetcher.data?.suggestion}
                  </button>
                  ?
                </div>
              )}
            </Label>
          </div>
          <div className="col-sm-6">
            <Label for="nn">
              Nynorsk
              <input
                id="nn"
                name="nn"
                className={'form-control' + (nynorskFetcher.data?.isValid ? ' is-valid' : '')}
                type="text"
                autoCapitalize="none"
                onChange={(event) => submitTerm(event.target.value, 'nn', nynorskFetcher)}
              />
              <div className="valid-feedback bright-feedback-text">{nynorskFetcher.data?.validationText}</div>
              {nynorskFetcher.data?.suggestion && (
                <div className={style.suggestionFeedback}>
                  Mente du{' '}
                  <button
                    type="button"
                    className={style.inlineButton}
                    onClick={() => handleSuggestionClick(nynorskFetcher.data?.suggestion, 'nn', nynorskFetcher)}
                  >
                    {nynorskFetcher.data?.suggestion}
                  </button>
                  ?
                </div>
              )}
            </Label>
          </div>
        </Row>
        <Row>
          <div className="col-sm-6">
            <Label for="field">
              Fagfelt
              <input name="field" className="form-control" type="text" />
            </Label>
          </div>
          <div className="col-sm-6">
            <Label for="subfield">
              Gren
              <input name="subfield" className="form-control" type="text" />
            </Label>
          </div>
        </Row>
        <Row>
          <div className="col-sm-6 col-md-12">
            <Label for="pos">
              Ordklasse
              <select name="pos" className="form-select">
                <option>substantiv</option>
                <option>verb</option>
                <option>adjektiv</option>
                <option>pronomen</option>
                <option>determinativ</option>
                <option>preposisjon</option>
                <option>adverb</option>
                <option>subjunksjon</option>
                <option>konjunksjon</option>
                <option>interjeksjon</option>
              </select>
            </Label>
          </div>
        </Row>
        <Row>
          <Label htmlFor="reference">
            Referanse
            <input name="reference" className="form-control" type="text" />
          </Label>
        </Row>
        <Button color="success">
          {submitting && (
            <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
          )}
          Legg til term
        </Button>
      </Form>
    </section>
  );
}

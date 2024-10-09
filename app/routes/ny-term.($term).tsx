import style from '~/styles/ny-term.module.css';
import { Await, Form, useLoaderData, useNavigate, useNavigation, useRouteLoaderData } from '@remix-run/react';
import { json } from '@remix-run/node';
import type { LoaderFunction, LoaderFunctionArgs } from '@remix-run/node';
import { Button, Label, Row } from 'reactstrap';
import { useDebounceFetcher } from 'remix-utils/use-debounce-fetcher';
import type { DictionaryResponse } from '~/routes/api.ordbokene';
import type { loader as rootLoader } from '~/root';
import { Suspense, useEffect } from 'react';
import type { Term } from '~/types/term';

export const loader: LoaderFunction = ({ params }: LoaderFunctionArgs) => {
  return json({ newTerm: params.term });
};

export default function NyTerm() {
  const { newTerm } = useLoaderData<typeof loader>();
  const { terms, q } = useRouteLoaderData<typeof rootLoader>('root');
  const navigation = useNavigation();
  const navigate = useNavigate();
  const submitting = navigation.formAction === '/ny-term/legg-til';

  useEffect(() => {
    const enField = document.getElementById('en');
    if (enField instanceof HTMLInputElement) {
      enField.value = newTerm || '';
    }
  }, [newTerm]);

  return (
    <section className={style.form}>
      <Form method="post" action="legg-til">
        <h2>Legg til ny term</h2>
        <Row>
          <Label for="en">
            Engelsk term
            <Suspense
              fallback={
                <input
                  id="en"
                  name="en"
                  defaultValue={newTerm}
                  className="form-control"
                  type="text"
                  autoCapitalize="none"
                  onChange={(event) => {
                    const isFirstInput = newTerm === null;
                    if (q) {
                      navigate(`/ny-term/${event.target.value}?q=${q}`, {
                        replace: isFirstInput,
                      });
                    } else {
                      navigate(`/ny-term/${event.target.value}`, {
                        replace: isFirstInput,
                      });
                    }
                  }}
                />
              }
            >
              <Await resolve={terms}>
                {(terms) => {
                  const existsInTermbase = terms.find((term: Term) => term.en === newTerm) !== undefined;
                  return (
                    <>
                      <input
                        id="en"
                        name="en"
                        defaultValue={newTerm}
                        className={'form-control' + (existsInTermbase ? ' is-invalid' : '')}
                        type="text"
                        autoCapitalize="none"
                        onChange={(event) => {
                          const isFirstInput = newTerm === null;
                          if (q) {
                            navigate(`/ny-term/${event.target.value}?q=${q}`, {
                              replace: isFirstInput,
                            });
                          } else {
                            navigate(`/ny-term/${event.target.value}`, {
                              replace: isFirstInput,
                            });
                          }
                        }}
                      />
                      <div className="invalid-feedback bright-feedback-text">Termen finnes allerede i termlista.</div>
                    </>
                  );
                }}
              </Await>
            </Suspense>
          </Label>
        </Row>
        <Label>Norske termer</Label>
        <Row className="mb-4">
          <div className="col-sm-6">
            <Label for="nb">
              Bokmål
              <SuggestionInput dialect={'nb'} />
            </Label>
          </div>
          <div className="col-sm-6">
            <Label for="nn">
              Nynorsk
              <SuggestionInput dialect={'nn'} />
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

function SuggestionInput({ dialect }: { dialect: 'nb' | 'nn' }) {
  const fetcher = useDebounceFetcher<DictionaryResponse>();

  function submitTerm(term: string) {
    const formData = new FormData();
    formData.append('term', term);
    formData.append('dialect', dialect);

    fetcher.submit(formData, { method: 'post', action: '/api/ordbokene', debounceTimeout: 200 });
  }

  function handleSuggestionClick(term: string | undefined) {
    if (term !== undefined) {
      const inputField = document.getElementById(dialect) as HTMLInputElement | null;
      if (inputField) {
        inputField.value = term;
        submitTerm(term);
      }
    }
  }

  return (
    <>
      <input
        id={dialect}
        name={dialect}
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

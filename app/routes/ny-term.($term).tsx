import { Form, useNavigation } from 'react-router';
import type { ChangeEvent } from 'react';
import { Button, Label, Row } from 'reactstrap';
import { useDebounceFetcher } from '~/lib/use-debounce-fetcher';

import { DialectInput } from '~/lib/components/dialect-input';
import type { Route } from './+types/ny-term.($term)';
import style from '~/styles/ny-term.module.css';

export default function NyTerm({ params }: Route.ComponentProps) {
  const termFromUrl = params.term as string;
  const navigation = useNavigation();
  const submitting = navigation.formAction === '/ny-term/legg-til';

  return (
    <section className={style.form}>
      <Form method="post" action="legg-til">
        <h2>Legg til ny term</h2>
        <Row>
          <Label for="en">
            Engelsk term
            <TermInput defaultValue={termFromUrl} />
          </Label>
        </Row>
        <Label>Norske termer</Label>
        <Row className="mb-4">
          <div className="col-sm-6">
            <Label for="nb">
              Bokmål
              <DialectInput name="nb" dialect="nb" />
            </Label>
          </div>
          <div className="col-sm-6">
            <Label for="nn">
              Nynorsk
              <DialectInput name="nn" dialect="nn" />
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

function TermInput({ defaultValue }: { defaultValue: string }) {
  const fetcher = useDebounceFetcher<boolean>();
  const definitionFetcher = useDebounceFetcher<string | null>();

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const formData = new FormData();
    formData.append('term', event.target.value);

    fetcher.submit(formData, { method: 'post', action: '/api/termliste/finnes', debounceTimeout: 200 });
    definitionFetcher.submit(formData, { method: 'post', action: '/api/definisjon', debounceTimeout: 300 });
  }

  return (
    <>
      <input
        id="en"
        name="en"
        defaultValue={defaultValue}
        className={'form-control' + (fetcher.data ? ' is-invalid' : '')}
        type="text"
        autoCapitalize="none"
        onChange={handleChange}
      />
      <div className="invalid-feedback bright-feedback-text">Termen finnes allerede i termlista.</div>
      <Definitions definitions={definitionFetcher.data} />
    </>
  );
}

type Props = {
  definitions: string | null | undefined;
};

function Definitions({ definitions }: Props) {
  if (!definitions) return null;

  return (
    <div className="mt-2">
      <p>Definisjon</p>
      <div dangerouslySetInnerHTML={{ __html: definitions }} />
    </div>
  );
}

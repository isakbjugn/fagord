import { Await, data, Form, useLoaderData, useNavigation, useParams } from 'react-router';
import { ChangeEvent, Suspense, useState } from 'react';
import { useDebounceFetcher } from '~/lib/use-debounce-fetcher';

import { DialectInput } from '~/lib/components/dialect-input';
import styles from '~/styles/ny-term.module.css';
import { Subject } from '~/types/subject';
import { ClientOnly } from '~/lib/client-only';
import { SubjectsCombobox } from '~/lib/components/subjects-combobox';

export function loader() {
  const FAGORD_RUST_API_URL = process.env.FAGORD_RUST_API_DOMAIN || 'http://localhost:8080';
  const subjects = fetch(`${FAGORD_RUST_API_URL}/fields`).then((res) => {
    if (!res.ok) {
      throw data('Klarte ikke å hente fagfelt', { status: 500 });
    }
    return res.json() as Promise<Subject[]>;
  });
  return { subjects };
}

export default function NyTerm() {
  const { subjects } = useLoaderData<typeof loader>();
  const { term: termFromUrl } = useParams();
  const navigation = useNavigation();
  const submitting = navigation.formAction === '/ny-term/legg-til';

  return (
    <section className={styles.form}>
      <Form method="post" action="legg-til">
        <h2>Legg til ny term</h2>
        <div className="row">
          <label className="form-label" htmlFor="en">
            Engelsk term
            <TermInput defaultValue={termFromUrl} />
          </label>
        </div>
        <label className="form-label">Norske termer</label>
        <div className="row mb-4">
          <div className="col-sm-6">
            <label className="form-label" htmlFor="nb">
              Bokmål
              <DialectInput name="nb" dialect="nb" />
            </label>
          </div>
          <div className="col-sm-6">
            <label className="form-label" htmlFor="nn">
              Nynorsk
              <DialectInput name="nn" dialect="nn" />
            </label>
          </div>
        </div>
        <Suspense fallback={<SubjectInputGroup />}>
          <Await resolve={subjects}>
            {(resolvedSubjects) => (
              <ClientOnly fallback={<SubjectInputGroup />}>
                <SubjectDropdown subjects={resolvedSubjects} />
              </ClientOnly>
            )}
          </Await>
        </Suspense>
        <div className="row">
          <div className="col-sm-6">
            <label className="form-label" htmlFor="pos">
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
            </label>
          </div>
        </div>
        <div className="row">
          <label className="form-label" htmlFor="reference">
            Referanse
            <input name="reference" className="form-control" type="text" />
          </label>
        </div>
        <button className="btn btn-success">
          {submitting && (
            <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
          )}
          Legg til term
        </button>
      </Form>
    </section>
  );
}

function TermInput({ defaultValue }: { defaultValue: string | undefined }) {
  const existsFetcher = useDebounceFetcher<{ exists: boolean; validationText: string | undefined }>();
  const definitionFetcher = useDebounceFetcher<string | null>();

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const formData = new FormData();
    formData.append('term', event.target.value);

    existsFetcher.submit(formData, { method: 'post', action: '/api/termliste/finnes', debounceTimeout: 200 });
    definitionFetcher.submit(formData, { method: 'post', action: '/api/definisjon', debounceTimeout: 300 });
  }

  return (
    <>
      <input
        id="en"
        name="en"
        defaultValue={defaultValue}
        className={'form-control' + (existsFetcher.data?.exists ? ' is-invalid' : '')}
        type="text"
        autoCapitalize="none"
        onChange={handleChange}
      />
      <div className="invalid-feedback bright-feedback-text">{existsFetcher.data?.validationText}</div>
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

function SubjectInputGroup() {
  return (
    <div className="row">
      <div className="col-sm-6">
        <label className="form-label" htmlFor="field">
          Fagfelt
          <input name="field" className="form-control" type="text" />
        </label>
      </div>
      <div className="col-sm-6">
        <label className="form-label" htmlFor="subfield">
          Gren
          <input name="subfield" className="form-control" type="text" />
        </label>
      </div>
    </div>
  );
}

function SubjectDropdown({ subjects }: { subjects: Subject[] }) {
  const [selectedSubject, setSelectedSubject] = useState<string>('');

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setSelectedSubject(event.currentTarget.value);
  }

  const subfields = subjects.find((subject) => subject.name === selectedSubject)?.subfields || [];

  return (
    <div className="row">
      <div className="col-sm-6">
        <label className="form-label" htmlFor="field">
          Fagfelt
          <SubjectsCombobox subjects={subjects} name="field" onChange={handleChange} />
        </label>
      </div>
      <div className="col-sm-6">
        <label className="form-label" htmlFor="subfield">
          Gren
          <SubjectsCombobox subjects={subfields} name="subfield" disabled={selectedSubject === ''} />
        </label>
      </div>
    </div>
  );
}

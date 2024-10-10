import { Await, useLoaderData, useRouteLoaderData } from '@remix-run/react';
import { Suspense, useState } from 'react';
import type { loader as rootLoader } from '~/root';
import type { Subject } from '~/types/subject';
import { defer } from '@remix-run/node';
import type { Term } from '~/types/term';
import style from '~/styles/termliste.module.css';
import { Form, FormGroup, Input, Label } from 'reactstrap';
import { Spinner } from '~/src/components/spinner/spinner';

interface TransFilter {
  text: string;
  filter: TransFilterType;
  defaultChecked: boolean;
}

type TransFilterType = 'all' | 'translated' | 'incomplete';

const AllSubjects: Subject = { field: 'Alle fagfelt', subfields: [] };

const transFilters: TransFilter[] = [
  {
    text: 'Alle',
    filter: 'all',
    defaultChecked: true,
  },
  {
    text: 'Oversatt',
    filter: 'translated',
    defaultChecked: false,
  },
  {
    text: 'Ufullstendig',
    filter: 'incomplete',
    defaultChecked: false,
  },
];

function loader() {
  const subjectsUrl = 'https://api.fagord.no/fagfelt/';
  const subjects = fetch(subjectsUrl).then((res) => {
    if (res.ok) return res.json();
    else throw new Error(`${res.status} ${res.statusText}: Feil under henting av fagfelt!`);
  });

  return defer({
    subjects: subjects,
  }, { headers: { 'Cache-Control': 'max-age=3600'}});
}

export default function Termliste() {
  const { terms } = useRouteLoaderData<typeof rootLoader>('root');
  const { subjects } = useLoaderData<typeof loader>();
  const [transFilter, setTransFilter] = useState<TransFilterType>('all');
  const [subjectFilter, setSubjectFilter] = useState<string | null>(AllSubjects.field);

  const applyTransFilter = (terms: Term[]): Term[] => {
    switch (transFilter) {
      case 'translated':
        return terms.filter((term) => term.nb !== '' || term.nn !== '');
      case 'incomplete':
        return terms.filter((term) => term.nb === '' || term.nn === '');
      default:
        return terms;
    }
  };

  const applySubjectFilter = (terms: Term[]): Term[] => {
    if (subjectFilter === null) return terms;
    if (subjectFilter === AllSubjects.field) return terms;
    return terms.filter((term) => term.field === subjectFilter);
  };

  const subjectFilterComponent = () => (
    <Suspense fallback={<Spinner />}>
      <Await resolve={subjects}>
        {(subjects: Subject) => (
          <select className={style.subjects} onChange={(event) => setSubjectFilter(event.currentTarget.value)}>
          {[AllSubjects, subjects].map((subject) => (
            <option key={subjects.field}>{subject.field}</option>
          ))}
        </select>
        )}
      </Await>
    </Suspense>
  );

  return (
    <main className="container-sm my-2">
      <div className="col-12 col-lg-10 mx-auto">
        <div className={style.header}>
          <Form className={style.form}>
            {transFilters.map((filter) => (
              <FormGroup check inline key={filter.filter}>
                <Input
                  name="dictionaryView"
                  type="radio"
                  onChange={() => {
                    setTransFilter(filter.filter);
                  }}
                  defaultChecked={filter.defaultChecked}
                />
                <Label check>{filter.text}</Label>
              </FormGroup>
            ))}
          </Form>
          {subjectFilterComponent()}
        </div>
        <Dictionary dictionary={applyTransFilter(applySubjectFilter(terms))}></Dictionary>
      </div>
    </main>
  );
}

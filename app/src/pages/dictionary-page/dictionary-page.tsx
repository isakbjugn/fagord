import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Form, FormGroup, Input, Label } from 'reactstrap';

import { InfoMessage } from '../../components/info-message/info-message';
import { Loader } from '../../components/loader/loader';
import { Spinner } from '../../components/spinner/spinner';
import { fetchFields } from '../../lib/fetch';
import type { Subject } from '~/types/subject';
import type { Term } from '~/types/term';
import { useDictionary } from '../../utils/use-dictionary';
import { Dictionary } from './dictionary/dictionary';
import style from './dictionary-page.module.css';

interface TransFilter {
  text: string;
  filter: TransFilterType;
  defaultChecked: boolean;
}

type TransFilterType = 'all' | 'translated' | 'incomplete';

const AllSubjects: Subject = { field: 'Alle fagfelt', subfields: [] };

export const DictionaryPage = () => {
  const [transFilter, setTransFilter] = useState<TransFilterType>('all');
  const [subjectFilter, setSubjectFilter] = useState<string | null>(AllSubjects.field);

  const dictionaryQuery = useDictionary();
  const subjectQuery = useQuery({ queryKey: ['fields'], queryFn: fetchFields });

  if (dictionaryQuery.isPending) return <Loader />;
  if (dictionaryQuery.isError)
    return (
      <InfoMessage>
        <p>Kunne ikke laste termliste.</p>
      </InfoMessage>
    );

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

  const subjectFilterComponent = () => {
    if (subjectQuery.isPending) return <Spinner />;
    if (subjectQuery.isError) return <p>Kunne ikke laste fagfelt.</p>;
    return (
      <select className={style.subjects} onChange={(event) => setSubjectFilter(event.currentTarget.value)}>
        {[AllSubjects, ...subjectQuery.data].map((subject) => (
          <option key={subject.field}>{subject.field}</option>
        ))}
      </select>
    );
  };

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
        <Dictionary dictionary={applyTransFilter(applySubjectFilter(dictionaryQuery.data))}></Dictionary>
      </div>
    </main>
  );
};

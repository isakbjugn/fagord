import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Select from 'react-select';
import { Form, FormGroup, Input, Label } from 'reactstrap';
import { fetchFields } from '../../lib/fetch';
import type { Subject } from '../../types/subject';
import type { Term } from '../../types/term';
import Loader from '../common/loader/loader';
import styles from './dictionary-page.module.css';
import Spinner from '../common/spinner/spinner';
import useDictionary from '../utils/use-dictionary';
import { Dictionary } from './dictionary/dictionary';
import InfoMessage from '../common/info-message/info-message';

interface TransFilter {
  text: string;
  filter: TransFilterType;
  defaultChecked: boolean;
}

type TransFilterType = 'all' | 'translated' | 'incomplete';

const AllSubjects: Subject = { field: 'Alle', subfields: [] };

const DictionaryPage = (): JSX.Element => {
  const [transFilter, setTransFilter] = useState<TransFilterType>('all');
  const [subjectFilter, setSubjectFilter] = useState<Subject | null>(
    AllSubjects
  );

  const dictionaryQuery = useDictionary();
  const subjectQuery = useQuery({ queryKey: ['fields'], queryFn: fetchFields });

  if (dictionaryQuery.isLoading) return <Loader />;
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
    if (subjectFilter.field === AllSubjects.field) return terms;
    return terms.filter((term) => term.field === subjectFilter.field);
  };

  const subjectFilterComponent = (): JSX.Element => {
    if (subjectQuery.isLoading) return <Spinner />;
    if (subjectQuery.isError) return <p>Kunne ikke laste fagfelt.</p>;
    return (
      <Select
        className={styles.subjects}
        value={subjectFilter}
        placeholder="Filtrer fagfelt"
        options={[{ field: 'Alle', subfields: [] }, ...subjectQuery.data]}
        onChange={(choice) => {
          setSubjectFilter(choice);
        }}
        getOptionLabel={(subject: Subject) => subject.field}
        getOptionValue={(subject: Subject) => subject.field}
      />
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
        <div className={styles.header}>
          <Form className={styles.form}>
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
        <Dictionary
          dictionary={applyTransFilter(applySubjectFilter(dictionaryQuery.data))}
        ></Dictionary>
      </div>
    </main>
  );
};

export default DictionaryPage;

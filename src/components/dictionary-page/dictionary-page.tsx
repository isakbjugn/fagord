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

  const {
    isLoading: dictionaryLoading,
    isError: dictionaryError,
    data: dictionary,
  } = useDictionary();
  const {
    isLoading: subjectLoading,
    isError: subjectError,
    data: subjects,
  } = useQuery({ queryKey: ['fields'], queryFn: fetchFields });

  if (dictionaryLoading) return <Loader />;
  if (dictionaryError) return <p>Kunne ikke laste termliste.</p>;

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
    if (subjectLoading || subjects === undefined) return <Spinner />;
    if (subjectError) return <p>Kunne ikke laste fagfelt.</p>;
    return (
      <Select
        className={styles.subjects}
        value={subjectFilter}
        placeholder="Filtrer fagfelt"
        options={[{ field: 'Alle', subfields: [] }, ...subjects]}
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
    <div className="container-sm my-2">
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
          dictionary={applyTransFilter(applySubjectFilter(dictionary))}
        ></Dictionary>
      </div>
    </div>
  );
};

export default DictionaryPage;

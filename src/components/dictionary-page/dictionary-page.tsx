import { useState } from "react"
import { useQuery } from "react-query"
import Select from "react-select"
import { Form, FormGroup, Input, Label } from "reactstrap"
import { fetchFields } from "../../lib/fetch"
import { Subject } from "../../types/subject"
import { Term } from "../../types/term"
import Loader from "../common/loader/loader"
import TermList from "./term-list/term-list"
import styles from "./dictionary-page.module.css";
import Spinner from "../common/spinner/spinner"

interface DictionaryPageProps {
  dictionary: Term[];
}

interface TransFilter {
  text: String;
  filter: TransFilterType;
  defaultChecked: boolean;
}

type TransFilterType = 'all' | 'translated' | 'incomplete';

const AllSubjects: Subject = { field: 'Alle', subfields: []}

const DictionaryPage = ({dictionary = []}: DictionaryPageProps)  => {
  const [transFilter, setTransFilter] = useState<TransFilterType>('all');
  const [subjectFilter, setSubjectFilter] = useState<Subject | null>(AllSubjects);

  const { isLoading, error, data: subjects } = useQuery('fields', fetchFields)

  const applyTransFilter = (terms: Term[]) => {
    switch (transFilter) {
      case 'translated':
        return terms.filter(term => (term.nb || term.nn))
      case 'incomplete':
        return terms.filter(term => (!term.nb || !term.nn))
      default:
        return terms;
    };
  }

  const applySubjectFilter = (terms: Term[]) => {
    if (!subjectFilter) return terms;
    if (subjectFilter.field === AllSubjects.field) return terms;
    return terms.filter(term => term.field === subjectFilter.field);
  }

  const subjectFilterComponent = () => {
    if (isLoading) return <Spinner />;
    if (error) return <p>Kunne ikke laste fagfelt.</p>;
    return (
      <Select
        className={styles.subjects}
        value={subjectFilter}
        placeholder='Filtrer fagfelt'
        options={[{ field: "Alle", subfields: [] }, ...subjects]}
        onChange={(choice) => setSubjectFilter(choice)}
        getOptionLabel={(subject: Subject) => subject.field}
        getOptionValue={(subject: Subject) => subject.field}
      />
    )
  }
  
  const transFilters: TransFilter[] = [
    {
      text: "Alle",
      filter: 'all',
      defaultChecked: true,
    },
    {
      text: "Oversatt",
      filter: 'translated',
      defaultChecked: false,
    },
    {
      text: "Ufullstendig",
      filter: 'incomplete',
      defaultChecked: false,
    },
  ]

  if (dictionary.length === 0) return <Loader />;

  return (
    <div className="container-sm my-2">
      <div className="col-12 col-lg-10 mx-auto">
        <div className={styles.header}>
          <Form className={styles.form}>
            {transFilters.map((filter) =>
              <FormGroup check inline key={filter.filter}>
                <Input
                  name="dictionaryView"
                  type="radio"
                  onChange={() => setTransFilter(filter.filter)}
                  defaultChecked={filter.defaultChecked}
                />
                <Label check>{filter.text}</Label> 
              </FormGroup>
            )}
          </Form>
          {subjectFilterComponent()}
        </div>
        <TermList dictionary={applyTransFilter(applySubjectFilter(dictionary))}></TermList>
      </div>
    </div>
  )
}

export default DictionaryPage;

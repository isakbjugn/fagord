import { Spinner } from '~/lib/components/spinner';
import style from './subject-filter.module.css';
import { AllSubjects } from '~/types/subject';
import { useSubjectsFetcher } from '~/routes/termliste/subject-filter/use-subjects-fetcher';

type Props = {
  onChange: (subject: string) => void;
};

export const SubjectFilter = ({ onChange }: Props) => {
  const subjectsFetcher = useSubjectsFetcher();

  function handleClick() {
    subjectsFetcher.load('/api/fagfelt');
  }

  if (subjectsFetcher.state === 'loading')
    return (
      <div className={style.container}>
        <Spinner />
      </div>
    );

  if (subjectsFetcher.data?.error) {
    return (
      <button className={style.subjects} onClick={handleClick}>
        <i className="fa-solid fa-rotate"></i> {subjectsFetcher.data.message}
      </button>
    );
  }

  if (subjectsFetcher.data) {
    return (
      <select className={style.subjects} onChange={(event) => onChange(event.currentTarget.value)}>
        {[AllSubjects, ...subjectsFetcher.data.subjects].map((subject) => (
          <option key={subject.field} value={subject.field}>
            {subject.field}
          </option>
        ))}
      </select>
    );
  }
};

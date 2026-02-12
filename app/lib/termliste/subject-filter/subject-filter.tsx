import style from './subject-filter.module.css';
import { AllSubjects, Subject } from '~/types/subject';

type Props = {
  subjects: Subject[];
  onChange: (subject: string) => void;
};

export const SubjectFilter = ({ onChange, subjects }: Props) => {
  return (
    <select className={style.subjects} onChange={(event) => onChange(event.currentTarget.value)}>
      {[AllSubjects, ...subjects].map((subject) => (
        <option key={subject.name} value={subject.name}>
          {subject.name}
        </option>
      ))}
    </select>
  );
};

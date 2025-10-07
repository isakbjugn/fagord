import style from './subject-filter.module.css';
import { AllSubjects, Subject } from '~/types/subject';
import { Suspense } from 'react';
import { Await } from 'react-router';

type Props = {
  subjects: Promise<Subject[]>;
  onChange: (subject: string) => void;
};

export const SubjectFilter = ({ onChange, subjects }: Props) => {
  return (
    <Suspense fallback={<Loader />}>
      <Await resolve={subjects}>
        {(subjects) => (
          <select className={style.subjects} onChange={(event) => onChange(event.currentTarget.value)}>
            {[AllSubjects, ...subjects].map((subject) => (
              <option key={subject.name} value={subject.name}>
                {subject.name}
              </option>
            ))}
          </select>
        )}
      </Await>
    </Suspense>
  );
};

function Loader() {
  return (
    <div className={style.skeleton}>
      <p>
        <i className="fa-solid fa-spinner fa-spin" /> Henter fagfelt
      </p>
    </div>
  );
}

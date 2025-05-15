import { Suspense } from 'react';
import { Spinner } from '~/lib/components/spinner';
import { Await } from '@remix-run/react';
import style from './subject-filter.module.css';
import { AllSubjects, type SubjectsLoaderData } from '~/types/subject';

type Props = {
  onChange: (subject: string) => void;
  subjectsData: SubjectsLoaderData;
};

export const SubjectFilter = ({ onChange, subjectsData }: Props) => (
  <Suspense fallback={<Spinner />}>
    <Await resolve={subjectsData}>
      {(subjectsData) =>
        subjectsData.success ? (
          <Suspense fallback={<Spinner />}>
            <Await resolve={subjectsData.subjects}>
              {(subjects) => (
                <select className={style.subjects} onChange={(event) => onChange(event.currentTarget.value)}>
                  {[AllSubjects, ...subjects].map((subject) => (
                    <option key={subject.field}>{subject.field}</option>
                  ))}
                </select>
              )}
            </Await>
          </Suspense>
        ) : (
          <p className={style.inlineErrorMessage}>
            <i className="fa-solid fa-triangle-exclamation"></i>
            {subjectsData.message}
          </p>
        )
      }
    </Await>
  </Suspense>
);

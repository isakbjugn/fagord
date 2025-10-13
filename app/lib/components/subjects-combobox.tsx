import { Subject } from '~/types/subject';
import { ChangeEvent, useState } from 'react';
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react';
import styles from '~/styles/subjects-combobox.module.css';

type SubjectDropdownProps = {
  subjects: Subject[];
  name: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
};

export function SubjectsCombobox({ subjects, name, onChange, disabled }: SubjectDropdownProps) {
  const [query, setQuery] = useState('');

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setQuery(event.currentTarget.value);
  }

  const filteredSubjects =
    query === '' ? subjects : subjects.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()));
  const subjectExists = subjects.some((s) => s.name.toLowerCase() === query.toLowerCase());

  return (
    <Combobox name={name} onClose={() => setQuery('')}>
      <div className={styles.inputWrapper}>
        <ComboboxInput
          id={name}
          className="form-control"
          onChange={handleChange}
          onSelect={onChange}
          displayValue={(value: string) => value}
          autoComplete="off"
          disabled={disabled}
        />
        {subjects.length > 0 && (
          <ComboboxButton className={styles.button}>
            <i className="fa-solid fa-chevron-down fa-xs" />
          </ComboboxButton>
        )}
      </div>
      <ComboboxOptions anchor="bottom" style={{ width: 'var(--input-width)' }} className={styles.options}>
        {filteredSubjects.map((subject) => (
          <ComboboxOption key={subject.name} value={subject.name} className={styles.option}>
            {subject.name}
          </ComboboxOption>
        ))}
        {!subjectExists && query.length > 0 && (
          <ComboboxOption value={query} className={styles.option}>
            Opprett <span style={{ fontWeight: 'bold' }}>{query}</span>
          </ComboboxOption>
        )}
      </ComboboxOptions>
    </Combobox>
  );
}

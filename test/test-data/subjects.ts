import { Subject } from '~/types/subject';

export function createValidSubjects(): Subject[] {
  return [
    {
      name: 'Biologi',
      subfields: [
        {
          name: 'Mikrobiologi',
          subfields: [],
        },
      ],
    },
    {
      name: 'IT',
      subfields: [
        {
          name: 'Kunstig intelligens',
          subfields: [],
        },
      ],
    },
    {
      name: 'Materialteknologi',
      subfields: [
        {
          name: 'Legeringer',
          subfields: [],
        },
      ],
    },
  ];
}

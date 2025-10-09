import { Term } from '~/types/term';

export function createValidTerms(): Term[] {
  return [
    {
      slug: 'cortex_sub',
      en: 'cortex',
      nb: 'hjernebark',
      nn: 'hjernebork',
      variants: [
        { id: 1, text: 'hjernebark', dialect: 'nb', votes: 1 },
        { id: 2, text: 'hjernebork', dialect: 'nn', votes: 1 },
      ],
      field: 'Biologi',
      subfield: 'Nevrovitenskap',
      pos: 'substantiv',
      reference: 'https://sml.snl.no/hjernebarken',
      definition: 'Ytre, grå substans av nerveceller som dekker overflata på hjernen',
    },
    {
      slug: 'archaea_sub',
      en: 'archaea',
      nb: 'arkebakterier',
      nn: 'arkebakteriar',
      variants: [
        { id: 3, text: 'arkebakterier', dialect: 'nb', votes: 1 },
        { id: 4, text: 'arkebakteriar', dialect: 'nn', votes: 1 },
      ],
      field: 'Biologi',
      subfield: 'Mikrobiologi',
      pos: 'substantiv',
      reference: 'https://snl.no/arker',
      definition:
        'Mikroskopiske, encellede, prokaryote organismer som utseendemessig likner bakterier, men har andre biokjemiske komponenter i cellevegg og ulik form og størrelse på ribosomene.',
    },
    {
      slug: 'benchmark_sub',
      en: 'benchmark',
      nb: 'ytelsestest',
      nn: 'ytingstest',
      variants: [
        { id: 5, text: 'ytelsestest', dialect: 'nb', votes: 1 },
        { id: 6, text: 'ytingstest', dialect: 'nn', votes: 1 },
        { id: 7, text: 'temperaturmåling', dialect: 'nb', votes: 1 },
      ],
      field: 'IT',
      subfield: 'Programvare',
      pos: 'substantiv',
      reference: 'https://snl.no/benchmark-test',
      definition:
        'Testing for å måle ytelsen til et programvareprodukt. Måling av systemets svartider eller testing av systemets kapasitet under gitte krav til svartider.',
    },
    {
      slug: 'abrasive_sub',
      en: 'abrasive',
      nb: 'slipemiddel',
      nn: 'slipemiddel',
      variants: [
        { id: 8, text: 'slipemiddel', dialect: 'nb', votes: 7 },
        { id: 9, text: 'slipemiddel', dialect: 'nn', votes: 7 },
      ],
      field: 'Materialteknologi',
      subfield: 'Materialer',
      pos: 'substantiv',
      reference: 'https://snl.no/slipemidler',
      definition: 'Hardt materiale som sand, sandstein korund (smergel) og karborundum brukt til sliping.',
    },
  ];
}

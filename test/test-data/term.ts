import { Term } from '~/types/term';

export function createValidTerms(): Term[] {
  return [
    {
      _id: 'cortex_sub',
      en: 'cortex',
      nb: 'hjernebark',
      nn: 'hjernebork',
      variants: [
        { term: 'hjernebark', dialect: 'nb', votes: 1 },
        { term: 'hjernebork', dialect: 'nn', votes: 1 },
      ],
      field: 'Biologi',
      subfield: 'Nevrovitenskap',
      pos: 'substantiv',
      reference: 'https://sml.snl.no/hjernebarken',
      definition: 'Ytre, grå substans av nerveceller som dekker overflata på hjernen',
    },
    {
      _id: 'archaea_sub',
      en: 'archaea',
      nb: 'arkebakterier',
      nn: 'arkebakteriar',
      variants: [
        { term: 'arkebakterier', dialect: 'nb', votes: 1 },
        { term: 'arkebakteriar', dialect: 'nn', votes: 1 },
      ],
      field: 'Biologi',
      subfield: 'Mikrobiologi',
      pos: 'substantiv',
      reference: 'https://snl.no/arker',
      definition:
        'Mikroskopiske, encellede, prokaryote organismer som utseendemessig likner bakterier, men har andre biokjemiske komponenter i cellevegg og ulik form og størrelse på ribosomene.',
    },
    {
      _id: 'benchmark_sub',
      en: 'benchmark',
      nb: 'ytelsestest',
      nn: 'ytingstest',
      variants: [
        { term: 'ytelsestest', dialect: 'nb', votes: 1 },
        { term: 'ytingstest', dialect: 'nn', votes: 1 },
        { term: 'temperaturmåling', dialect: 'nb', votes: 1 },
      ],
      field: 'IT',
      subfield: 'Programvare',
      pos: 'substantiv',
      reference: 'https://snl.no/benchmark-test',
      definition:
        'Testing for å måle ytelsen til et programvareprodukt. Måling av systemets svartider eller testing av systemets kapasitet under gitte krav til svartider.',
    },
    {
      _id: 'abrasive_sub',
      en: 'abrasive',
      nb: 'slipemiddel',
      nn: 'slipemiddel',
      variants: [
        { term: 'slipemiddel', dialect: 'nb', votes: 7 },
        { term: 'slipemiddel', dialect: 'nn', votes: 7 },
      ],
      field: 'Materialteknologi',
      subfield: 'Materialer',
      pos: 'substantiv',
      reference: 'https://snl.no/slipemidler',
      definition: 'Hardt materiale som sand, sandstein korund (smergel) og karborundum brukt til sliping.',
    },
  ];
}

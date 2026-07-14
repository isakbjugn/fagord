import type { DictionaryDefinition } from '~/routes/api.definisjon';

export function createValidDefinition(): DictionaryDefinition {
  return {
    definitions: [
      {
        definition: 'a written message',
        translations: ['brev', 'skriv'],
        examples: ['a letter to the editor', 'she wrote him a letter'],
      },
    ],
    source: {
      name: 'Ordbøkene',
      exactUrl: 'https://ordbokene.no/nno/bm/letter',
    },
  };
}

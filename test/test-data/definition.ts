import type { DictionaryDefinition } from '~/types/definition';

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

export type DictionaryDefinition = {
  definitions: Definition[];
  source: DictionarySource;
};

type Definition = {
  definition: string;
  translations: string[];
  examples: string[];
};

type DictionarySource = {
  name: string;
  exactUrl: string;
};

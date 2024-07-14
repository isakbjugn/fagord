export interface OrdbokeneResponse {
  q: string;
  cnt: number;
  cmatch: number;
  a: OrdbokeneLookup;
}

export interface OrdbokeneLookup {
  inflect?: string[][];
  exact?: string[][];
  similar?: string[][];
}

export interface Lookup {
  exact: boolean;
  inflect: string[];
  similar: string[];
}

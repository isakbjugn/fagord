export type TransFilter = {
  text: string;
  filter: TransFilterType;
  defaultChecked: boolean;
};

export type TransFilterType = 'all' | 'translated' | 'incomplete';

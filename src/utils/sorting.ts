import { Term } from '../types/term';

export type Order = 'asc' | 'desc';

const descendingComparator = <T>(A: T, B: T, orderBy: keyof T): number => {
  const a = (A[orderBy] as string).toLowerCase();
  const b = (B[orderBy] as string).toLowerCase();

  if (b === '') return 1;
  if (b < a) return -1;
  if (b > a) return 1;
  return 0;
};

export const getComparator = <Key extends keyof Term>(
  order: Order,
  orderBy: Key,
): ((a: { [key in Key]: string }, b: { [key in Key]: string }) => number) => {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

export type Order = 'asc' | 'desc';

function descendingComparator<T>(A: T, B: T, orderBy: keyof T) {
  const a = (A[orderBy] as string).toLowerCase();
  const b = (B[orderBy] as string).toLowerCase();

  if (b === '') return 1;
  if (b < a) return -1;
  if (b > a) return 1;
  return 0;
}

export function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (a: { [key in Key]: string }, b: { [key in Key]: string }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

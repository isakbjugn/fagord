import Box from '@mui/material/Box';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import { visuallyHidden } from '@mui/utils';

import { TermTableCell } from '../styled-mui-components';
import type { Language } from '~/types/term';
import { Order } from '~/utils/sorting';

interface HeadCell {
  id: keyof Language;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'en',
    numeric: false,
    label: 'Engelsk',
  },
  {
    id: 'nb',
    numeric: false,
    label: 'Bokmål',
  },
  {
    id: 'nn',
    numeric: false,
    label: 'Nynorsk',
  },
];

interface DictionaryHeaderProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Language) => void;
  order: Order;
  orderBy: string;
}

export const DictionaryHeader = (props: DictionaryHeaderProps): JSX.Element => {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property: keyof Language) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell />
        {headCells.map((headCell) => (
          <TermTableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TermTableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

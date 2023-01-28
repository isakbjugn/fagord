import TableCell from '@mui/material/TableCell';
import MuiTablepagination from '@mui/material/TablePagination';
import { styled } from '@mui/system'

export const DropdownTableCell = styled(TableCell)({
  '@media (max-width: 768px)': {
    paddingLeft: '8px',
    paddingRight: '8px',
  },
  '@media (max-width: 480px)': {
    paddingLeft: '2px',
    paddingRight: '2px',
  },
});

export const TermTableCell = styled(TableCell)({
  '@media (max-width: 480px)': {
    paddingLeft: '4px',
    paddingRight:'4px',
  },
});

export const TablePagination = styled(MuiTablepagination)({
  'MuiTablePagination-displayedRows': {
    martinTop: '12px',
  },
});

import { useState } from 'react';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import TableRow from '@mui/material/TableRow';
import { Term } from '../../../../types/term';
import { DropdownTableCell, TermTableCell } from '../styled-mui-components';
import { TermDetails } from './term-details';

export const TermEntry = (props: { term: Term; index: number }) => {
  const [open, setOpen] = useState(false);
  const { term, index } = props;
  const labelId = `enhanced-table-checkbox-${index}`;
  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') setOpen(!open);
  };

  return (
    <>
      <TableRow
        hover
        tabIndex={-1}
        key={term._id}
        sx={{ '& > *': { borderBottom: 'unset' } }}
        onClick={() => setOpen(!open)}
      >
        <DropdownTableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </DropdownTableCell>
        <TermTableCell
          component="th"
          id={labelId}
          scope="row"
          tabIndex={0}
          onKeyDown={handleKeyDown}
        >
          {term.en}
        </TermTableCell>
        <TermTableCell align="justify" tabIndex={0} onKeyDown={handleKeyDown}>
          {term.nb}
        </TermTableCell>
        <TermTableCell align="justify" tabIndex={0} onKeyDown={handleKeyDown}>
          {term.nn}
        </TermTableCell>
      </TableRow>
      <TableRow>
        <TermTableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <TermDetails term={term} />
          </Collapse>
        </TermTableCell>
      </TableRow>
    </>
  );
};

import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { Collapse, IconButton, TableRow } from '@mui/material';
import type { KeyboardEvent} from 'react';
import { useState } from 'react';

import type { Term } from '../../../../types/term';
import { DropdownTableCell, TermTableCell } from '../styled-mui-components';
import { TermDetails } from './term-details';

export const TermEntry = (props: { term: Term; index: number }) => {
  const [open, setOpen] = useState(false);
  const { term, index } = props;
  const labelId = `enhanced-table-checkbox-${index}`;
  const handleKeyDown = (e: KeyboardEvent): void => {
    if (e.key === 'Enter') setOpen(!open);
  };

  return (
    <>
      <TableRow
        hover
        tabIndex={-1}
        key={term._id}
        sx={{ '& > *': { borderBottom: 'unset' } }}
        onClick={() => {
          setOpen(!open);
        }}
      >
        <DropdownTableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => {
              setOpen(!open);
            }}
          >
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </DropdownTableCell>
        <TermTableCell component="th" id={labelId} scope="row" tabIndex={0} onKeyDown={handleKeyDown}>
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

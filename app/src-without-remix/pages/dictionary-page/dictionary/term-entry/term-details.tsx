import { Box, Table, TableBody, TableCell, TableRow } from '@mui/material';

import style from './term-details.module.css';
import type { Term } from '~/types/term';
import { Link } from '@remix-run/react';

export const TermDetails = (props: { term: Term }): JSX.Element => {
  const { term } = props;

  return (
    <>
      <Box sx={{ margin: 1 }}>
        <Table size="small" aria-label="purchases">
          <TableBody>
            {term.field !== '' && (
              <TableRow>
                <TableCell component="th" scope="row">
                  Fagfelt
                </TableCell>
                <TableCell>{term.field}</TableCell>
              </TableRow>
            )}
            {term.subfield !== '' && (
              <TableRow>
                <TableCell component="th" scope="row">
                  Underområde
                </TableCell>
                <TableCell>{term.subfield}</TableCell>
              </TableRow>
            )}
            {term.definition !== '' && (
              <TableRow>
                <TableCell component="th" scope="row">
                  Definisjon
                </TableCell>
                <TableCell>{term.definition}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
      <div className={'col my-2 mx-4 ' + style.button}>
        <Link className="btn btn-outline-dark btn-sm" to={'/term/' + term._id} role="button">
          Til termside
        </Link>
      </div>
    </>
  );
};

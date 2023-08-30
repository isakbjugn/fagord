import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { Link } from 'react-router-dom';

import type { Term } from '../../../../types/term';
import style from './term-details.module.css';

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

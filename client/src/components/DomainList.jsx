import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import * as React from 'react';

export default function DomainList({ domains }) {
  return (
    <TableContainer
      sx={{ maxWidth: 500, border: '1px solid lightgrey' }}
      component={Paper}>
      <Table sx={{ minWidth: 100 }} aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell>No.</TableCell>
            <TableCell align='left'>Domain</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {domains?.map((row, index) => (
            <TableRow
              key={index + 1}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component='th' scope='row'>
                {index + 1}
              </TableCell>
              <TableCell align='left'>{row}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

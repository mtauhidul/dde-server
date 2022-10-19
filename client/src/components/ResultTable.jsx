import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { DataContext } from '..';

export default function ResultTable() {
  const dataArray = React.useContext(DataContext);
  const data = dataArray[1];

  return (
    <TableContainer component={Paper}>
      <Table sx={{ border: '1px solid lightgrey' }} aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell>Domain</TableCell>
            <TableCell align='left'>200</TableCell>
            <TableCell align='left'>301</TableCell>
            <TableCell align='left'>302</TableCell>
            <TableCell align='left'>404</TableCell>
            <TableCell align='left'>403</TableCell>
            <TableCell align='left'>500</TableCell>
            <TableCell align='left'>502</TableCell>
            <TableCell align='left'>503</TableCell>
            <TableCell align='left'>504</TableCell>
            <TableCell align='left'>Other</TableCell>
            <TableCell align='left'>Total Links</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((row) => (
            <TableRow
              key={row?.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component='th' scope='row'>
                <Link
                  style={{
                    textDecoration: 'none',
                    color: 'royalblue',
                    fontWeight: 'bold',
                  }}
                  to={`/details/${row?.id}`}>
                  {row?.domain}
                </Link>
              </TableCell>
              <TableCell
                sx={{ color: 'green', fontWeight: 'bold' }}
                align='left'>
                {
                  row?.urls?.filter((url) => url?.status?.toString() === '200')
                    .length
                }
              </TableCell>
              <TableCell
                sx={{ color: 'orange', fontWeight: 'bold' }}
                align='left'>
                {
                  row?.urls?.filter((url) => url?.status?.toString() === '301')
                    .length
                }
              </TableCell>
              <TableCell align='left'>
                {
                  row?.urls?.filter((url) => url?.status?.toString() === '302')
                    .length
                }
              </TableCell>
              <TableCell sx={{ color: 'red', fontWeight: 'bold' }} align='left'>
                {
                  row?.urls?.filter((url) => url?.status?.toString() === '404')
                    .length
                }
              </TableCell>
              <TableCell align='left'>
                {
                  row?.urls?.filter((url) => url?.status?.toString() === '403')
                    .length
                }
              </TableCell>
              <TableCell align='left'>
                {
                  row?.urls?.filter((url) => url?.status?.toString() === '500')
                    .length
                }
              </TableCell>
              <TableCell align='left'>
                {
                  row?.urls?.filter((url) => url?.status?.toString() === '502')
                    .length
                }
              </TableCell>
              <TableCell align='left'>
                {
                  row?.urls?.filter((url) => url?.status?.toString() === '503')
                    .length
                }
              </TableCell>
              <TableCell align='left'>
                {
                  row?.urls?.filter((url) => url?.status?.toString() === '504')
                    .length
                }
              </TableCell>
              <TableCell align='left'>
                {
                  row?.urls?.filter(
                    (url) =>
                      url?.status?.toString() !== '200' &&
                      url?.status?.toString() !== '301' &&
                      url?.status?.toString() !== '302' &&
                      url?.status?.toString() !== '404' &&
                      url?.status?.toString() !== '403' &&
                      url?.status?.toString() !== '500' &&
                      url?.status?.toString() !== '502' &&
                      url?.status?.toString() !== '503' &&
                      url?.status?.toString() !== '504'
                  ).length
                }
              </TableCell>
              <TableCell
                style={{ fontWeight: 'bold', color: 'blue' }}
                align='left'>
                {/* Show total links */}
                {row.urls.length}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

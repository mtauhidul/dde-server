import CloseIcon from '@mui/icons-material/Close';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { DataContext } from '..';

export default function DetailsTable() {
  const dataArray = React.useContext(DataContext);
  const { id } = useParams();
  const [key, setKey] = React.useState('');
  const [code, setCode] = React.useState('');
  const [keys, setKeys] = React.useState([]);
  const [tableData, setTableData] = React.useState([]);

  React.useEffect(() => {
    const data = dataArray[1].filter((domainData) => {
      return domainData.id.toString() === id;
    });
    setTableData(data);
  }, []);

  const onFilter = () => {
    const keysArray = keys;
    keysArray.push(key);
    setKeys(keysArray);
    setKey('');
  };

  const handleChange = (e) => {
    setCode(e.target.value);
  };

  const removeKey = (rKey) => {
    const newKeys = keys.filter((key) => key !== rKey);
    setKeys(newKeys);
  };

  console.log(tableData);

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContents: 'center',
          width: '600px',
          margin: '0 auto',
        }}>
        <TextField
          sx={{ margin: '0 auto', minWidth: '350px' }}
          id='outlined-basic'
          label='Filter and Remove URLs'
          variant='outlined'
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
        <Button
          sx={{ height: '54px', width: '100px', margin: '0 30px 0 10px' }}
          variant='contained'
          onClick={() => {
            if (key === '') {
              alert('Please input key!!!');
            } else {
              onFilter();
            }
          }}>
          Remove
        </Button>
        <FormControl sx={{ width: '120px' }}>
          <InputLabel id='demo-simple-select-label'>Filter By</InputLabel>
          <Select
            labelId='demo-simple-select-label'
            id='demo-simple-select'
            value={code}
            label='Filter By'
            onChange={handleChange}>
            <MenuItem value={null}>No Filter</MenuItem>
            <MenuItem value={200}>200</MenuItem>
            <MenuItem value={301}>301</MenuItem>
            <MenuItem value={302}>302</MenuItem>
            <MenuItem value={404}>404</MenuItem>
            <MenuItem value={403}>403</MenuItem>
            <MenuItem value={500}>500</MenuItem>
            <MenuItem value={502}>502</MenuItem>
            <MenuItem value={503}>503</MenuItem>
            <MenuItem value={504}>504</MenuItem>
          </Select>
        </FormControl>
      </div>
      <br />
      <div style={{ width: '600px', margin: '0 auto', height: 'auto' }}>
        {keys.map((key) => {
          return (
            <Button
              sx={{ marginRight: '10px' }}
              onClick={() => removeKey(key)}
              variant='outlined'
              endIcon={<CloseIcon />}>
              {key}
            </Button>
          );
        })}
      </div>
      <br />
      <hr />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
          <TableHead sx={{ background: '#B1F0ED', fontWeight: 'bold' }}>
            <TableRow>
              <TableCell>URL</TableCell>
              <TableCell align='right'>STATUS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData &&
              tableData[0]?.urls
                ?.sort((a, b) => Number(a.status) - Number(b.status))
                // if keys is empty, return all data else filter data based on keys array that means if any data includes any element of keys array, data will be filtered out and not shown
                .filter((data) => {
                  if (keys.length === 0) {
                    return data;
                  } else {
                    return !keys.some((key) => data.url.includes(key));
                  }
                })

                .filter((item) =>
                  code ? item.status === code : item.status === item.status
                )
                .map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                    }}>
                    <TableCell
                      style={{
                        color: 'royalblue',
                        fontWeight: 'bold',
                      }}
                      component='th'
                      scope='row'>
                      <a
                        style={{ textDecoration: 'none', color: 'royalblue' }}
                        target='_blank'
                        rel='noreferrer'
                        href={row.url}>
                        {row.url}
                      </a>
                    </TableCell>
                    {row.status === 200 && (
                      <TableCell
                        sx={{ color: 'green', fontWeight: 'bold' }}
                        align='right'>
                        {row.status}
                      </TableCell>
                    )}
                    {row.status === 404 && (
                      <TableCell
                        sx={{ color: 'red', fontWeight: 'bold' }}
                        align='right'>
                        {row.status}
                      </TableCell>
                    )}
                    {row.status === 301 && (
                      <TableCell
                        sx={{ color: 'orange', fontWeight: 'bold' }}
                        align='right'>
                        {row.status}
                      </TableCell>
                    )}
                    {row.status !== 200 &&
                      row.status !== 301 &&
                      row.status !== 404 && (
                        <TableCell
                          sx={{ color: 'royalblue', fontWeight: 'bold' }}
                          align='right'>
                          {row.status}
                        </TableCell>
                      )}
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

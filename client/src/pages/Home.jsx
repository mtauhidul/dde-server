import CheckIcon from '@mui/icons-material/Check';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  ToggleButton,
} from '@mui/material';
import Papa from 'papaparse';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '..';
import DomainList from '../components/DomainList';

const Home = () => {
  const dataArray = useContext(DataContext);
  const [domains, setDomains] = useState([]);
  const [timeFrame, setTimeFrame] = useState('');
  const [uploading, setUploading] = useState(true);
  const [selected, setSelected] = React.useState(false);
  const [limit, setLimit] = React.useState(0);

  const navigate = useNavigate();

  const handleFileUpload = (e) => {
    setUploading(true);
    const file = e.target.files[0];
    Papa.parse(file, {
      complete: (results) => {
        const newArray = results.data.slice(1, results.data.length - 1);
        setDomains(newArray);
        dataArray[0] = newArray;
        if (dataArray[1]) {
          dataArray.splice(1, 1);
        }
      },
    });
  };

  const handleChange = (event) => {
    setTimeFrame(event.target.value);
    dataArray[2] = {
      timeFrame: event.target.value,
    };
  };

  console.log(uploading);

  useEffect(() => {
    if (dataArray[1]) {
      setUploading(false);
    }
  }, []);

  useEffect(() => {
    dataArray[3] = {
      limit: limit,
    };
  }, [limit]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100vh',
      }}>
      {!uploading && (
        <Button
          variant='contained'
          component='label'
          sx={{ margin: '20px' }}
          onClick={() => {
            navigate('/result');
          }}>
          Go to results
        </Button>
      )}
      <div
        style={{
          maxWidth: '500px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Button
          variant='contained'
          component='label'
          sx={{ margin: '20px', height: '56px' }}>
          Upload Domain List
          <input onChange={handleFileUpload} hidden accept='.csv' type='file' />
        </Button>
        <FormControl sx={{ width: '160px' }}>
          <InputLabel id='demo-simple-select-label'>Time Frame</InputLabel>
          <Select
            labelId='demo-simple-select-label'
            id='demo-simple-select'
            value={timeFrame}
            label='Time Frame'
            onChange={handleChange}>
            <MenuItem value={'all'}>All Data</MenuItem>
            <MenuItem value={'old'}>One year back data</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div
        style={{
          width: '350px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <ToggleButton
          sx={{ height: '56px', marginRight: '15px' }}
          value='check'
          selected={selected}
          onChange={() => {
            setSelected(!selected);
          }}>
          <CheckIcon sx={{ marginRight: '10px' }} /> Data Limit
        </ToggleButton>
        {selected && (
          <TextField
            id='outlined-basic'
            label='Input limit'
            variant='outlined'
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
          />
        )}
      </div>
      <br />
      <DomainList domains={dataArray[0]} />
      {uploading && timeFrame && (
        <Button
          variant='contained'
          component='label'
          sx={{ margin: '20px', height: '56px' }}>
          Get URL Structure
          <input
            onClick={() => {
              if (domains.length > 0) {
                // set uploaded domains to context
                setUploading(false);
                navigate('/result');
              } else {
                alert('Please upload a domain list');
              }
            }}
            type='button'
            hidden
          />
        </Button>
      )}
    </div>
  );
};

export default Home;

import { Button } from '@mui/material';
import axios from 'axios';
import React, { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { HashLoader } from 'react-spinners';
import { DataContext } from '..';
import ResultTable from '../components/ResultTable';

const Result = () => {
  const dataArray = React.useContext(DataContext);
  const [loading, setLoading] = React.useState(true);

  const baseURL = 'https://dde-server.vercel.app';

  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    const domains = dataArray[0];
    const timeFrame = dataArray[2]?.timeFrame;
    const limit = dataArray[3]?.limit;
    try {
      const data = await axios.post(`${baseURL}/api`, {
        domains,
        timeFrame,
        limit,
      });

      dataArray[1] = data.data;
      setLoading(false);
      return dataArray;
    } catch (error) {
      toast.error(error.message, {
        duration: 50000,
      });
    }
  };

  useEffect(() => {
    if (dataArray[1] && dataArray[1].length > 0) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await handleSubmit();
    };
    if (!dataArray[1]) {
      fetchData();
    }
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100vh',
      }}>
      <Toaster />
      <Button variant='contained' component='label' sx={{ margin: '20px' }}>
        <a style={{ textDecoration: 'none', color: '#fff' }} href={baseURL}>
          Create a new request
        </a>
      </Button>
      <br />
      {loading ? <HashLoader color='#36d7b7' size={200} /> : <ResultTable />}
    </div>
  );
};

export default Result;

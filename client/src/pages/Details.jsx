import { Button } from '@mui/material';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DataContext } from '..';
import DetailsTable from '../components/DetailsTable';

const Details = () => {
  const dataArray = React.useContext(DataContext);

  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);

  const { id } = useParams();

  useEffect(() => {
    let tableData = dataArray[1].filter((domainData) => {
      return domainData.id.toString() === id;
    });
    if (tableData && tableData[0] && tableData[0].urls !== []) {
      setLoading(false);
    }
  }, [dataArray, id]);

  return (
    <div>
      <Button
        variant='contained'
        component='label'
        sx={{ margin: '20px' }}
        onClick={() => {
          navigate('/result');
        }}>
        Back to results
      </Button>
      <br />
      <DetailsTable />
    </div>
  );
};

export default Details;

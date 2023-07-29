import React, { useState, useEffect } from 'react';
import ScatterPlot from './components/ScatterPlot';
import BarPlot from './components/BarPlot';
import PiePlot from './components/PiePlot';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Grid,
  Box,
  Button,
  Typography,
  ButtonGroup,
} from '@mui/material';

interface DataPoint {
  [key: string]: number | string;
}

interface GraphProps {
  exampleData: DataPoint[];
  graphOptions: string[];
}

export function Graph({ exampleData, graphOptions }: GraphProps) {
  const [showLineGraph, setShowLineGraph] = useState(true);
  const [showBarGraph, setShowBarGraph] = useState(false);
  const [showPieGraph, setShowPieGraph] = useState(false);
  const [xKey, setXKey] = useState('');
  const [yKey, setYKey] = useState('');
  const [keyNames, setKeyNames] = useState<string[]>([]);

  useEffect(() => {
    if (exampleData.length > 0) {
      const columns = Object.keys(exampleData[0]);
      setKeyNames(columns);
      setXKey(columns[0]); // Assuming the first column name is xKey
      setYKey(columns[1]); // Assuming the second column name is yKey
    }
  }, [exampleData]);

  useEffect(() => {
    setShowLineGraph(false);
    setShowBarGraph(false);
    setShowPieGraph(false);

    // Show the respective graph based on xKey and yKey
    if (xKey !== '' && yKey !== '' && graphOptions.includes('Line Graph')) {
      setShowLineGraph(true);
      
    } else if (xKey !== '' && yKey !== '' && graphOptions.includes('Bar Graph')) {
      setShowBarGraph(true);
      
    } else if (xKey !== '' && yKey !== '' && graphOptions.includes('Pie Chart')) {
      setShowPieGraph(true);
    }
  }, [xKey, yKey, graphOptions]);


  const lineGraphClick = () => {
    setShowLineGraph(true);
    setShowBarGraph(false);
    setShowPieGraph(false);
  };

  const BarGraphClick = () => {
    setShowLineGraph(false);
    setShowBarGraph(true);
    setShowPieGraph(false);
  };

  const PieGraphClick = () => {
    setShowLineGraph(false);
    setShowBarGraph(false);
    setShowPieGraph(true);
  };

  const handleXKeyChange = (event: SelectChangeEvent<string>) => {
    setXKey(event.target.value);
    setShowLineGraph(false);
    setShowBarGraph(false);
    setShowPieGraph(false);
  };

  const handleYKeyChange = (event: SelectChangeEvent<string>) => {
    setYKey(event.target.value);
    setShowLineGraph(false);
    setShowBarGraph(false);
    setShowPieGraph(false);
  };

  return (
    <>
      {/* Dropdown for X Key */}
      <Box
        sx={{
            width: 400,
            height: 120,
            marginTop: '24px',
        }}
      >
        <Grid container spacing={1}>
            <Grid item xs={6} md={6}>
              <FormControl variant="standard" sx={{ m: 1, minWidth: 150 }}>
                <InputLabel htmlFor="x-key-select">X-axis</InputLabel>
                <Select
                  value={xKey}
                  onChange={handleXKeyChange}
                  label="X Key"
                  inputProps={{
                    name: 'xKey',
                    id: 'x-key-select',
                  }}
                >
                  {keyNames.map((keyName) => (
                    <MenuItem key={keyName} value={keyName}>
                      {keyName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={6}>
              <FormControl variant="standard" sx={{ m: 1, minWidth: 150 }}>
                  <InputLabel htmlFor="y-key-select">Y-axis</InputLabel>
                  <Select
                    value={yKey}
                    onChange={handleYKeyChange}
                    label="Y Key"
                    inputProps={{
                      name: 'yKey',
                      id: 'y-key-select',
                    }}
                  >
                    {keyNames.map((keyName) => (
                      <MenuItem key={keyName} value={keyName}>
                        {keyName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
          </Grid>
        </Box>
      

      {/* Dropdown for Y Key */}
      
      {graphOptions.length === 0 ? (
        <Typography variant="body1">To display a graph, please select the type of graph you want from the options available on the right side of the top navigation bar.</Typography>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <ButtonGroup variant="outlined" aria-label="outlined button group" sx={{ bgcolor: '#f0f0f0', color: 'black' }}>
              {graphOptions.includes('Line Graph') && (
                <Button onClick={lineGraphClick} sx={{ color: 'black' }}>Line Graph</Button>
              )}
              {graphOptions.includes('Bar Graph') && (
                <Button onClick={BarGraphClick} sx={{ color: 'black' }}>Bar Graph</Button>
              )}
              {graphOptions.includes('Pie Chart') && (
                <Button onClick={PieGraphClick} sx={{ color: 'black' }}>Pie Chart</Button>
              )}
            </ButtonGroup>
          </Grid>

          <Grid item xs={12}>
            {/* Graphs */}
            {showLineGraph && <ScatterPlot data={exampleData} xKey={xKey} yKey={yKey} />}
            {showBarGraph && <BarPlot data={exampleData} xKey={xKey} yKey={yKey} />}
            {showPieGraph && <PiePlot data={exampleData} xKey={xKey} yKey={yKey} />}
          </Grid>
        </Grid>
      )}
    </>
  );
}

import React, { useState, useEffect } from 'react';
import LinePlot from './components/LinePlot';
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
  const [showScatterGraph, setShowScatterGraph] = useState(false);
  const [xKey, setXKey] = useState('');
  const [yKey, setYKey] = useState('');
  const [keyNames, setKeyNames] = useState<string[]>([]);
  const [headng, setHeading] = useState('');

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
    setShowScatterGraph(false);

    // Show the respective graph based on xKey and yKey
    if (xKey !== '' && yKey !== '' && graphOptions.includes('Scatter Graph')) {
      setShowScatterGraph(true);
      setHeading('Scatter Graph');
    } else if (xKey !== '' && yKey !== '' && graphOptions.includes('Line Graph')) {
      setShowLineGraph(true);
      setHeading('Line Graph');
    } else if (xKey !== '' && yKey !== '' && graphOptions.includes('Bar Graph')) {
      setShowBarGraph(true);
      setHeading('Bar Graph');
    } else if (xKey !== '' && yKey !== '' && graphOptions.includes('Pie Chart')) {
      setShowPieGraph(true);
      setHeading('Pie Chart');
    }
  }, [xKey, yKey, graphOptions]);

  const lineGraphClick = () => {
    setShowLineGraph(true);
    setShowBarGraph(false);
    setShowPieGraph(false);
    setShowScatterGraph(false);
    setHeading('Line Graph');
  };

  const BarGraphClick = () => {
    setShowLineGraph(false);
    setShowBarGraph(true);
    setShowPieGraph(false);
    setShowScatterGraph(false);
    setHeading('Bar Graph');
  };

  const PieGraphClick = () => {
    setShowLineGraph(false);
    setShowBarGraph(false);
    setShowPieGraph(true);
    setShowScatterGraph(false);
    setHeading('Pie Chart');
  };

  const ScatterGraphClick = () => {
    setShowLineGraph(false);
    setShowBarGraph(false);
    setShowPieGraph(false);
    setShowScatterGraph(true);
    setHeading('Scatter Graph');
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
    <Grid container spacing={2} justifyContent="center"> {/* Center the main container */}
      {/* Dropdown for X Key and Y Key in a single row */}
      <Grid item xs={12} sx={{ textAlign: 'center' }}>
        <Box
          sx={{
            width: 400,
            height: 120,
            marginTop: '24px',
            display: 'inline-flex', // Use inline-flex to place the items in a single row
            justifyContent: 'space-between', // Add space between X and Y dropdowns
          }}
        >
          <FormControl variant="outlined" sx={{ minWidth: 150 }}>
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

          <FormControl variant="outlined" sx={{ minWidth: 150 }}>
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
        </Box>
      </Grid>

      {/* ... (rest of the code) */}

      {graphOptions.length === 0 ? (
        <Grid item xs={12} sx={{ textAlign: 'center' }}>
          <Typography variant="body1">
            To display a graph, please select the type of graph you want from the options available on the right side of
            the top navigation bar.
          </Typography>
        </Grid>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ textAlign: 'center' }}>
            <ButtonGroup variant="outlined" aria-label="outlined button group">
              {graphOptions.includes('Scatter Graph') && (
                <Button
                  onClick={ScatterGraphClick}
                  sx={{ backgroundColor: showScatterGraph ? '#ccc' : 'transparent' }} // Change the background color when the button is selected
                >
                  Scatter Graph
                </Button>
              )}
              {graphOptions.includes('Line Graph') && (
                <Button
                  onClick={lineGraphClick}
                  sx={{ backgroundColor: showLineGraph ? '#ccc' : 'transparent' }} // Change the background color when the button is selected
                >
                  Line Graph
                </Button>
              )}
              {graphOptions.includes('Bar Graph') && (
                <Button
                  onClick={BarGraphClick}
                  sx={{ backgroundColor: showBarGraph ? '#ccc' : 'transparent' }} // Change the background color when the button is selected
                >
                  Bar Graph
                </Button>
              )}
              {graphOptions.includes('Pie Chart') && (
                <Button
                  onClick={PieGraphClick}
                  sx={{ backgroundColor: showPieGraph ? '#ccc' : 'transparent' }} // Change the background color when the button is selected
                >
                  Pie Chart
                </Button>
              )}
            </ButtonGroup>
          </Grid>
          <Grid item xs={12} sx={{ textAlign: 'center' }}>
            <Typography variant="h4" component="h2">
              {headng}
            </Typography>
          </Grid>

          <Grid container item xs={12} justifyContent="center" alignItems="center">
            {showLineGraph && <LinePlot data={exampleData} xKey={xKey} yKey={yKey} />}
            {showScatterGraph && <ScatterPlot data={exampleData} xKey={xKey} yKey={yKey} />}
            {showBarGraph && <BarPlot data={exampleData} xKey={xKey} yKey={yKey} />}
            {showPieGraph && <PiePlot data={exampleData} xKey={xKey} yKey={yKey} />}
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

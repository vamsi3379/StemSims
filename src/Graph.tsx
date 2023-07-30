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
  const [showLineGraph, setShowLineGraph] = useState(false);
  const [showBarGraph, setShowBarGraph] = useState(false);
  const [showPieGraph, setShowPieGraph] = useState(false);
  const [showScatterGraph, setShowScatterGraph] = useState(false);
  const [xKey, setXKey] = useState('');
  const [yKey, setYKey] = useState('');
  const [keyNames, setKeyNames] = useState<string[]>([]);
  const [headng, setHeading] = useState(graphOptions[0]);

  useEffect(() => {
    if (exampleData.length > 0) {
      const columns = Object.keys(exampleData[0]);
      setKeyNames(columns);
      setXKey(columns[0]);
      setYKey(columns[1]);

    }
  }, [exampleData]);

  useEffect(() => {
    if (showLineGraph===false && showScatterGraph===false && showBarGraph===false && showPieGraph===false){
    setShowLineGraph(false);
    setShowBarGraph(false);
    setShowPieGraph(false);
    setShowScatterGraph(false);

    if (xKey !== '' && yKey !== '' && graphOptions.includes('Scatter Plot')) {
      setShowScatterGraph(true);
      setHeading('Scatter Plot');
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
  }
  }, [xKey, yKey, showLineGraph, showScatterGraph, showBarGraph, showPieGraph, graphOptions]);

  const changeShow = (a:boolean, b:boolean, c:boolean, d:boolean) => {
    setShowLineGraph(a);
    setShowBarGraph(b);
    setShowPieGraph(c);
    setShowScatterGraph(d);
  }

  const lineGraphClick = () => {
    changeShow(true,false, false,false)
    setHeading('Line Graph');
  };

  const BarGraphClick = () => {
    changeShow(false,true, false,false)
    setHeading('Bar Graph');
  };

  const PieGraphClick = () => {
    changeShow(false,false, true,false)
    setHeading('Pie Chart');
  };

  const ScatterGraphClick = () => {
    changeShow(false,false, false,true)
    setHeading('Scatter Plot');
  };
  

  const handleXKeyChange = (event: SelectChangeEvent<string>) => {
    setXKey(event.target.value);
  };

  const handleYKeyChange = (event: SelectChangeEvent<string>) => {
    setYKey(event.target.value);
  };

  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid item xs={12} sx={{ textAlign: 'center' }}>
        <Box
          sx={{
            width: 400,
            height: 120,
            marginTop: '24px',
            display: 'inline-flex',
            justifyContent: 'space-between',
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
          <Typography variant="body1" sx={{ fontFamily: 'avenir next' }}>
            To display a graph, please select modify the settings you want from the options available on the right side of
            the top navigation bar.
          </Typography>
        </Grid>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ textAlign: 'center' }}>
            <ButtonGroup variant="outlined" aria-label="outlined button group">
              {graphOptions.includes('Scatter Plot') && (
                <Button
                  onClick={ScatterGraphClick}
                  sx={{ backgroundColor: showScatterGraph ? '#ccc' : 'transparent', fontFamily: 'avenir next' }} 
                >
                  Scatter Plot
                </Button>
              )}
              {graphOptions.includes('Line Graph') && (
                <Button
                  onClick={lineGraphClick}
                  sx={{ backgroundColor: showLineGraph ? '#ccc' : 'transparent', fontFamily: 'avenir next' }}
                >
                  Line Graph
                </Button>
              )}
              {graphOptions.includes('Bar Graph') && (
                <Button
                  onClick={BarGraphClick}
                  sx={{ backgroundColor: showBarGraph ? '#ccc' : 'transparent', fontFamily: 'avenir next' }}
                >
                  Bar Graph
                </Button>
              )}
              {graphOptions.includes('Pie Chart') && (
                <Button
                  onClick={PieGraphClick}
                  sx={{ backgroundColor: showPieGraph ? '#ccc' : 'transparent', fontFamily: 'avenir next' }}
                >
                  Pie Chart
                </Button>
              )}
            </ButtonGroup>
          </Grid>
          <Grid item xs={12} sx={{ textAlign: 'center' }}>
            <Typography variant="h4" component="h2" sx={{ fontFamily: 'avenir next' }}>
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

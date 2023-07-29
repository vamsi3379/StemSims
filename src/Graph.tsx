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
      <FormControl variant="outlined">
        <InputLabel htmlFor="x-key-select">X Key</InputLabel>
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

      {/* Dropdown for Y Key */}
      <FormControl variant="outlined">
        <InputLabel htmlFor="y-key-select">Y Key</InputLabel>
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

      <ul>
        {graphOptions.includes('Line Graph') && (
          <button onClick={lineGraphClick}>Line Graph</button>
        )}
        {graphOptions.includes('Bar Graph') && (
          <button onClick={BarGraphClick}>Bar Graph</button>
        )}
        {graphOptions.includes('Pie Chart') && (
          <button onClick={PieGraphClick}>Pie Chart</button>
        )}
      </ul>

      {/* Graphs */}
      {showLineGraph && <ScatterPlot data={exampleData} xKey={xKey} yKey={yKey} />}
      {showBarGraph && <BarPlot data={exampleData} xKey={xKey} yKey={yKey} />}
      {showPieGraph && <PiePlot data={exampleData} xKey={xKey} yKey={yKey} />}
    </>
  );
}

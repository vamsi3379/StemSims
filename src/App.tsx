import React, { useState } from 'react';
import { exampleData } from './initialData';
import { Graph } from './Graph';
import NavBar from './components/NavBar';

const App: React.FC = () => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleOptionChange = (option: string[]) => {
    setSelectedOptions(option);
  };

  return (
    <React.Fragment>
      <NavBar
        options={['Scatter Plot', 'Line Graph', 'Bar Graph', 'Pie Chart']}
        selectedOption={selectedOptions}
        onOptionChange={handleOptionChange}
      />
      <Graph exampleData={exampleData} graphOptions={selectedOptions} />
    </React.Fragment>
  );
};

export default App;

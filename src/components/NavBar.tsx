import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface NavBarProps {
    options: string[];
    selectedOption: string[]; // Update to string[] to handle multiple selection
    onOptionChange: (option: string[]) => void;
}

const NavBar: React.FC<NavBarProps> = ({ options, selectedOption, onOptionChange }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOptionChange = (event: SelectChangeEvent<string | string[]>) => {
    const selectedValue = event.target.value;
    const newSelectedOption = Array.isArray(selectedValue)
      ? selectedValue // Already an array, no need to convert
      : [selectedValue]; // Convert single string to an array
    onOptionChange(newSelectedOption);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Plot Graph
        </Typography>
        <div>
          <Select
            labelId="demo-multiple-name-label"
            id="demo-multiple-name"
            multiple // Set the multiple prop to true for multiple select
            value={selectedOption}
            onChange={handleOptionChange}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            onOpen={handleMenuOpen as any}
          >
            {options.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
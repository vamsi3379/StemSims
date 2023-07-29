import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';

interface NavBarProps {
  options: string[];
  selectedOption: string[]; // Update to string[] to handle multiple selection
  onOptionChange: (option: string[]) => void;
}

const NavBar: React.FC<NavBarProps> = ({ options, selectedOption, onOptionChange }) => {
  const [modalOpen, setModalOpen] = useState(false); // New state to track modal open/closed

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontFamily: 'avenir next' }}>
          Plot Graph
        </Typography>
        <div>
          {/* Settings button */}
          <IconButton onClick={handleModalOpen} color="inherit">
            <SettingsIcon />
          </IconButton>
          <Dialog open={modalOpen} onClose={handleModalClose}>
            {/* Use DialogTitle with fontFamily set to 'avenir next' */}
            <DialogTitle sx={{ fontFamily: 'avenir next' }}>Admin Functionality</DialogTitle>
            <DialogContent sx={{ fontFamily: 'avenir next' }}>
              {options.map((option) => (
                <MenuItem key={option} sx={{ fontFamily: 'avenir next' }}>
                  <ListItemText  primary={option} sx={{ fontFamily: 'avenir next' }} />
                  <Switch
                    color='secondary'
                    checked={selectedOption.indexOf(option) > -1}
                    onChange={() => {
                      const newSelectedOption = selectedOption.includes(option)
                        ? selectedOption.filter((item) => item !== option)
                        : [...selectedOption, option];
                      onOptionChange(newSelectedOption);
                    }}
                  />
                </MenuItem>
              ))}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleModalClose} sx={{ fontFamily: 'avenir next' }}>Close</Button>
            </DialogActions>
          </Dialog>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;

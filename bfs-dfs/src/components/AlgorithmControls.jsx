import React from 'react';
import { Button, Box } from '@mui/material';

function AlgorithmControls({ mode, onNextStep, disabled }) {
  if (mode !== 'Manual') return null;

  return (
    <Box sx={{ my: 2 }}>
      <Button
        variant="contained"
        onClick={onNextStep}
        disabled={disabled}
      >
        Bước tiếp theo
      </Button>
    </Box>
  );
}

export default AlgorithmControls;
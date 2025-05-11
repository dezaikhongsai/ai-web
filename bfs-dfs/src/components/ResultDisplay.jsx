import React from 'react';
import { Typography, Box } from '@mui/material';

function ResultDisplay({ path, time }) {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6">Kết quả</Typography>
      <Typography>Đường đi: {path.length ? path.join(' -> ') : 'Chưa có đường đi'}</Typography>
      <Typography>Thời gian xử lý: {time.toFixed(2)} ms</Typography>
    </Box>
  );
}

export default ResultDisplay;
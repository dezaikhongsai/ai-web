import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

function ResultDisplay({ path, time, totalCost }) {
  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Box>
        <Typography variant="subtitle1" gutterBottom>
          Kết quả
        </Typography>
        <Typography>
          Đường đi: {path.length > 0 ? path.join(' → ') : 'Chưa có đường đi'}
        </Typography>
        <Typography>
          Thời gian xử lý: {time.toFixed(2)} ms
        </Typography>
        {totalCost !== undefined && (
          <Typography>
            Tổng chi phí: {totalCost}
          </Typography>
        )}
      </Box>
    </Paper>
  );
}

export default ResultDisplay;
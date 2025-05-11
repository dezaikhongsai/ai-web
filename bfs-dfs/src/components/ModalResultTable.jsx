import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper } from '@mui/material';

function ModalResultTable({ steps }) {
  return (
    <>
      <Typography variant="h6" align="center" gutterBottom>
        Bảng chi tiết các bước duyệt
      </Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Expanded node</TableCell>
              <TableCell>Open node list (Queue/Stack)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {steps.map((step, idx) => (
              <TableRow key={idx}>
                <TableCell>{idx}</TableCell>
                <TableCell>{typeof step.expanded !== 'undefined' ? `Node ${step.expanded}` : ''}</TableCell>
                <TableCell>{step.open ? step.open.map(n => `Node ${n}`).join(', ') : ''}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default ModalResultTable; 
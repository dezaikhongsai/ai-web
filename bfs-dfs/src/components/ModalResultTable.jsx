import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper } from '@mui/material';

function ModalResultTable({ steps  , mode , endNode , graph }) {
  // Kiểm tra xem steps có chứa thông tin về độ sâu không (thuật toán IDS)
  const hasDepthInfo = steps.length > 0 && steps[0].hasOwnProperty('depth');
  const hasMessages = steps.length > 0 && steps[0].hasOwnProperty('message');
  // Kiểm tra xem steps có chứa thông tin về chi phí không (thuật toán UCS)
  const hasCostInfo = steps.length > 0 && steps[0].hasOwnProperty('costs');
  return (
    <>
      <Typography variant="h6" align="center" gutterBottom>
        Bảng chi tiết các bước duyệt
      </Typography>
      <TableContainer component={Paper } sx={{ maxHeight: 400, overflowY: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Expanded node</TableCell>
              <TableCell>Open node list (Queue/Stack)</TableCell>
              {hasDepthInfo && <TableCell>Độ sâu / Độ sâu hiện tại</TableCell>}
              {hasCostInfo && <TableCell>Chi phí</TableCell>}
              {hasMessages && <TableCell>Thông báo</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {steps.map((step, idx) => (
              <TableRow key={idx}>
                <TableCell>{idx}</TableCell>
                <TableCell>
                  {typeof step.expanded !== 'undefined' && step.expanded !== null 
                    ? `Node ${step.expanded}` 
                    : '-'}
                </TableCell>
                <TableCell>
                  {(() => {
                    if (mode === 'DFS' && step.expanded === endNode) {
                      return '';
                    }

                    if (mode === 'UCS' && step.expanded !== null && graph) {
                      // Tìm các node hàng xóm của node đang mở rộng
                      const neighbors = graph.edges
                        .filter(edge => edge[0] === step.expanded)
                        .map(edge => edge[1]);

                      // Tránh lặp lại node đã có trong open
                      const extra = neighbors.filter(n => !step.open.includes(n));
                      const fullList = [...step.open, ...extra];
                      return fullList.map(n => `Node ${n}`).join(', ');
                    }

                    return step.open ? step.open.map(n => `Node ${n}`).join(', ') : '';
                  })()}
                </TableCell>
                {hasDepthInfo && (
                  <TableCell>
                    {`${step.currentDepth || 0} / ${step.depth || 0}`}
                  </TableCell>
                )}
                {hasCostInfo && (
                  <TableCell>
                    {step.expanded !== null && step.expanded !== undefined
                      ? `Chi phí đến node ${step.expanded}: ${step.costs[step.expanded] !== Infinity ? step.costs[step.expanded] : 'N/A'}`
                      : '-'}
                  </TableCell>
                )}
                {hasMessages && (
                  <TableCell>
                    {step.message || ''}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
export default ModalResultTable; 
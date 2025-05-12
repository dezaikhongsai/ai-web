import React, { useState, useEffect } from 'react';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, Box, Slider, Typography, Alert } from '@mui/material';

function GraphForm({ onSubmit, setAlgorithm, setMode, mode, speed, onSpeedChange }) {
  const [nodes, setNodes] = useState('');
  const [edges, setEdges] = useState('');
  const [startNode, setStartNode] = useState('0');
  const [endNode, setEndNode] = useState('');
  const [algorithm, setLocalAlgorithm] = useState('BFS'); // Local state for algorithm
  const [localMode, setLocalMode] = useState('Auto'); // Local state for mode
  const [maxDepth, setMaxDepth] = useState('5'); // Độ sâu tối đa cho IDS
  const [edgeFormat, setEdgeFormat] = useState('Định dạng: u,v (mỗi dòng)');

  useEffect(() => {
    // Cập nhật định dạng ví dụ khi thay đổi thuật toán
    if (algorithm === 'UCS') {
      setEdgeFormat('Định dạng: u,v,cost (mỗi dòng)');
    } else {
      setEdgeFormat('Định dạng: u,v (mỗi dòng)');
    }
  }, [algorithm]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const nodeCount = parseInt(nodes);
    let edgeList = [];
    
    // Xử lý định dạng cạnh tùy thuộc vào thuật toán
    if (algorithm === 'UCS') {
      edgeList = edges
        .split('\n')
        .map(line => {
          const parts = line.split(',');
          if (parts.length === 3) {
            const u = parseInt(parts[0]);
            const v = parseInt(parts[1]);
            const cost = parseFloat(parts[2]);
            if (!isNaN(u) && !isNaN(v) && !isNaN(cost)) {
              return [u, v, cost];
            }
          }
          return null;
        })
        .filter(edge => edge !== null);
    } else {
      edgeList = edges
        .split('\n')
        .map(line => line.split(',').map(Number))
        .filter(line => line.length === 2 && !isNaN(line[0]) && !isNaN(line[1]));
    }

    onSubmit({ 
      nodes: nodeCount, 
      edges: edgeList,
      startNode: parseInt(startNode),
      endNode: endNode ? parseInt(endNode) : null,
      maxDepth: parseInt(maxDepth)
    });
  };

  const handleAlgorithmChange = (e) => {
    setLocalAlgorithm(e.target.value);
    setAlgorithm(e.target.value); // Update parent state
  };

  const handleModeChange = (e) => {
    setLocalMode(e.target.value);
    setMode(e.target.value); // Update parent state
  };

  const handleSpeedChange = (event, newValue) => {
    onSpeedChange(newValue);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
      <TextField
        label="Số đỉnh"
        type="number"
        value={nodes}
        onChange={(e) => setNodes(e.target.value)}
        fullWidth
        margin="normal"
        required
        inputProps={{ min: 1 }}
      />
      <TextField
        label={`Danh sách cạnh (${edgeFormat})`}
        multiline
        rows={4}
        value={edges}
        onChange={(e) => setEdges(e.target.value)}
        fullWidth
        margin="normal"
        placeholder={algorithm === 'UCS' ? "0,1,5\n1,2,3\n2,3,2" : "0,1\n1,2\n2,3"}
        required
      />
      {algorithm === 'UCS' && (
        <Alert severity="info" sx={{ mt: 1, mb: 1 }}>
          Định dạng cạnh cho UCS: u,v,cost (ví dụ: 0,1,5 có nghĩa là cạnh từ node 0 đến node 1 với chi phí 5)
        </Alert>
      )}
      <TextField
        label="Node bắt đầu"
        type="number"
        value={startNode}
        onChange={(e) => setStartNode(e.target.value)}
        fullWidth
        margin="normal"
        required
        inputProps={{ min: 0 }}
      />
      <TextField
        label="Node kết thúc (không bắt buộc)"
        type="number"
        value={endNode}
        onChange={(e) => setEndNode(e.target.value)}
        fullWidth
        margin="normal"
        inputProps={{ min: 0 }}
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>Thuật toán</InputLabel>
        <Select
          value={algorithm}
          onChange={handleAlgorithmChange}
        >
          <MenuItem value="BFS">BFS</MenuItem>
          <MenuItem value="DFS">DFS</MenuItem>
          <MenuItem value="IDS">IDS (Tìm kiếm sâu dần)</MenuItem>
          <MenuItem value="UCS">UCS (Tìm kiếm theo chi phí đồng nhất)</MenuItem>
        </Select>
      </FormControl>
      
      {algorithm === 'IDS' && (
        <TextField
          label="Độ sâu tối đa"
          type="number"
          value={maxDepth}
          onChange={(e) => setMaxDepth(e.target.value)}
          fullWidth
          margin="normal"
          required
          inputProps={{ min: 1 }}
        />
      )}
      
      <FormControl fullWidth margin="normal">
        <InputLabel>Chế độ</InputLabel>
        <Select
          value={localMode}
          onChange={handleModeChange}
        >
          <MenuItem value="Auto">Tự động</MenuItem>
          <MenuItem value="Manual">Thủ công</MenuItem>
        </Select>
      </FormControl>
      {localMode === 'Auto' && (
        <Box sx={{ mt: 2 }}>
          <Typography gutterBottom>
            Tốc độ hiển thị: {speed}ms
          </Typography>
          <Slider
            value={speed}
            onChange={handleSpeedChange}
            min={200}
            max={2000}
            step={100}
            marks={[
              { value: 200, label: 'Nhanh' },
              { value: 1000, label: 'Trung bình' },
              { value: 2000, label: 'Chậm' }
            ]}
          />
        </Box>
      )}
      <Button type="submit" variant="contained" sx={{ mt: 2 }}>
        Hiển thị đồ thị
      </Button>
    </Box>
  );
}

export default GraphForm;
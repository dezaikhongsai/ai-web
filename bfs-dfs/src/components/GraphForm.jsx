import React, { useState } from 'react';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, Box, Slider, Typography } from '@mui/material';

function GraphForm({ onSubmit, setAlgorithm, setMode, mode, speed, onSpeedChange }) {
  const [nodes, setNodes] = useState('');
  const [edges, setEdges] = useState('');
  const [startNode, setStartNode] = useState('0');
  const [endNode, setEndNode] = useState('');
  const [algorithm, setLocalAlgorithm] = useState('BFS'); // Local state for algorithm
  const [localMode, setLocalMode] = useState('Auto'); // Local state for mode

  const handleSubmit = (e) => {
    e.preventDefault();
    const nodeCount = parseInt(nodes);
    const edgeList = edges
      .split('\n')
      .map(line => line.split(',').map(Number))
      .filter(line => line.length === 2 && !isNaN(line[0]) && !isNaN(line[1])); // Basic validation
    onSubmit({ 
      nodes: nodeCount, 
      edges: edgeList,
      startNode: parseInt(startNode),
      endNode: endNode ? parseInt(endNode) : null
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
        label="Danh sách cạnh (định dạng: u,v mỗi dòng)"
        multiline
        rows={4}
        value={edges}
        onChange={(e) => setEdges(e.target.value)}
        fullWidth
        margin="normal"
        placeholder="0,1\n1,2\n2,3"
        required
      />
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
        </Select>
      </FormControl>
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
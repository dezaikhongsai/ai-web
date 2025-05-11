import React, { useState } from 'react';
import { Container, Typography, Box, Button, Modal } from '@mui/material';
import GraphForm from './components/GraphForm';
import GraphVisualizer from './components/GraphVisualizer';
import AlgorithmControls from './components/AlgorithmControls';
import ResultDisplay from './components/ResultDisplay';
import { bfs } from './algorithms/bfs';
import { dfs } from './algorithms/dfs';
import './index.css';
import ModalResultTable from './components/ModalResultTable';

function App() {
  const [graph, setGraph] = useState(null);
  const [algorithm, setAlgorithm] = useState('BFS');
  const [mode, setMode] = useState('Auto');
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [path, setPath] = useState([]);
  const [time, setTime] = useState(0);
  const [speed, setSpeed] = useState(1000); // Speed in milliseconds
  const [openModal, setOpenModal] = useState(false);

  const handleSubmit = (input) => {
    const { nodes, edges, startNode, endNode } = input;
    setGraph({ nodes, edges, startNode, endNode });

    const startTime = performance.now();
    const result = algorithm === 'BFS' ? bfs(nodes, edges, startNode, endNode) : dfs(nodes, edges, startNode, endNode);
    const endTime = performance.now();

    setSteps(result.steps);
    setPath(result.path);
    setTime(endTime - startTime);
    setCurrentStep(0);
  };

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Mô phỏng thuật toán BFS và DFS
        </Typography>
        <GraphForm
          onSubmit={handleSubmit}
          setAlgorithm={setAlgorithm}
          setMode={setMode}
          mode={mode}
          speed={speed}
          onSpeedChange={handleSpeedChange}
        />
        {graph && (
          <>
            <Button variant="outlined" onClick={() => setOpenModal(true)} sx={{ mb: 2 }}>
              Kết quả chi tiết
            </Button>
            <GraphVisualizer
              graph={graph}
              steps={steps}
              currentStep={currentStep}
              mode={mode}
              setCurrentStep={setCurrentStep}
              speed={speed}
            />
            <AlgorithmControls
              mode={mode}
              onNextStep={handleNextStep}
              disabled={currentStep >= steps.length - 1}
            />
            <ResultDisplay path={path} time={time} />
            <Modal open={openModal} onClose={() => setOpenModal(false)}>
              <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, minWidth: 400 }}>
                <ModalResultTable steps={steps} />
              </Box>
            </Modal>
          </>
        )}
      </Box>
    </Container>
  );
}

export default App;
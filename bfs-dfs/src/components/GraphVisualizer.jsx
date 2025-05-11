import React, { useEffect } from 'react';
import { ReactP5Wrapper } from 'react-p5-wrapper';

function GraphVisualizer({ graph, steps, currentStep, mode, setCurrentStep, speed }) {
  const sketch = (p5) => {
    let nodes = [];
    let edges = graph.edges;

    p5.setup = () => {
      p5.createCanvas(600, 400);
      // Tính toán vị trí các node theo hình tròn
      const radius = 150;
      const centerX = p5.width / 2;
      const centerY = p5.height / 2;
      for (let i = 0; i < graph.nodes; i++) {
        const angle = (2 * Math.PI * i) / graph.nodes;
        nodes.push({
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle),
          visited: false,
        });
      }
    };

    // Hàm vẽ mũi tên
    const drawArrow = (x1, y1, x2, y2) => {
      const headLength = 10;
      const angle = Math.atan2(y2 - y1, x2 - x1);
      // Tính toán điểm cuối của mũi tên (ngắn hơn một chút so với node đích)
      const endX = x2 - 15 * Math.cos(angle);
      const endY = y2 - 15 * Math.sin(angle);
      // Vẽ đường thẳng
      p5.line(x1, y1, endX, endY);
      // Vẽ đầu mũi tên
      p5.push();
      p5.translate(endX, endY);
      p5.rotate(angle);
      p5.line(0, 0, -headLength, -headLength/2);
      p5.line(0, 0, -headLength, headLength/2);
      p5.pop();
    };

    p5.draw = () => {
      p5.background(255);
      // Vẽ cạnh với mũi tên cho tất cả các cạnh
      p5.stroke(0);
      p5.strokeWeight(1);
      for (let edge of edges) {
        const [u, v] = edge;
        drawArrow(nodes[u].x, nodes[u].y, nodes[v].x, nodes[v].y);
      }
      // Vẽ node
      for (let i = 0; i < nodes.length; i++) {
        if (steps[currentStep] && steps[currentStep].expanded === i) {
          p5.fill('#FF9800'); // Node đang được duyệt: màu cam
          p5.stroke('#F57C00');
        } else if (nodes[i].visited) {
          p5.fill('#2196F3'); // Đã duyệt: xanh dương
          p5.stroke('#1976D2');
        } else {
          p5.fill('#e0e0e0'); // Chưa duyệt: xám nhạt
          p5.stroke('#000');
        }
        p5.strokeWeight(2);
        p5.ellipse(nodes[i].x, nodes[i].y, 30, 30);
        p5.fill(0);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.text(i, nodes[i].x, nodes[i].y);
      }
      // Cập nhật trạng thái node theo bước hiện tại
      if (steps[currentStep]) {
        for (let i = 0; i < nodes.length; i++) {
          nodes[i].visited = steps[currentStep].visited.includes(i);
        }
      }
    };
  };

  useEffect(() => {
    let timer;
    if (mode === 'Auto' && currentStep < steps.length - 1) {
      timer = setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, speed);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [currentStep, steps, mode, speed, setCurrentStep]);

  return <ReactP5Wrapper sketch={sketch} />;
}

export default GraphVisualizer;
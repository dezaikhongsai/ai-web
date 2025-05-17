import React, { useEffect } from 'react';
import { ReactP5Wrapper } from 'react-p5-wrapper';

function GraphVisualizer({ graph, steps, currentStep, mode, setCurrentStep, speed }) {
  const sketch = (p5) => {
    let nodes = [];
    let edges = graph.edges;
    const isIDS = steps.length > 0 && steps[0].hasOwnProperty('depth');
    const isUCS = steps.length > 0 && steps[0].hasOwnProperty('costs');
    const hasEdgeCosts = edges.length > 0 && edges[0].length > 2;

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
    const drawArrow = (x1, y1, x2, y2, cost = null) => {
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
      
      // Hiển thị chi phí nếu có
      if (cost !== null) {
        // Vị trí giữa cạnh để hiển thị cost
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        
        // Tạo nền cho text để dễ đọc
        p5.push();
        p5.fill(255, 255, 255, 200);
        p5.noStroke();
        p5.ellipse(midX, midY, 24, 24);
        
        // Hiển thị chi phí
        p5.fill(0);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.textSize(12);
        p5.text(cost, midX, midY);
        p5.pop();
      }
    };

    p5.draw = () => {
      p5.background(255);
      
      // Hiển thị thông tin độ sâu cho IDS - nhẹ nhàng ở góc phải
      if (isIDS && steps[currentStep]) {
        // Tạo một khung hiển thị thông tin nhẹ nhàng
        p5.push();
        p5.fill(245, 245, 245, 220); // Màu nền nhẹ nhàng với độ trong suốt
        p5.stroke(200, 200, 200);
        p5.strokeWeight(1);
        p5.rect(p5.width - 210, 10, 200, 70, 5); // Vẽ một hộp có góc bo tròn
        
        // Hiển thị thông tin độ sâu
        p5.fill(80, 80, 80);
        p5.noStroke();
        p5.textSize(14);
        p5.textAlign(p5.LEFT, p5.TOP);
        p5.text(`Độ sâu tối đa: ${steps[currentStep].depth}`, p5.width - 200, 20);
        
        if (steps[currentStep].expanded !== undefined && steps[currentStep].expanded !== null) {
          const nodeDepth = steps[currentStep].currentDepth;
          p5.text(`Độ sâu hiện tại: ${nodeDepth}`, p5.width - 200, 45);
        }
        p5.pop();
      }
      
      // Hiển thị thông tin chi phí cho UCS - nhẹ nhàng ở góc phải
      if (isUCS && steps[currentStep]) {
        // Tạo một khung hiển thị thông tin nhẹ nhàng
        p5.push();
        p5.fill(245, 245, 245, 220); // Màu nền nhẹ nhàng với độ trong suốt
        p5.stroke(200, 200, 200);
        p5.strokeWeight(1);
        p5.rect(p5.width - 210, 10, 200, 70, 5); // Vẽ một hộp có góc bo tròn
        
        // Hiển thị thông tin chi phí
        p5.fill(80, 80, 80);
        p5.noStroke();
        p5.textSize(14);
        p5.textAlign(p5.LEFT, p5.TOP);
        p5.text(`Tổng chi phí: ${steps[currentStep].totalCost}`, p5.width - 200, 20);
        
        if (steps[currentStep].expanded !== undefined && steps[currentStep].expanded !== null) {
          const costs = steps[currentStep].costs;
          const nodeCost = costs[steps[currentStep].expanded] !== Infinity 
                           ? costs[steps[currentStep].expanded] 
                           : 'N/A';
          p5.text(`Chi phí đến node ${steps[currentStep].expanded}: ${nodeCost}`, p5.width - 200, 45);
        }
        p5.pop();
      }
      
      // Vẽ cạnh với mũi tên cho tất cả các cạnh
      p5.stroke(0);
      p5.strokeWeight(1);
      for (let edge of edges) {
        if (hasEdgeCosts) {
          const [u, v, cost] = edge;
          drawArrow(nodes[u].x, nodes[u].y, nodes[v].x, nodes[v].y, cost);
        } else {
          const [u, v] = edge;
          drawArrow(nodes[u].x, nodes[u].y, nodes[v].x, nodes[v].y);
        }
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
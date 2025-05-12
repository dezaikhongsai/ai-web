export function ucs(nodes, edges, startNode = 0, endNode = null) {
  // Tạo danh sách kề với cost
  const adjList = Array.from({ length: nodes }, () => []);
  for (const [u, v, cost] of edges) {
    adjList[u].push({ node: v, cost });
    adjList[v].push({ node: u, cost });
  }

  // Khởi tạo các biến
  const steps = [];
  const visited = new Set();
  const gCost = Array(nodes).fill(Infinity);
  const parent = Array(nodes).fill(-1);
  gCost[startNode] = 0;

  // Hàng đợi ưu tiên cho UCS
  const priorityQueue = [{ node: startNode, cost: 0 }];
  const path = [];

  steps.push({
    expanded: null,
    open: [startNode],
    visited: [],
    costs: [...gCost],
    totalCost: 0,
    message: "Khởi tạo thuật toán UCS"
  });

  while (priorityQueue.length > 0) {
    // Sắp xếp hàng đợi theo chi phí tăng dần
    priorityQueue.sort((a, b) => a.cost - b.cost);
    
    // Lấy node có chi phí thấp nhất
    const { node: current, cost: currentCost } = priorityQueue.shift();
    
    // Kiểm tra nếu node đã được duyệt
    if (visited.has(current)) {
      continue;
    }
    
    // Đánh dấu node đã được duyệt
    visited.add(current);
    path.push(current);
    
    // Thêm bước duyệt vào steps
    steps.push({
      expanded: current,
      open: priorityQueue.map(item => item.node),
      visited: [...visited],
      costs: [...gCost],
      totalCost: gCost[current],
      message: `Duyệt node ${current} với tổng chi phí: ${gCost[current]}`
    });
    
    // Nếu tìm thấy đích
    if (endNode !== null && current === endNode) {
      // Tìm đường đi từ startNode đến endNode
      const finalPath = [];
      let currentNode = endNode;
      while (currentNode !== -1) {
        finalPath.unshift(currentNode);
        currentNode = parent[currentNode];
      }
      
      // Thêm bước kết thúc
      steps.push({
        expanded: endNode,
        open: [],
        visited: [...visited],
        costs: [...gCost],
        totalCost: gCost[endNode],
        message: `Tìm thấy đường đi đến đích với tổng chi phí: ${gCost[endNode]}`
      });
      
      return { 
        steps, 
        path: finalPath,
        totalCost: gCost[endNode]
      };
    }
    
    // Duyệt các node kề
    for (const { node: nextNode, cost: edgeCost } of adjList[current]) {
      if (!visited.has(nextNode)) {
        const newCost = gCost[current] + edgeCost;
        
        // Nếu tìm thấy đường đi tốt hơn
        if (newCost < gCost[nextNode]) {
          gCost[nextNode] = newCost;
          parent[nextNode] = current;
          
          // Cập nhật hoặc thêm mới node vào hàng đợi
          const existingIndex = priorityQueue.findIndex(item => item.node === nextNode);
          
          if (existingIndex !== -1) {
            priorityQueue[existingIndex].cost = newCost;
          } else {
            priorityQueue.push({ node: nextNode, cost: newCost });
          }
        }
      }
    }
  }
  
  // Nếu không tìm thấy đường đi
  return { 
    steps, 
    path, 
    totalCost: endNode ? gCost[endNode] : 0 
  };
} 
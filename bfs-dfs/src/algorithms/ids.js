export function ids(nodes, edges, startNode = 0, endNode = null, maxDepth = 5) {
  const adjList = Array.from({ length: nodes }, () => []);
  for (let [u, v] of edges) {
    adjList[u].push(v);
    adjList[v].push(u);
  }

  const steps = [];
  let foundPath = [];

  // Thêm bước khởi tạo với độ sâu 0
  steps.push({
    expanded: null,
    open: [startNode],
    visited: [],
    depth: 0,
    currentDepth: 0,
    message: "Bắt đầu tìm kiếm với độ sâu tối đa ban đầu: 0"
  });

  for (let depth = 0; depth <= maxDepth; depth++) {
    // Reset parent mảng cho mỗi độ sâu mới
    const parent = new Array(nodes).fill(-1);
    
    // Thêm bước thông báo mỗi khi tăng độ sâu
    if (depth > 0) {
      steps.push({
        expanded: null,
        open: [startNode],
        visited: [],
        depth: depth,
        currentDepth: 0,
        message: `Tăng độ sâu tối đa lên: ${depth}`
      });
    }
    
    const result = dls(nodes, adjList, startNode, endNode, depth, steps, parent);
    
    if (result.found) {
      foundPath = result.path;
      steps.push({
        expanded: endNode,
        open: [],
        visited: [...result.visited],
        depth: depth,
        currentDepth: result.path.length - 1,
        message: `Tìm thấy đường đi đến đích ở độ sâu: ${result.path.length - 1}`
      });
      break;
    }
    
    // Thêm bước thông báo khi không tìm thấy ở độ sâu hiện tại
    if (!result.found && depth < maxDepth) {
      steps.push({
        expanded: null,
        open: [],
        visited: [...result.visited],
        depth: depth,
        currentDepth: 0,
        message: `Không tìm thấy đường đi ở độ sâu ${depth}, tăng độ sâu`
      });
    }
  }

  return {
    steps,
    path: foundPath,
  };
}

function dls(nodes, adjList, start, target, depth, steps, parent) {
  const visited = new Set();
  const stack = [start];
  const path = [];
  
  while (stack.length) {
    const node = stack.pop();
    
    if (!visited.has(node)) {
      visited.add(node);
      path.push(node);
      
      const currentDepth = getDepthFromStart(node, parent);
      
      steps.push({
        expanded: node,
        open: [...stack],
        visited: [...visited],
        depth: depth,
        currentDepth: currentDepth
      });
      
      if (node === target) {
        // Tìm đường đi từ start đến target
        const finalPath = [];
        let current = target;
        while (current !== -1) {
          finalPath.unshift(current);
          current = parent[current];
        }
        return { found: true, path: finalPath, visited: visited };
      }
      
      if (currentDepth < depth) {
        // Lấy danh sách các node hàng xóm chưa được duyệt
        const neighbors = adjList[node].filter(n => !visited.has(n));
        
        // Thêm các node hàng xóm vào stack theo thứ tự ngược lại
        // để khi dùng stack.pop() sẽ lấy ra theo thứ tự đúng
        for (let i = neighbors.length - 1; i >= 0; i--) {
          const neighbor = neighbors[i];
          stack.push(neighbor);
          if (parent[neighbor] === -1) {
            parent[neighbor] = node;
          }
        }
      }
    }
  }
  
  return { found: false, path: [], visited: visited };
}

function getDepthFromStart(node, parent) {
  let depth = 0;
  let current = node;
  
  while (parent[current] !== -1) {
    depth++;
    current = parent[current];
  }
  
  return depth;
}

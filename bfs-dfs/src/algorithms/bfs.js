export function bfs(nodes, edges, startNode = 0, endNode = null) {
    const adjList = Array.from({ length: nodes }, () => []);
    for (let [u, v] of edges) {
      adjList[u].push(v);
      adjList[v].push(u);
    }
  
    const visited = new Set();
    const queue = [startNode];
    const steps = [];
    const path = [];
    const parent = new Array(nodes).fill(-1);
  
    while (queue.length) {
      const node = queue.shift();
      if (!visited.has(node)) {
        visited.add(node);
        path.push(node);
        const neighbors = adjList[node].filter(n => !visited.has(n) && !queue.includes(n));
        queue.push(...neighbors);
        neighbors.forEach(n => {
          if (parent[n] === -1) {
            parent[n] = node;
          }
        });
        steps.push({
          expanded: node,
          open: [...queue],
          visited: [...visited],
        });

        if (endNode !== null && node === endNode) {
          // Tìm đường đi từ startNode đến endNode
          const finalPath = [];
          let current = endNode;
          while (current !== -1) {
            finalPath.unshift(current);
            current = parent[current];
          }
          return { steps, path: finalPath };
        }
      }
    }
  
    return { steps, path };
  }
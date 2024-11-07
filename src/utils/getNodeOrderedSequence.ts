export default function getNodeOrderedSequences(edges) {
  const sources = new Set();
  const targets = new Set();

  // Build the sources and targets sets
  edges?.forEach((edge) => {
    sources.add(edge.source);
    targets.add(edge.target);
  });

  // Find initial sources (nodes that are not in targets)
  const startNodes = [...sources].filter((source) => !targets.has(source));

  const sequences = [];
  const visitedEdges = new Set();

  // Helper function to build a sequence from a starting node
  function buildSequence(start) {
    const sequence = [start];
    let currentSource = start;

    while (currentSource) {
      const nextEdge = edges.find(
        (edge) => edge.source === currentSource && !visitedEdges.has(edge)
      );
      if (nextEdge) {
        sequence.push(nextEdge.target);
        visitedEdges.add(nextEdge); // Mark edge as visited
        currentSource = nextEdge.target;
      } else {
        break;
      }
    }

    return sequence;
  }

  // Build sequences starting from each start node
  startNodes.forEach((start) => {
    sequences.push(buildSequence(start));
  });

  return sequences;
}

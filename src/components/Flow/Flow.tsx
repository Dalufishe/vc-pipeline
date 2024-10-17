import "@xyflow/react/dist/style.css";

import React, { useCallback, useEffect } from "react";
import {
  addEdge,
  Controls,
  MiniMap,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import Card from "../Card/Card";
import { useFlowData } from "@/provider/FlowProvider";

const nodeTypes = { card: Card };

const initialNodes = [
  {
    id: "1",
    position: { x: 0, y: 200 },
    type: "card",
    data: {
      pythonPath: "python",
      projectPath:
        "C:\\Users\\user\\Desktop\\Dalufishe\\Program\\Project\\正式項目\\vc-pipeline\\server\\python-test-servers\\a.py",
    },
  },
  {
    id: "2",
    position: { x: 500, y: 200 },
    type: "card",
    data: {
      pythonPath: "python",
      projectPath:
        "C:\\Users\\user\\Desktop\\Dalufishe\\Program\\Project\\正式項目\\vc-pipeline\\server\\python-test-servers\\b.py",
    },
  },
  {
    id: "3",
    position: { x: 1000, y: 200 },
    type: "card",
    data: {
      pythonPath: "python",
      projectPath:
        "C:\\Users\\user\\Desktop\\Dalufishe\\Program\\Project\\正式項目\\vc-pipeline\\server\\python-test-servers\\c.py",
    },
  },
];

const initialEdges = [
     { id: "e1-1", source: "1", target: "2" },
     { id: "e1-2", source: "2", target: "3" }
];

export default function Flow() {
  // Flow 資料
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // 同步狀態
  const { setFlowData, setNodes: setEdgesB } = useFlowData();
  useEffect(() => {
    setFlowData({ nodes, setNodes, edges, setEdges });
  }, [nodes, setNodes, edges, setEdges]);

  const onConnect = useCallback(
    (params) => {
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

  // useEffect(() => {
  //   fetch("/api/flow/register", {
  //     method: "POST",
  //     body: JSON.stringify({ nodes, edges }),
  //   });
  // }, [nodes, edges]);

  return (
    <div className="w-screen h-screen relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
      >
        <MiniMap />
        <Controls />
        {/* <Background variant="dots" gap={12} size={1} /> */}
      </ReactFlow>
    </div>
  );
}

// function getOrderedSequence(edges) {
//   const sources = new Set();
//   const targets = new Set();

//   // 建立 sources 和 targets 的集合
//   edges.forEach((edge) => {
//     sources.add(edge.source);
//     targets.add(edge.target);
//   });

//   // 找到最初的 source (它不在 targets 裡)
//   let start = [...sources].find((source) => !targets.has(source));

//   // 按順序連接 source 和 target
//   const sequence = [start];
//   while (start) {
//     const nextEdge = edges.find((edge) => edge.source === start);
//     if (nextEdge) {
//       sequence.push(nextEdge.target);
//       start = nextEdge.target;
//     } else {
//       break;
//     }
//   }

//   return sequence;
// }

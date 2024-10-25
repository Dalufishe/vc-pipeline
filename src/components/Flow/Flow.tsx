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

export default function Flow() {
  // Flow 資料
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // 初始化
  useEffect(() => {
    setNodes(JSON.parse(localStorage.getItem("nodes")));
    setEdges(JSON.parse(localStorage.getItem("edges")));
  }, []);

  // 同步狀態
  const { setFlowData, setNodes: setEdgesB } = useFlowData();
  useEffect(() => {
    // 同步到狀態管理
    setFlowData({ nodes, setNodes, edges, setEdges });
    // 同步到 localstorage
    localStorage.setItem("nodes", JSON.stringify(nodes));
    localStorage.setItem("edges", JSON.stringify(edges));
  }, [nodes, setNodes, edges, setEdges]);

  const onConnect = useCallback(
    (params) => {
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

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

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
import getNodeOrderedSequence from "@/utils/getNodeOrderedSequence";
import ViewCard from "../Card/ViewCard/ViewCard";

const nodeTypes = { card: Card, view: ViewCard };

export default function Flow() {
  // Flow 資料
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // 初始化
  useEffect(() => {
    setNodes(JSON.parse(localStorage.getItem("nodes")) || []);
    setEdges(JSON.parse(localStorage.getItem("edges")) || []);
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
        noDragClassName="react-flow-no-drag"
        noWheelClassName="react-flow-no-wheel"
      >
        <MiniMap />
        <Controls />
        {/* <Background variant="dots" gap={12} size={1} /> */}
      </ReactFlow>
    </div>
  );
}

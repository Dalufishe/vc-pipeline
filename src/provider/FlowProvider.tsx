/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useContext, useState } from "react";

const initialFlowData = {
  nodes: [],
  setNodes: () => {},
  edges: [],
  setEdges: () => {},
  //
  setFlowData: (key: string, value: any) => {},
};

const FlowContext = React.createContext(initialFlowData);

export default function FlowProvider({ children }) {
  const [flowData, setFlowData] = useState(initialFlowData);

  return (
    <FlowContext.Provider
      value={{
        ...flowData,
        setFlowData(data) {
          setFlowData({ ...flowData, ...data });
        },
      }}
    >
      {children}
    </FlowContext.Provider>
  );
}

export const useFlowData = () => {
  const { setFlowData, nodes, setNodes, edges, setEdges } =
    useContext(FlowContext);
  return { setFlowData, nodes, setNodes, edges, setEdges };
};

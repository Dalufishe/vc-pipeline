import { useFlowData } from "@/provider/FlowProvider";
import {
  AlertDialog,
  Button,
  Flex,
  IconButton,
  Select,
  TextField,
} from "@radix-ui/themes";
import { Handle, Node, NodeProps, Position, useReactFlow } from "@xyflow/react";
import { useEffect, useRef, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { Canvas } from "@react-three/fiber";
import ObjRenderer from "@/components/View/ObjRenderer/ObjRenderer";
import { usePlatform } from "@/hooks/utils/usePlatform";

export type ViewNode = Node<
  {
    cardName?: string;
    viewPath?: string;
    viewType?: string;
  },
  "view"
>;

export default function ViewCard(props: NodeProps<ViewNode>) {
  const cardId = props.id;

  const { nodes, setNodes } = useFlowData();

  const [cardName, setCardName] = useState(
    props.data.cardName || `View Card #${cardId}`
  );

  const [viewPath, setViewPath] = useState(props.data.viewPath);

  const { platform, loading } = usePlatform();

  const viewName = loading
    ? "Loading..."
    : viewPath
    ? (() => {
        const parts = viewPath.split(platform === "Windows" ? "\\" : "/");
        return parts.slice(-1).join("/");
      })()
    : "Empty";

  const viewTypes = ["image", "obj"];
  const [viewType, setViewType] = useState(props.data.viewType || viewTypes[0]);

  const [objs, setObjs] = useState([]);

  useEffect(() => {
    const objPaths = [viewPath];

    if (viewType === "obj") {
      fetchBuffers(objPaths).then((data) => {
        setObjs(data);
      });
    }
  }, [viewPath, viewType]);

  return (
    <>
      <Handle type="target" position={Position.Left} />
      <div className="w-96 h-[412px] text-black bg-white rounded-xl overflow-hidden">
        <div className="bg-yellow-300 h-12 flex items-center justify-between p-4">
          <div className="font-mono text-2xl font-bold ">{cardName}</div>
        </div>
        <div className="flex flex-col p-4 gap-2">
          <div className="flex justify-between">
            {/* 專案名稱 */}
            <h3 className="text-xl">{viewName}</h3>
            <AlertDialog.Root>
              <AlertDialog.Trigger>
                <IconButton size="1">
                  <BsThreeDots />
                </IconButton>
              </AlertDialog.Trigger>
              <AlertDialog.Content maxWidth="450px">
                <AlertDialog.Title>Card Name</AlertDialog.Title>
                <AlertDialog.Description size="2">
                  <TextField.Root
                    value={cardName}
                    onChange={(e) => {
                      setCardName(e.target.value);
                      setTimeout(() => {
                        setNodes(
                          nodes.map((node) => {
                            if (node.id === cardId)
                              return {
                                ...node,
                                data: {
                                  cardName: e.target.value,
                                  viewPath,
                                  viewType,
                                },
                              };
                            else return node;
                          })
                        );
                      });
                    }}
                  />
                </AlertDialog.Description>
                <div className="h-5"></div>
                <AlertDialog.Title>View Path</AlertDialog.Title>
                <AlertDialog.Description size="2">
                  <TextField.Root
                    value={viewPath}
                    onChange={(e) => {
                      setViewPath(e.target.value);
                      setTimeout(() => {
                        setNodes(
                          nodes.map((node) => {
                            if (node.id === cardId)
                              return {
                                ...node,
                                data: {
                                  cardName,
                                  viewPath: e.target.value,
                                  viewType,
                                },
                              };
                            else return node;
                          })
                        );
                      });
                    }}
                  />
                </AlertDialog.Description>
                <div className="h-5"></div>
                <div className="flex justify-between items-center">
                  <AlertDialog.Title>View Type</AlertDialog.Title>
                  <Select.Root
                    value={viewType}
                    onValueChange={(v) => {
                      setViewType(v);
                      setTimeout(() => {
                        setNodes(
                          nodes.map((node) => {
                            if (node.id === cardId)
                              return {
                                ...node,
                                data: {
                                  cardName,
                                  viewPath,
                                  viewType: v,
                                },
                              };
                            else return node;
                          })
                        );
                      });
                    }}
                  >
                    <Select.Trigger />
                    <Select.Content>
                      {viewTypes.map((v) => (
                        <Select.Item value={v} key={v}>
                          {v}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                </div>

                <Flex gap="3" mt="4" justify="end">
                  <AlertDialog.Cancel>
                    <Button variant="soft" color="gray">
                      Cancel
                    </Button>
                  </AlertDialog.Cancel>
                </Flex>
              </AlertDialog.Content>
            </AlertDialog.Root>
          </div>

          {/* <Controls />
          <mesh>
            <torusKnotGeometry />
            <meshNormalMaterial />
          </mesh> */}
          <div className="w-full h-[296px] react-flow-no-drag react-flow-no-wheel">
            {viewType === "obj" && objs.length && (
              <ObjRenderer data={{ objs }} />
            )}
          </div>
        </div>
      </div>
      <Handle type="source" position={Position.Right} id="a" />
    </>
  );
}

const fetchBuffers = async (filePaths: string[]) => {
  try {
    const bufferURLs = await Promise.all(
      filePaths.map(async (filePath) => {
        try {
          const response = await fetch(
            `/api/view/buffer?filePath=${encodeURIComponent(filePath)}`
          );

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          // Retrieve the response as an ArrayBuffer for direct binary data handling
          const arrayBuffer = await response.arrayBuffer();
          console.log("ArrayBuffer data:", arrayBuffer);

          // Create a Blob URL for each file
          const blob = new Blob([arrayBuffer], {
            type: "application/octet-stream",
          });
          const url = URL.createObjectURL(blob);

          return { path: filePath, blob, url };
        } catch (error) {
          console.error("Error fetching the buffer file:", error);
          return null; // Return null for failed fetches
        }
      })
    );

    // Filter out any null results from failed requests
    return bufferURLs.filter((result) => result !== null);
  } catch (error) {
    console.error("Error processing file paths:", error);
  }
};

import { useFlowData } from "@/provider/FlowProvider";
import {
  AlertDialog,
  Button,
  Flex,
  IconButton,
  Text,
  TextField,
} from "@radix-ui/themes";
import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import { useEffect, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { Canvas } from "@react-three/fiber";
import Controls from "./ObjRenderer/Controls";
import ObjRenderer from "./ObjRenderer/ObjRenderer";

export type ViewNode = Node<
  {
    viewPath?: string;
  },
  "view"
>;

export default function View(props: NodeProps<ViewNode>) {
  const viewId = props.id;

  const { nodes, setNodes } = useFlowData();

  const [viewPath, setViewPath] = useState(props.data.viewPath);

  const [objs, setObjs] = useState([]);

  useEffect(() => {
    const objPaths = [viewPath];

    if (objPaths) {
      fetchBuffers(objPaths).then((data) => {
        setObjs(data);
      });
    }
  }, []);

  return (
    <>
      <Handle type="target" position={Position.Left} />
      <div className="w-96 h-96 text-black bg-white rounded-xl p-4 flex flex-col gap-2">
        <div className="flex justify-between">
          {/* 檔案名稱 */}
          <h3 className="text-xl">
            {viewPath
              ? viewPath.split("/")[viewPath.split("/").length - 2] +
                "/" +
                viewPath.split("/")[viewPath.split("/").length - 1]
              : "Empty"}
          </h3>
          <AlertDialog.Root>
            <AlertDialog.Trigger>
              <IconButton size="1">
                <BsThreeDots />
              </IconButton>
            </AlertDialog.Trigger>
            <AlertDialog.Content maxWidth="450px">
              <AlertDialog.Title>View Path</AlertDialog.Title>
              <AlertDialog.Description size="2">
                <TextField.Root
                  value={viewPath}
                  onChange={(e) => {
                    setViewPath(e.target.value);
                    setTimeout(() => {
                      setNodes(
                        nodes.map((node) => {
                          if (node.id === viewId)
                            return {
                              ...node,
                              data: { viewPath: e.target.value },
                            };
                          else return node;
                        })
                      );
                    });
                  }}
                />
              </AlertDialog.Description>
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
        <Canvas className="w-full h-full flex justify-between items-center gap-10">
          {/* <Controls />
          <mesh>
            <torusKnotGeometry />
            <meshNormalMaterial />
          </mesh> */}
          {objs.length && <ObjRenderer data={{ objs }} />}
        </Canvas>
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

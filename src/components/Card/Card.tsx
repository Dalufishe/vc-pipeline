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

export type CardNode = Node<
  {
    projectPath?: string;
    pythonPath?: string;
  },
  "card"
>;

export default function Card(props: NodeProps<CardNode>) {
  const cardId = props.id;

  const { nodes, setNodes } = useFlowData();

  const [projectPath, setProjectPath] = useState(props.data.projectPath);
  const [pythonPath, setPythonPath] = useState(props.data.pythonPath);

  return (
    <>
      <Handle type="target" position={Position.Left} />
      <div className="w-96 h-48 text-black bg-white rounded-xl p-4 flex flex-col gap-2">
        <div className="flex justify-between">
          {/* 檔案名稱 */}
          <h3 className="text-xl">
            {projectPath
              ? projectPath.split("\\")[projectPath.split("\\").length - 2] +
                "/" +
                projectPath.split("\\")[projectPath.split("\\").length - 1]
              : "Empty"}
          </h3>
          <AlertDialog.Root>
            <AlertDialog.Trigger>
              <IconButton size="1">
                <BsThreeDots />
              </IconButton>
            </AlertDialog.Trigger>
            <AlertDialog.Content maxWidth="450px">
              <AlertDialog.Title>Project Path</AlertDialog.Title>
              <AlertDialog.Description size="2">
                <TextField.Root
                  value={projectPath}
                  onChange={(e) => {
                    setProjectPath(e.target.value);
                    setTimeout(() => {
                      setNodes(
                        nodes.map((node) => {
                          if (node.id === cardId)
                            return {
                              ...node,
                              data: { projectPath: e.target.value, pythonPath },
                            };
                          else return node;
                        })
                      );
                    });
                  }}
                />
              </AlertDialog.Description>
              <div className="h-5"></div>
              <AlertDialog.Title>Python Path</AlertDialog.Title>
              <AlertDialog.Description size="2">
                <TextField.Root
                  value={pythonPath}
                  onChange={(e) => {
                    setPythonPath(e.target.value);
                    setTimeout(() => {
                      setNodes(
                        nodes.map((node) => {
                          if (node.id === cardId)
                            return {
                              ...node,
                              data: { projectPath, pythonPath: e.target.value },
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
        {/* 專案路徑 */}
        <div className="flex justify-between items-center gap-10">
          <div className="flex flex-col w-[80%]">
            <Text weight="bold">Project Path</Text>
            <Text className="overflow-hidden text-ellipsis whitespace-nowrap">
              {projectPath || "Empty"}
            </Text>
          </div>
        </div>
        {/* Python 環境路徑 */}
        <div className="flex justify-between items-center gap-10">
          <div className="flex flex-col w-[80%]">
            <Text weight="bold">Python Env Path</Text>
            <Text className="overflow-hidden text-ellipsis whitespace-nowrap">
              {pythonPath || "Empty"}
            </Text>
          </div>
        </div>
      </div>
      <Handle type="source" position={Position.Right} id="a" />
    </>
  );
}

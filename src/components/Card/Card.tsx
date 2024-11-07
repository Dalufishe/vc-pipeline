import { usePlatform } from "@/hooks/utils/usePlatform";
import { useFlowData } from "@/provider/FlowProvider";
import getNodeOrderedSequences from "@/utils/getNodeOrderedSequence";
import {
  AlertDialog,
  Button,
  Flex,
  IconButton,
  Text,
  TextField,
} from "@radix-ui/themes";
import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import { useRef, useState } from "react";
import { BsFillTriangleFill, BsThreeDots } from "react-icons/bs";

export type CardNode = Node<
  {
    cardName?: string;
    projectPath?: string;
    pythonPath?: string;
  },
  "card"
>;

export default function Card(props: NodeProps<CardNode>) {
  const cardId = props.id;

  const { nodes, setNodes, edges } = useFlowData();

  const orderedSequences = getNodeOrderedSequences(edges);

  const isFirstNode =
    orderedSequences.filter((orderedSequence) => orderedSequence[0] === cardId)
      .length !== 0;

  const [cardName, setCardName] = useState(
    props.data.cardName || `Card #${cardId}`
  );
  const [projectPath, setProjectPath] = useState(props.data.projectPath);
  const [pythonPath, setPythonPath] = useState(props.data.pythonPath);

  const { platform, loading } = usePlatform();

  const projectName = loading
    ? "Loading..."
    : projectPath
    ? (() => {
        const parts = projectPath.split(platform === "Windows" ? "\\" : "/");
        return parts.slice(-2).join("/");
      })()
    : "Empty";

  const flowStartHandler = () => {
    console.log(1);
    fetch("/api/flow/start", {
      method: "POST",
      body: JSON.stringify({ nodes, edges, cardId }),
    })
      .then((data) => data.json())
      .then((json) => {
        // setResult(json);
        console.log(json);
      });
  };

  return (
    <>
      <Handle type="target" position={Position.Left} />
      <div className="w-96 text-black bg-white rounded-xl overflow-hidden">
        <div className="bg-blue-300 h-12 flex items-center justify-between p-4">
          <div className="font-mono text-2xl font-bold ">{cardName}</div>
          {isFirstNode && (
            <IconButton
              onClick={flowStartHandler}
              size="1"
              color="green"
              className="rotate-90"
            >
              <BsFillTriangleFill className="-translate-y-[1px]" />
            </IconButton>
          )}
        </div>
        <div className="flex flex-col p-4 gap-2">
          <div className="flex justify-between">
            {/* 專案名稱 */}
            <h3 className="text-xl">{projectName}</h3>
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
                                  projectPath,
                                  pythonPath,
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
                                data: {
                                  cardName,
                                  projectPath: e.target.value,
                                  pythonPath,
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
                                data: {
                                  cardName,
                                  projectPath,
                                  pythonPath: e.target.value,
                                },
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
              <Text
              // className="overflow-hidden text-ellipsis whitespace-nowrap"
              >
                {projectPath || "Empty"}
              </Text>
            </div>
          </div>
          {/* Python 環境路徑 */}
          <div className="flex justify-between items-center gap-10">
            <div className="flex flex-col w-[80%]">
              <Text weight="bold">Python Env Path</Text>
              <Text
              // className="overflow-hidden text-ellipsis whitespace-nowrap"
              >
                {pythonPath || "Empty"}
              </Text>
            </div>
          </div>
        </div>
      </div>
      <Handle type="source" position={Position.Right} id="a" />
    </>
  );
}

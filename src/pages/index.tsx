import Flow from "@/components/Flow/Flow";
import { ContextMenu } from "@radix-ui/themes";
import { useFlowData } from "@/provider/FlowProvider";
import { MouseEvent, useState } from "react";
import Head from "next/head";
import View from "@/components/View/View";

export default function Home() {
  const { nodes, edges } = useFlowData();

  const [result, setResult] = useState({});

  const flowStartHandler = () => {
    fetch("/api/flow/start", {
      method: "POST",
      body: JSON.stringify({ nodes, edges }),
    })
      .then((data) => data.json())
      .then((json) => {
        setResult(json);
      });
  };

  return (
    <div className="overflow-hidden relative">
      <HomePageContextMenu
        onFlowStart={flowStartHandler}
        trigger={
          <div>
            <Flow />
          </div>
        }
      />
      <View result={result} />
    </div>
  );
}

function HomePageContextMenu(props: {
  trigger: React.ReactNode;
  onFlowStart: () => void;
}) {
  const { nodes, setNodes } = useFlowData();

  const menus = [
    {
      title: "Start Flow",
      shortcut: "⌘ Enter",
      handler: props.onFlowStart,
    },
    {
      title: "Insert Node",
      shortcut: "⌘ I",
      handler: (e: MouseEvent<HTMLDivElement, MouseEvent>) => {
        setNodes([
          ...nodes,
          {
            id: String(nodes.length + 1),
            position: { x: e.clientX, y: e.clientY },
            type: "card",
            data: {
              pythonPath: "",
              projectPath: "",
            },
          },
        ]);
      },
    },
  ];

  return (
    <>
      <Head>
        <title>Vesuvius Pipeline</title>
      </Head>
      <ContextMenu.Root>
        <ContextMenu.Trigger>{props.trigger}</ContextMenu.Trigger>
        <ContextMenu.Content>
          {menus.map((menu) => (
            <ContextMenu.Item
              onClick={menu.handler}
              key={menu.title}
              shortcut={menu.shortcut}
            >
              {menu.title}
            </ContextMenu.Item>
          ))}
        </ContextMenu.Content>
      </ContextMenu.Root>
    </>
  );
}

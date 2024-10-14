import localFont from "next/font/local";
import Flow from "@/components/Flow/Flow";
import { ContextMenu } from "@radix-ui/themes";
import { useFlowData } from "@/provider/FlowProvider";
import { MouseEvent } from "react";
import Head from "next/head";

export default function Home() {
  return (
    <HomePageContextMenu
      trigger={
        <div>
          <Flow />
        </div>
      }
    />
  );
}

function HomePageContextMenu(props: { trigger: React.ReactNode }) {
  const { nodes, setNodes, edges } = useFlowData();


  const menus = [
    {
      title: "Start Flow",
      shortcut: "⌘ Enter",
      handler: () => {
        fetch("/api/flow/start", {
          method: "POST",
          body: JSON.stringify({ nodes, edges }),
        });
      },
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

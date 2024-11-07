import { NextApiRequest, NextApiResponse } from "next";
import { spawn } from "child_process";
import os from "os";
import getNodeOrderedSequences from "@/utils/getNodeOrderedSequence";

// let runningProcesses: number[] = [];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const body = JSON.parse(req.body);

    const cardId = body.cardId;

    const nodes = body.nodes;
    const edges = body.edges;

    const orderedSequences = getNodeOrderedSequences(edges);

    const orderedSequence = orderedSequences.find(
      (orderedSequence) => orderedSequence[0] === cardId
    );

    // // Kill any previously running processes
    // runningProcesses.forEach((pid) => {
    //   try {
    //     process.kill(pid);
    //     console.log(`Killed process with PID: ${pid}`);
    //   } catch (error) {
    //     console.error(`Failed to kill process with PID: ${pid}`, error);
    //   }
    // });

    // // Clear the list of running processes
    // runningProcesses = [];

    // Start new processes using spawn
    nodes
      .filter((node) => orderedSequence.includes(node.id))
      .forEach((node) => {
        const isWindows = os.platform() === "win32";
        const condaEnv = node.data.pythonPath; // This is the path to your Conda environment
        const isPython = condaEnv === "python";

        let command, args;

        if (isWindows) {
          // Windows-specific: activate Conda environment and run Python script
          command = "cmd.exe";
          args = [
            "/c",
            isPython
              ? `python ${node.data.projectPath}`
              : `conda activate ${condaEnv} && python ${node.data.projectPath}`,
            `id=${5000 + Number(node.id)}`,
            `order=${orderedSequence.map((o) => 5000 + Number(o)).join("-")}`,
            `from=${
              5000 +
              Number(orderedSequence[orderedSequence.indexOf(node.id) - 1] || 0)
            }`,
          ];
        } else {
          // macOS or Linux: activate Conda environment and run Python script
          command = "bash";
          const activate = condaEnv.endsWith("/bin/activate") ? "" : "activate"; // env : conda
          args = [
            "-c",
            isPython
              ? `python ${node.data.projectPath}`
              : `"source ${activate} ${condaEnv} && python ${node.data.projectPath}`,
            `id=${5000 + Number(node.id)}`,
            `order=${orderedSequence.map((o) => 5000 + Number(o)).join("-")}`,
            `from=${
              5000 +
              Number(orderedSequence[orderedSequence.indexOf(node.id) - 1] || 0)
            }"`,
          ];
        }

        const child = spawn(command, args, { shell: true });

        // Store the PID of the running process
        // runningProcesses.push(child.pid);

        // Handle output from the process
        child.stdout.on("data", (data) => {
          console.log(`stdout: ${data}`);
        });

        child.stderr.on("data", (data) => {
          console.error(`stderr: ${data}`);
        });

        child.on("close", (code) => {
          console.log(`Process exited with code: ${code}`);
        });
      });

    setTimeout(() => {
      (async function () {
        const result = await fetch(
          "http://localhost:" +
            (5000 + Number(orderedSequence[orderedSequence.length - 1]))
        );
        const jsonResult = await result.json();
        res.status(200).json({ status: "success", data: jsonResult });
      })();
    }, 2000);
  }
}

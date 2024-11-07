import { NextApiRequest, NextApiResponse } from "next";
import os from "os";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const platform = os.platform();

  let platformName: string;
  if (platform === "darwin") {
    platformName = "macOS";
  } else if (platform === "win32") {
    platformName = "Windows";
  } else if (platform === "linux") {
    platformName = "Linux";
  } else {
    platformName = "Unknown";
  }

  res.status(200).json({ platform: platformName });
}

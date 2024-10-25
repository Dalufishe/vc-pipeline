import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { filePath } = req.query;

    if (!filePath || typeof filePath !== "string") {
      return res.status(400).json({ message: "Invalid file path" });
    }

    const fullPath = path.join(filePath);

    try {
      // Check if the file exists
      if (!fs.existsSync(fullPath)) {
        return res.status(404).json({ message: ".nrrd file not found" });
      }

      // Set appropriate headers for binary data
      res.setHeader("Content-Type", "application/octet-stream");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${path.basename(filePath)}"`
      );

      // Stream the file directly to the response
      const fileStream = fs.createReadStream(fullPath);
      fileStream.pipe(res);

      fileStream.on("error", (error) => {
        console.error("File streaming error:", error);
        res.status(500).json({ message: "Error streaming the file" });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

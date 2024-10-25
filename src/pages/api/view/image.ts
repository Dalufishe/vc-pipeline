import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { imagePath } = req.query;

    if (!imagePath || typeof imagePath !== "string") {
      return res.status(400).json({ message: "Invalid image path" });
    }

    const fullPath = path.join(imagePath);

    try {
      if (!fs.existsSync(fullPath)) {
        return res.status(404).json({ message: "Image not found" });
      }

      res.setHeader("Content-Type", "image/jpeg");

      const imageBuffer = fs.readFileSync(fullPath);
      res.status(200).send(imageBuffer);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

import React, { useEffect, useState } from "react";
import ImageRenderer from "./ImageRenderer/ImageRenderer";
import ObjRenderer from "./ObjRenderer/ObjRenderer";
import NrrdRenderer from "./NrrdRenderer/NrrdRenderer";

export default function View({ result }) {
  const [images, setImages] = useState([]);
  const [objs, setObjs] = useState([]);
  const [nrrds, setNrrds] = useState([]);

  useEffect(() => {
    const imagePaths = result?.data?.view?.image;
    const objPaths = result?.data?.view?.obj;
    const nrrdPaths = result?.data?.view?.nrrd;

    if (imagePaths) {
      fetchImages(imagePaths).then((data) => {
        setImages(data);
      });
    }
    if (objPaths) {
      fetchBuffers(objPaths).then((data) => {
        setObjs(data);
      });
    }
    if (nrrdPaths) {
      fetchBuffers(nrrdPaths).then((data) => {
        setNrrds(data);
      });
    }
  }, [result]);

  return (
    <div className="w-[400px] h-[320px] absolute right-0 top-0 bg-white">
      {/* {result?.data?.view?.text} */}
      {images && <ImageRenderer data={{ images }} />}
      {objs && <ObjRenderer data={{ objs }} />}
      {nrrds && <NrrdRenderer data={{ nrrds }} />}
    </div>
  );
}
const fetchImages = async (imagePaths: string[]) => {
  try {
    const imageURLs = await Promise.all(
      imagePaths.map(async (imagePath) => {
        try {
          const response = await fetch(
            `/api/view/image?imagePath=${encodeURIComponent(imagePath)}`
          );

          if (!response.ok) {
            throw new Error(`Network response was not ok for ${imagePath}`);
          }

          // Retrieve the response as a Blob for direct image data handling
          const imageBlob = await response.blob();
          const imageObjectURL = URL.createObjectURL(imageBlob);

          return { path: imagePath, url: imageObjectURL };
        } catch (error) {
          console.error(`Error fetching the image at ${imagePath}:`, error);
          return null; // Return null for failed fetches
        }
      })
    );

    // Filter out any null results from failed requests
    return imageURLs.filter((result) => result !== null);
  } catch (error) {
    console.error("Error processing image paths:", error);
  }
};

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

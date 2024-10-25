import React, { useEffect, useState } from "react";
import ImageRenderer from "./ImageRenderer/ImageRenderer";
import ObjRenderer from "./ObjRenderer/ObjRenderer";
import NrrdRenderer from "./NrrdRenderer/NrrdRenderer";

export default function View({ result }) {
  const [imageSrc, setImageSrc] = useState("");
  const [objSrc, setObjSrc] = useState("");
  const [nrrdSrc, setNrrdSrc] = useState("");

  useEffect(() => {
    const imagePath = result?.data?.view?.image;
    const objPath = result?.data?.view?.obj;
    const nrrdPath = result?.data?.view?.nrrd;

    if (imagePath) {
      fetchImage(imagePath).then((data) => {
        setImageSrc(data);
      });
    } else if (objPath) {
      fetchBuffer(objPath).then((data) => {
        setObjSrc(data.url);
      });
    } else if (nrrdPath) {
      fetchBuffer(nrrdPath).then((data) => {
        setNrrdSrc(data.url);
      });
    }
  }, [result]);

  return (
    <div className="w-[400px] h-[320px] absolute right-0 top-0 bg-white">
      {/* {result?.data?.view?.text} */}
      {imageSrc && <ImageRenderer data={{ imageSrc }} />}
      {objSrc && <ObjRenderer data={{ objSrc }} />}
      {nrrdSrc && <NrrdRenderer data={{ nrrdSrc }} />}
    </div>
  );
}

const fetchImage = async (imagePath: string) => {
  try {
    const response = await fetch("/api/view/image?imagePath=" + imagePath);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const imageBlob = await response.blob();
    const imageObjectURL = URL.createObjectURL(imageBlob);
    return imageObjectURL;
  } catch (error) {
    console.error("Error fetching the image:", error);
  }
};

const fetchBuffer = async (filePath: string) => {
  try {
    const response = await fetch(
      "/api/view/buffer?filePath=" + encodeURIComponent(filePath)
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    // Retrieve the response as an ArrayBuffer for direct binary data handling
    const arrayBuffer = await response.arrayBuffer();

    console.log("ArrayBuffer data:", arrayBuffer);

    // If needed, you can create a Blob URL for downloading or viewing the file
    const blob = new Blob([arrayBuffer], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);

    return { blob, url };
  } catch (error) {
    console.error("Error fetching the buffer file:", error);
  }
};

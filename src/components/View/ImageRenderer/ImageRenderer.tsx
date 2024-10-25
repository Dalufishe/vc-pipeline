import React from "react";

type Props = {
  data: { imageSrc: string };
};

export default function ImageRenderer(props: Props) {
  return <img src={props.data.imageSrc} />;
}

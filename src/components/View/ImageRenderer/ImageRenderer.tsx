import React from "react";

type Props = {
  data: { images: string };
};

export default function ImageRenderer(props: Props) {
  return props.data.images?.map((image, i) => <img key={i} src={image?.url} />);
}

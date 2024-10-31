import React from "react";

type Props = {
  data: { images: string };
};

export default function ImageRenderer(props: Props) {
  return props.data.images?.map((image) => <img src={image?.url} />);
}

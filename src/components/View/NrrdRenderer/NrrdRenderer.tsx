import React from "react";

type Props = {
  data: { nrrdSrc: string };
};

export default function NrrdRenderer(props: Props) {
  return <div>{props.data.nrrdSrc}</div>;
}

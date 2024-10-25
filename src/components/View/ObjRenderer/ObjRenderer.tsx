import React from "react";

type Props = {
  data: { objSrc: string };
};

export default function ObjRenderer(props: Props) {
  return <div>{props.data.objSrc}</div>;
}

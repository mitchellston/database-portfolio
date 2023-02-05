import type { NextPage } from "next/types";
import React, { useState } from "react";
import DragableContainer from "react-draggable";
type props = {
  children: React.ReactNode;
  onStop?: (position: { x: number; y: number }) => void;
  position?: { x: number | undefined; y: number | undefined };
};
const Dragable: NextPage<props> = (props) => {
  const [position, setPosition] = useState({
    x: props.position?.x == undefined ? 0 : props.position?.x,
    y: props.position?.y == undefined ? 0 : props.position?.y,
  });
  return (
    <DragableContainer
      bounds="parent"
      position={position}
      onStop={(e, data) => {
        if (props.onStop) props.onStop({ x: data.x, y: data.y });
        setPosition({ x: data.x, y: data.y });
      }}
    >
      {props.children}
    </DragableContainer>
  );
};

export default Dragable;

import type { NextPage } from "next/types";
import React from "react";
import DragableContainer, { type DraggableEventHandler } from "react-draggable";
type props = {
  children: React.ReactNode;
  onStop?: (position: { x: number; y: number }) => void;
};
const Dragable: NextPage<props> = (props) => {
  return (
    <DragableContainer
      bounds="parent"
      onStop={(e, data) => {
        if (props.onStop) props.onStop({ x: data.x, y: data.y });
      }}
    >
      {props.children}
    </DragableContainer>
  );
};

export default Dragable;

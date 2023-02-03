import type { NextPage } from "next";
import React, { useEffect } from "react";
type props = {
  title: {
    text: string;
    color: string;
    size: number;
  };
  show: boolean;
  onClose: () => void;
  className?: string;
  children?: React.ReactNode;
};
const Modal: NextPage<props> = (props) => {
  useEffect(() => {
    window.addEventListener("keypress", (e: KeyboardEvent) => {
      //escape key pressed no key code
      if (e.key == "Escape") {
        props.onClose();
      }
    });
    // cleanup this component
    return () => {
      window.removeEventListener("keypress", (e: KeyboardEvent) => {
        //escape key pressed no key code
        if (e.key == "Escape") {
          props.onClose();
        }
      });
    };
  }, [props]);
  if (props.show == false) return <></>;
  return (
    <div className="fixed top-0 left-0 z-40 h-screen w-screen">
      <div
        className="absolute top-0 left-0 z-40 h-full w-full bg-black/20"
        onClick={() => {
          props.onClose();
        }}
      ></div>
      <div className="absolute top-0 left-0  flex h-full w-full items-center justify-center">
        <div
          onClick={(event: React.MouseEvent<HTMLDivElement>) => {
            event.stopPropagation();
            return;
          }}
          className={`z-50 h-full max-h-[95vh] w-full max-w-[100vw] overflow-y-auto rounded-sm bg-white shadow-md lg:h-1/3 lg:w-1/2 ${
            props.className == undefined ? "" : props.className
          }`}
        >
          <div className="flex h-full w-full flex-col">
            <div className="flex w-full flex-row">
              <h2
                className="flex-grow"
                style={{
                  fontSize: props.title.size.toString() + "rem",
                  color: props.title.color,
                }}
              >
                {props.title.text}
              </h2>
              <button
                className="w-7  text-2xl"
                onClick={() => {
                  props.onClose();
                }}
              >
                X
              </button>
            </div>
            <div className="relative flex-grow">
              {props.children == undefined ? null : props.children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Modal;

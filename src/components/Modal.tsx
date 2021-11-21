import React, {KeyboardEventHandler, MouseEventHandler, useRef} from "react";
import styled from "@emotion/styled";

export interface ModalProps {
  visible?: boolean;
  children?: React.ReactNode;
  onMouseDown?: MouseEventHandler<HTMLDivElement>;
  onMouseUp?: MouseEventHandler<HTMLDivElement>;
  onKeyDown?: KeyboardEventHandler<HTMLDivElement>;
  onKeyUp?: KeyboardEventHandler<HTMLDivElement>;
}

const Modal = (props: ModalProps) => {
  const containerRef = useRef(null);
  return (
    <ModelContainer ref={containerRef}
                    style={{ display: props.visible ? "block" : "none" }}
                    onMouseDown={props.onMouseDown}
                    onMouseUp={props.onMouseUp}
                    onKeyDown={props.onKeyDown}
                    onKeyUp={props.onKeyUp}
    >
      <ModelContent>
        {props.children}
      </ModelContent>
    </ModelContainer>
  )
}

export default Modal;

const ModelContainer = styled.div`
  display: none; /* Hidden by default */
  position: fixed; /* Stay in place */
  left: 0;
  top: 0;
  z-index: 1; /* Sit on top */
  width: 100vw; /* Full width */
  height: 100vh; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: #FFFFFF; /* Fallback color */
  background-color: rgba(0, 0, 0, 0.2); /* Black w/ opacity */
`

const ModelContent = styled.div`
  background-color: #fefefe;
  border: 1px solid #888;
  margin: 0;
  max-width: 100%;
  max-height: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
`
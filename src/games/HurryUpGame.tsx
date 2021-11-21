import React, { useCallback, useEffect } from "react";
import useGame from "utils/game";
import Modal from "components/Modal";
import moment from "moment";

interface HurryUpGameProps {
  enabled?: boolean;
  canvasProps?: React.DetailedHTMLProps<React.CanvasHTMLAttributes<HTMLCanvasElement>, HTMLCanvasElement>;
}

const HurryUpGame = (props: HurryUpGameProps) => {
  const frameRenderer = useCallback((context: CanvasRenderingContext2D, timestamp: number) => {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height)
    drawClock(context, {x: 150, y: 150}, moment.duration("7:50:00").add(timestamp * 10, "ms"));
  }, []);

  const { canvasRef, start, stop } = useGame(frameRenderer);

  useEffect(() => {
    props.enabled ? start() : stop();
  }, [props.enabled, start, stop]);

  return <Modal visible={props.enabled}>
    <canvas ref={canvasRef} {...props.canvasProps} width={300} height={300}/>
  </Modal>
}

const drawClock = (
  context: CanvasRenderingContext2D,
  offset: {x: number, y: number},
  time: moment.Duration
) => {
  context.beginPath();
  context.strokeStyle = "#C0C0C0";
  context.lineWidth = 2;
  context.arc(offset.x, offset.y, 30, 0, 2 * Math.PI);
  context.stroke();

  const hourPointer = clockPointer(time.asHours(), 12, 20);
  const minutePointer = clockPointer(time.asMinutes(), 60, 30);
  const secondPointer = clockPointer(time.asSeconds(), 60, 30);
  context.beginPath();
  context.strokeStyle = `#303030`;
  context.lineWidth = 3;
  context.lineCap = "round";
  context.moveTo(offset.x, offset.y);
  context.lineTo(offset.x + hourPointer.x, offset.y + hourPointer.y);
  context.stroke();
  context.moveTo(offset.x, offset.y);
  context.lineTo(offset.x + minutePointer.x, offset.y + minutePointer.y);
  context.moveTo(offset.x, offset.y);
  context.lineTo(offset.x + secondPointer.x, offset.y + secondPointer.y);
  context.stroke();
};

const clockPointer = (value: number, fullValue: number, length: number) => {
  const arc = (value / fullValue * 2 * Math.PI);
  return {
    x: Math.sin(arc) * length,
    y: -Math.cos(arc) * length
  }
};

export default HurryUpGame;
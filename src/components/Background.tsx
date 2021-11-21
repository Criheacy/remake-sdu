import useGame from "../utils/game";
import styled from "@emotion/styled";
import {useCallback, useEffect} from "react";

export type SeasonType = "spring" | "summer" | "autumn" | "winter";

const Background = ({season}: {season: SeasonType}) => {
  /*const [lastSeasonChange, setLastSeasonChange] = useState(0);
  const [targetColor, setTargetColor] = useState<string>();
  const [prevColor, setPrevColor] = useState<string>();*/

  const frameRenderer = useCallback((context: CanvasRenderingContext2D, timestamp: number) => {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    let currentSeasonColor: string = "#FFFFFF";

    if (season === "winter") {
      currentSeasonColor = "#cbe9f4";
    } else if (season === "spring") {
      currentSeasonColor = "#daf8ff";
    } else if (season === "summer") {
      currentSeasonColor = "#fced9f";
    } else if (season === "autumn") {
      currentSeasonColor = "#ffdc8a"
    }
    /*if (targetColor !== prevColor) {
      setPrevColor(targetColor);
      setTargetColor(currentSeasonColor);
      setLastSeasonChange(timestamp);
    }*/

    /*let ratio = (timestamp - lastSeasonChange) / 1000;
    if (ratio > 1) ratio = 1;
    context.fillStyle = chroma.scale([prevColor || "#FFFFFF", targetColor || "#FFFFFF"])(ratio).hex();*/
    context.fillStyle = currentSeasonColor;
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
  }, [season]);
  const {canvasRef, start} = useGame(frameRenderer);

  useEffect(start, [start]);

  return <Container>
    <Canvas ref={canvasRef} />
  </Container>
}

const Container = styled.div`
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
`

export default Background;
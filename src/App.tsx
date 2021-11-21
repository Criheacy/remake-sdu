import React, {useCallback, useState} from 'react';
import StoryPage from "./pages/Story";
import styled from "@emotion/styled";
import StartPage from "./pages/Start";

function App() {

  const [stage, setStage] = useState<"start" | "game">("start");

  const handleClick = useCallback(() => {
    setTimeout(() => {
      setStage("game");
    }, 500);
  }, []);

  return (
    <Container>
      {
        stage === "start" ? <StartPage onChange={handleClick} /> : <StoryPage />
      }
    </Container>
  );
}

const Container = styled.div`
  height: 100vh;
`

export default App;

import "./StartButton.css";
import styled from "@emotion/styled";


const StartPage = ({onChange}: {onChange: () => void}) => {
  return <Container>
    <button className="button-82-pushable" onClick={onChange}>
      <span className="button-82-shadow"/>
      <span className="button-82-edge"/>
      <span className="button-82-front text">
        REMAKE
      </span>
    </button>
  </Container>
}

const Container = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

export default StartPage;
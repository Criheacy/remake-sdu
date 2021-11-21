import useStory from "../utils/story";
import React, {useCallback, useEffect, useMemo} from "react";
import styled from "@emotion/styled";
import useNodeSwitcher from "../utils/timer";
import Background from "../components/Background";
import {SelectionType} from "../@types/story";
import useVariable from "../utils/variable";

const StoryPage = () => {
  const [, currentNode, currentTime, {getNextNode, doEffects}] = useStory();
  const [display, optionsDisplay, switchDisplay] = useNodeSwitcher();
  const [variables] = useVariable();

  const season = useMemo(() => 
    (["spring", "summer", "autumn", "winter"] as const)[Math.floor((currentTime + 9) % 12 / 3)]
  , [currentTime]);
  
  const grade = useMemo(() => 
    (["大一", "大二", "大三", "大四"] as const)[Math.floor(currentTime / 12)]
  , [currentTime]);

  const month = useMemo(() =>
      (["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"] as const)[Math.floor((currentTime + 8) % 12)]
    , [currentTime]);
  
  useEffect(() => {
    console.log(variables);
  }, [variables]);
  
  const handleContainerClick = useCallback(() => {
    if (!currentNode || currentNode?.selections.length === 0) {
      if (currentTime < 48) {
        switchDisplay(getNextNode, 600);
      } else {
        window.location.reload();
      }
    }
  }, [currentNode, currentTime, getNextNode, switchDisplay]);
  
  const handleOptionClick = useCallback((selection: SelectionType) => {
    doEffects(selection.effects);
    switchDisplay(getNextNode, 600);
  }, [doEffects, getNextNode, switchDisplay]);
  
  return <Container onClick={handleContainerClick}>
    <TopBar>
      <TopLineContainer />
      <TopTextContainer>
        {grade} · {month}
      </TopTextContainer>
      <TopLineContainer />
    </TopBar>
    <TextContainer style={{ opacity: display ? 1 : 0 }}>
      {
        currentNode?.text.split("\n").map((paragraph, index) =>
          <ParagraphContainer key={`${currentNode.id}-${index}`}>
            {paragraph}
          </ParagraphContainer>
        )
      }
    </TextContainer>
    {
      currentNode?.selections.length !== 0 ?
        <SelectionContainer style={{ opacity: optionsDisplay ? 1 : 0 }}>
          {
            currentNode?.selections.map((selection, index) =>
              <OptionContainer key={index} onClick={() => {
                handleOptionClick(selection)
              }}>{selection.text}</OptionContainer>
            )
          }
        </SelectionContainer> : null
    }
    <Background season={season}/>
  </Container>;
}

const TopBar = styled.div`
  position: absolute;
  top: 1rem;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: 2.4em;
  gap: 1rem;
`

const TopLineContainer = styled.div`
  width: 10%;
  height: 0.15rem;
  background-color: black;
`

const TopTextContainer = styled.div`
  padding-bottom: 0.2rem;
  text-align: center;
`

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4rem;
  
  user-select: none;
`

const TextContainer = styled.div`
  font-size: 3em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1.2rem;
  
  opacity: 0;
  transition: opacity 0.6s;
`

const ParagraphContainer = styled.div`
`

const SelectionContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  font-size: 3.3em;

  opacity: 0;
  transition: opacity 0.6s;
`

const OptionContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 0.2rem 0.4rem;
  
  border-bottom: 0.2rem solid #606060;
  box-sizing: border-box;
  cursor: pointer;
  
  :hover {
    border-bottom: 0.2rem solid black;
  }
  transition: border-color 0.2s;
`

export default StoryPage;
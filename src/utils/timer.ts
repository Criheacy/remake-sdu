import {useCallback, useState} from "react";

const useNodeSwitcher = () => {
  const [display, setDisplay] = useState(true);
  const [subDisplay, setSubDisplay] = useState(true);

  const [displayId, setDisplayId] = useState<NodeJS.Timeout>();
  const [subDisplayId, setSubDisplayId] = useState<NodeJS.Timeout>();


  const switchDisplay = useCallback((switcher: () => void, time: number) => {
    displayId && clearTimeout(displayId);
    subDisplayId && clearTimeout(subDisplayId);

    setDisplay(false);
    setSubDisplay(false);

    setDisplayId(setTimeout(() => {
      switcher();
      setDisplay(true);
    }, time));
    setSubDisplayId(setTimeout(() => {
      setSubDisplay(true);
    }, time * 2));
  }, [displayId, subDisplayId]);

  return [display, subDisplay, switchDisplay] as const;
}

export default useNodeSwitcher;
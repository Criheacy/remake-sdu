import {useDispatch, useSelector} from "react-redux";
import {set, selectStory, setNode} from "../store/story.slice";
import {useCallback, useEffect, useState} from "react";
import {MemorizedNodeType, MemorizedStoryType} from "../@types/memorized";
import useVariable from "./variable";
import weightedPick from "./weighted-random";
import {EffectType} from "../@types/story";

const defaultNodes: MemorizedNodeType[] = [
  {
    id: -1,
    appearanceTimesLeft: 0,
    maxAppearanceTimes: false,
    earliestTime: 0,
    latestTime: 100,
    weight: 1,
    prerequisites: true,
    text: "最近无事发生。\n一切平静如常，但也有些无聊。",
    effects: [],
    selections: []
  },
  {
    id: -2,
    appearanceTimesLeft: 0,
    maxAppearanceTimes: false,
    earliestTime: 0,
    latestTime: 100,
    weight: 1,
    prerequisites: true,
    text: "最近无事发生。\n你静静的看着窗外，有几只孤零零的小鸟飞过。",
    effects: [],
    selections: []
  },
  {
    id: -3,
    appearanceTimesLeft: 0,
    maxAppearanceTimes: false,
    earliestTime: 0,
    latestTime: 100,
    weight: 1,
    prerequisites: true,
    text: "最近无事发生。\n好几次你想出门找点事儿做，但是又提不起兴趣。\n时间仿佛静止了一样。",
    effects: [],
    selections: []
  }
];

const startNode: MemorizedNodeType = {
  id: -10,
  appearanceTimesLeft: 0,
  maxAppearanceTimes: false,
  earliestTime: -1,
  latestTime: -1,
  weight: 1,
  prerequisites: true,
  text: "初入校园的第一天，你感觉到身边的一切都如此有趣。\n新的环境，新的宿舍和同学，甚至这里的空气都与高中有所不同。\n想到这里就是未来四年生活的地方，你的心中充满了斗志。",
  effects: [],
  selections: []
}

const endNode: MemorizedNodeType = {
  id: -20,
  appearanceTimesLeft: 0,
  maxAppearanceTimes: false,
  earliestTime: 48,
  latestTime: 48,
  weight: 1,
  prerequisites: true,
  text: "大学生活即将结束，你站在这四年的终点回头看，好像四年的起点就近在眼前。\n" +
    "在去往机场的班车上，你摇下车窗，眼望着陪伴你的校园在视线中一点一点变小、变得模糊，\n" +
    "最后变成一个小点，消失在地平线上。\n\n" +
    "你和同学们未来都有不同的去向，有人去了知名企业，有人出国深造。\n" +
    "你在人海中寻找着属于自己的道路。\n" +
    "我现在是谁？我又在哪儿？",
  effects: [],
  selections: []
}

// FIXME: 跳转有bug
const useStory = () => {
  const dispatch = useDispatch();
  const story = useSelector(selectStory);
  const [currentNode, setCurrentNode] = useState<MemorizedNodeType | undefined>(startNode);
  const [currentTime, setCurrentTime] = useState(-1);
  const [connectTo, setConnectTo] = useState<number>();
  const [directTo, setDirectTo] = useState<number>();
  const [, { assign, predicate }] = useVariable();
  
  const loadStory = useCallback(() => {
    fetch("data/final.json").then(response => response.json())
      .then((data: MemorizedStoryType) => {
        dispatch(set({...data, nodes: data.nodes.map(node => ({
          ...node, appearanceTimesLeft: node.maxAppearanceTimes || 0
          }))
        }));
      });
  }, [dispatch]);

  // load story initially
  useEffect(() => {
    loadStory();
  }, [loadStory]);

  const doEffects = useCallback((effects: EffectType[]) => {
    effects.forEach(effect => {
      const picked = effect.possibility ? Math.random() <= effect.possibility : false;
      if (picked) {
        setConnectTo(effect.connectTo);
        setDirectTo(effect.directTo);
        assign(effect.assignment);
      }
    })
  }, [assign]);

  const getNextNode = useCallback((dryRun: boolean = false) => {
    let directType: "picked" | "connected" | "directed" = "picked";
    let resultNode: MemorizedNodeType | undefined;
    // if has connected or directed nodes, leads to it directly
    if (connectTo) {
      resultNode = story.story.nodes.find(node => node.id === connectTo);
      directType = "connected";
      setConnectTo(undefined);
    } else if (directTo) {
      resultNode = story.story.nodes.find(node => node.id === directTo);
      directType = "directed";
      setDirectTo(undefined);
    }

    if (!resultNode) {
      const validNodes = story.story.nodes.filter(nodes => {
        if (!predicate(nodes.prerequisites)) return false;
        if (!(nodes.earliestTime <= currentTime + 1 && currentTime + 1 <= nodes.latestTime)) return false;
        if (nodes.maxAppearanceTimes !== false && nodes.appearanceTimesLeft === 0) return false;
        return true;
      });
      console.log(currentTime + 1, story.story.nodes, validNodes);

      resultNode = weightedPick(validNodes, validNodes.map(node => node.weight));
      console.log(resultNode);
    }

    if (!resultNode) {
      resultNode = weightedPick(defaultNodes, defaultNodes.map(node => node.weight));
    }
    if (currentTime >= 47) {
      resultNode = endNode;
    }

    // effects
    if (!dryRun) {
      // the time will not increases if select a connected card
      if (directType !== "connected") setCurrentTime(time => time + 1);
      if (resultNode) {
        setConnectTo(resultNode.connectTo);
        setDirectTo(resultNode.directTo);
        doEffects(resultNode.effects);
        dispatch(setNode({...resultNode, appearanceTimesLeft: resultNode.appearanceTimesLeft - 1}))
      }
    }

    setCurrentNode(resultNode);
    return { node: resultNode, type: directType};
  }, [connectTo, currentTime, directTo, dispatch, doEffects, predicate, story.story.nodes]);

  return [story, currentNode, currentTime, { loadStory, doEffects, getNextNode }] as const;
}

export default useStory;
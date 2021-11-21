import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {RootState} from "./index";
import {MemorizedNodeType, MemorizedStoryType} from "../@types/memorized";

const defaultStory: MemorizedStoryType = {
  author: undefined,
  version: "1.0",
  lastEdit: "",
  nodes: [],
  variables: []
}

export const storySlice = createSlice({
  name: 'story',
  initialState: { story: defaultStory },
  reducers: {
    set: (state, action: PayloadAction<MemorizedStoryType>) => {
      // @ts-ignore
      state.story = action.payload;
    },
    setNode: (state, action: PayloadAction<MemorizedNodeType>) => {
      const index = state.story.nodes.findIndex((node) => node.id === action.payload.id);
      if (index !== -1)
        state.story.nodes[index] = {...state.story.nodes[index], ...action.payload};
    }

  },
})

export const {
  set, setNode
} = storySlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectStory = (state: RootState) => state.story

export default storySlice.reducer;
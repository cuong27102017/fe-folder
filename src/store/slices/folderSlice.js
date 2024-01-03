import { createSlice } from "@reduxjs/toolkit";
import mockFolders from "../../mocks/mockData";

const folderSlice = createSlice({
  name: "folders",
  initialState: mockFolders,
  reducers: {
    addFolder: (state, action) => {
      state.push(action.payload);
    },
    editFolder: (state, action) => {
      const index = state.findIndex(
        (folder) => folder.id === action.payload.id
      );
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    deleteFolder: (state, action) => {
      const index = state.findIndex(
        (folder) => folder.id === action.payload.id
      );
      if (index !== -1) {
        state.splice(index, 1);
      }
      state.forEach((folder) => {
        if (folder.parentId === action.payload.id) {
          folder.parentId = '';
        }
      });
    },
  },
});

export const { addFolder, editFolder, deleteFolder } = folderSlice.actions;

export default folderSlice.reducer;

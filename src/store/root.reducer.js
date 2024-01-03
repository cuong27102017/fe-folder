// src/store/rootReducer.js
import { combineReducers } from "@reduxjs/toolkit";
import folderReducer from "./slices/folderSlice";

const rootReducer = combineReducers({
  folders: folderReducer,
});

export default rootReducer;

import React from "react";
import { Provider } from "react-redux";
import FolderList from "./components/folders/FolderList";
import store from "./store/store";

const App = () => {
  return (
    <Provider store={store}>
      <div style={{ padding: 10 }}>
        <h1>Folder Manager</h1>
        <FolderList />
      </div>
    </Provider>
  );
};

export default App;

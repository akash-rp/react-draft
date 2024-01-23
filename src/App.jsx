import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";

import MyEditor from "./MyEditor";

import "react-toastify/dist/ReactToastify.css";
import "./styles.css";

export default function App() {
  const [editorState, setEditorState] = useState(() => {
    const savedContent = localStorage.getItem("editorContent");
    return savedContent
      ? EditorState.createWithContent(convertFromRaw(JSON.parse(savedContent)))
      : EditorState.createEmpty();
  });

  const saveContent = () => {
    const contentState = editorState.getCurrentContent();
    const contentStateJSON = JSON.stringify(convertToRaw(contentState));
    localStorage.setItem("editorContent", contentStateJSON);
    toast("Editor content saved");
  };

  return (
    <>
      <header>
        <h1>Demo editor by Akash RP</h1>
        <button onClick={saveContent}>Save</button>
      </header>
      <MyEditor editorState={editorState} setEditorState={setEditorState} />
      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        hideProgressBar={true}
        closeOnClick
      />
    </>
  );
}

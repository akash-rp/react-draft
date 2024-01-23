import React from "react";
import { Editor, EditorState, RichUtils, Modifier } from "draft-js";
import { OrderedSet } from "immutable";

const MyEditor = ({ editorState, setEditorState }) => {
  const styleMap = {
    "COLOR-RED": {
      color: "red",
    },
  };

  const prefixStyles = {
    "# ": { blockType: "header-one" },
    "* ": { inlineStyle: "BOLD" },
    "** ": { inlineStyle: "COLOR-RED" },
    "*** ": { inlineStyle: "UNDERLINE" },
  };

  function handleChange(newEditorState) {
    const currentSelection = newEditorState.getSelection();
    const startKey = currentSelection.getStartKey();
    const currentContent = newEditorState.getCurrentContent();
    const currentBlock = currentContent.getBlockForKey(startKey);
    const blockText = currentBlock.getText();

    if (blockText.trim() === "") {
      if (currentBlock.getType() === "header-one") {
        newEditorState = RichUtils.toggleBlockType(
          newEditorState,
          "header-one"
        );
      }

      setEditorState(
        EditorState.setInlineStyleOverride(newEditorState, OrderedSet.of(null))
      );

      return;
    }

    for (const prefix in prefixStyles) {
      if (blockText.startsWith(prefix)) {
        const newContent = Modifier.replaceText(
          currentContent,
          currentSelection.merge({
            anchorOffset: 0,
            focusOffset: prefix.length,
          }),
          ""
        );

        let newEditorState = EditorState.push(
          editorState,
          newContent,
          "change-inline-style"
        );

        if (prefixStyles[prefix].blockType) {
          newEditorState = RichUtils.toggleBlockType(
            newEditorState,
            prefixStyles[prefix].blockType
          );
        }

        if (prefixStyles[prefix].inlineStyle) {
          newEditorState = EditorState.setInlineStyleOverride(
            newEditorState,
            OrderedSet.of(prefixStyles[prefix].inlineStyle)
          );
        }

        setEditorState(newEditorState);
        return;
      }
    }

    setEditorState(newEditorState);
  }

  return (
    <Editor
      editorState={editorState}
      onChange={handleChange}
      customStyleMap={styleMap}
    />
  );
};

export default MyEditor;

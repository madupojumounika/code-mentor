import React, { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorView, Decoration } from "@codemirror/view";
import { RangeSetBuilder, EditorState } from "@codemirror/state";

const CodeEditor = ({ code, setCode, language, height = "400px", readOnly = false, highlightLine = null }) => {
  const [decorations, setDecorations] = useState(Decoration.none);

  const langExtension = {
    javascript: javascript(),
    python: python(),
    java: java(),
    cpp: cpp(),
  };

  useEffect(() => {
    if (!highlightLine) {
      setDecorations(Decoration.none);
      return;
    }

    const builder = new RangeSetBuilder();
    try {
      const state = EditorState.create({ doc: code });
      const line = state.doc.line(highlightLine);
      builder.add(
        line.from,
        line.to,
        Decoration.line({ attributes: { style: "background-color: rgba(255,0,0,0.2);" } })
      );
      setDecorations(builder.finish());
    } catch (e) {
      setDecorations(Decoration.none);
    }
  }, [highlightLine, code]);

  const extensions = [
    langExtension[language] || javascript(),
    EditorView.lineWrapping,
    EditorView.editable.of(!readOnly),
    EditorView.decorations.of(decorations),
  ];

  return (
    <div className="border rounded-xl overflow-hidden shadow">
      <CodeMirror
        value={code}
        height={height}
        theme={oneDark}
        extensions={extensions}
        onChange={(value) => setCode(value)}
      />
    </div>
  );
};

export default CodeEditor;

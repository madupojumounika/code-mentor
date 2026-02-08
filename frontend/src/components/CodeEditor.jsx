import React, { useMemo } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorView, Decoration } from "@codemirror/view";
import { StateField } from "@codemirror/state";

const CodeEditor = ({
  code,
  setCode,
  language,
  height = "400px",
  readOnly = false,
  highlightLine = null
}) => {
  const langExtension = {
    javascript: javascript(),
    python: python(),
    java: java(),
    cpp: cpp()
  };

  const errorLineField = useMemo(() => {
    return StateField.define({
      create() {
        return Decoration.none;
      },
      update(_, tr) {
        if (!highlightLine) return Decoration.none;

        try {
          const line = tr.state.doc.line(highlightLine);
          return Decoration.set([
            Decoration.line({
              attributes: {
                style: "background-color: rgba(255, 0, 0, 0.25);"
              }
            }).range(line.from)
          ]);
        } catch {
          return Decoration.none;
        }
      },
      provide: f => EditorView.decorations.from(f)
    });
  }, [highlightLine]);

  const extensions = [
    langExtension[language] || javascript(),
    EditorView.lineWrapping,
    EditorView.editable.of(!readOnly),
    errorLineField
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

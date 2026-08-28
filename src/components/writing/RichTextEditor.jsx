import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowClockwise,
  ArrowCounterClockwise,
  Link,
  ListBullets,
  ListNumbers,
  Quotes,
  TextB,
  TextItalic,
  TextUnderline,
} from "@phosphor-icons/react";
import { normalizeEditorLink, normalizePastedText } from "../../data/writingSession.js";

const FORMAT_BLOCKS = {
  paragraph: "p",
  heading1: "h1",
  heading2: "h2",
  heading3: "h3",
};

const QUERY_COMMANDS = {
  bold: "bold",
  italic: "italic",
  underline: "underline",
  unorderedList: "insertUnorderedList",
  orderedList: "insertOrderedList",
};

export function RichTextEditor({ value, onChange }) {
  const editorRef = useRef(null);
  const [commandStates, setCommandStates] = useState({
    bold: false,
    italic: false,
    underline: false,
    unorderedList: false,
    orderedList: false,
  });

  const updateCommandStates = useCallback(() => {
    if (typeof document === "undefined") return;

    setCommandStates(
      Object.fromEntries(
        Object.entries(QUERY_COMMANDS).map(([name, command]) => [
          name,
          document.queryCommandState(command),
        ]),
      ),
    );
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return undefined;

    document.addEventListener("selectionchange", updateCommandStates);
    return () => document.removeEventListener("selectionchange", updateCommandStates);
  }, [updateCommandStates]);

  const runCommand = useCallback((command, commandValue) => {
    if (typeof document === "undefined") return;

    editorRef.current?.focus();
    document.execCommand(command, false, commandValue);
    updateCommandStates();
  }, [updateCommandStates]);

  const addLink = () => {
    if (typeof window === "undefined") return;

    const valueToLink = window.prompt("Enter an https:// URL");
    const link = normalizeEditorLink(valueToLink ?? "");
    if (link) runCommand("createLink", link);
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const text = normalizePastedText(event.clipboardData.getData("text/plain"));
    document.execCommand("insertText", false, text);
    updateCommandStates();
  };

  const toolButtons = [
    { label: "Bold", command: "bold", icon: TextB, state: "bold" },
    { label: "Italic", command: "italic", icon: TextItalic, state: "italic" },
    { label: "Underline", command: "underline", icon: TextUnderline, state: "underline" },
    { label: "Add link", onClick: addLink, icon: Link },
    { label: "Block quote", command: "formatBlock", value: "blockquote", icon: Quotes },
    {
      label: "Bulleted list",
      command: "insertUnorderedList",
      icon: ListBullets,
      state: "unorderedList",
    },
    {
      label: "Numbered list",
      command: "insertOrderedList",
      icon: ListNumbers,
      state: "orderedList",
    },
    { label: "Undo", command: "undo", icon: ArrowCounterClockwise },
    { label: "Redo", command: "redo", icon: ArrowClockwise },
  ];

  return (
    <section aria-label="Article editor" className="rich-editor">
      <div aria-label="Article formatting" className="editor-toolbar" role="toolbar">
        <label className="editor-style-select">
          <select
            aria-label="Paragraph style"
            defaultValue="paragraph"
            onChange={(event) => runCommand("formatBlock", FORMAT_BLOCKS[event.target.value])}
          >
            <option value="paragraph">Paragraph</option>
            <option value="heading1">Heading 1</option>
            <option value="heading2">Heading 2</option>
            <option value="heading3">Heading 3</option>
          </select>
        </label>
        {toolButtons.map(({ command, icon: Icon, label, onClick, state, value: commandValue }) => (
          <button
            aria-label={label}
            aria-pressed={state ? commandStates[state] : undefined}
            className="editor-tool"
            key={label}
            onClick={onClick ?? (() => runCommand(command, commandValue))}
            type="button"
          >
            <Icon aria-hidden="true" size={19} weight="bold" />
          </button>
        ))}
      </div>
      <div
        aria-label="Article editor"
        aria-multiline="true"
        className="editor-surface"
        contentEditable
        dangerouslySetInnerHTML={{ __html: value }}
        onInput={(event) => onChange(event.currentTarget.innerHTML)}
        onPaste={handlePaste}
        ref={editorRef}
        role="textbox"
        suppressContentEditableWarning
      />
    </section>
  );
}

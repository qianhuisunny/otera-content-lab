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

export function synchronizeEditorValue(editor, value) {
  if (editor && editor.innerHTML !== value) editor.innerHTML = value;
}

export function captureEditorSelection(editor, selection) {
  if (!editor || !selection || selection.rangeCount === 0) return null;

  const range = selection.getRangeAt(0);
  return editor.contains(range.commonAncestorContainer) ? range.cloneRange() : null;
}

export function restoreEditorSelection(range, selection) {
  if (!range || !selection) return false;

  selection.removeAllRanges();
  selection.addRange(range);
  return true;
}

export function RichTextEditor({ value, onChange }) {
  const editorRef = useRef(null);
  const initialHtmlRef = useRef({ __html: value });
  const linkInputRef = useRef(null);
  const linkSelectionRef = useRef(null);
  const [isLinkComposerOpen, setIsLinkComposerOpen] = useState(false);
  const [linkValue, setLinkValue] = useState("");
  const [linkError, setLinkError] = useState("");
  const [commandStates, setCommandStates] = useState({
    bold: false,
    italic: false,
    underline: false,
    unorderedList: false,
    orderedList: false,
  });

  const updateCommandStates = useCallback(() => {
    if (typeof document === "undefined") return;

    const nextStates = Object.fromEntries(
      Object.entries(QUERY_COMMANDS).map(([name, command]) => [
        name,
        document.queryCommandState(command),
      ]),
    );
    setCommandStates((currentStates) => (
      Object.keys(QUERY_COMMANDS).every((name) => currentStates[name] === nextStates[name])
        ? currentStates
        : nextStates
    ));
  }, []);

  useEffect(() => {
    synchronizeEditorValue(editorRef.current, value);
  }, [value]);

  useEffect(() => {
    if (isLinkComposerOpen) linkInputRef.current?.focus();
  }, [isLinkComposerOpen]);

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

  const saveLinkSelection = useCallback(() => {
    if (typeof window === "undefined") return;

    linkSelectionRef.current = captureEditorSelection(editorRef.current, window.getSelection());
  }, []);

  const closeLinkComposer = useCallback(() => {
    if (typeof window !== "undefined") {
      restoreEditorSelection(linkSelectionRef.current, window.getSelection());
    }
    linkSelectionRef.current = null;
    setIsLinkComposerOpen(false);
    setLinkValue("");
    setLinkError("");
    editorRef.current?.focus();
  }, []);

  const openLinkComposer = () => {
    if (!linkSelectionRef.current) saveLinkSelection();
    setLinkValue("");
    setLinkError("");
    setIsLinkComposerOpen(true);
  };

  const submitLink = (event) => {
    event.preventDefault();
    const link = normalizeEditorLink(linkValue);
    if (!link) {
      setLinkError("Enter a valid http(s) URL.");
      return;
    }

    if (typeof window !== "undefined") {
      restoreEditorSelection(linkSelectionRef.current, window.getSelection());
    }
    runCommand("createLink", link);
    linkSelectionRef.current = null;
    setIsLinkComposerOpen(false);
    setLinkValue("");
    setLinkError("");
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
    {
      label: "Add link",
      onClick: openLinkComposer,
      onMouseDown: saveLinkSelection,
      icon: Link,
      controls: "editor-link-composer",
      expanded: isLinkComposerOpen,
    },
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
        {toolButtons.map(({
          command,
          controls,
          expanded,
          icon: Icon,
          label,
          onClick,
          onMouseDown,
          state,
          value: commandValue,
        }) => (
          <button
            aria-controls={controls}
            aria-expanded={expanded}
            aria-label={label}
            aria-pressed={state ? commandStates[state] : undefined}
            className="editor-tool"
            key={label}
            onClick={onClick ?? (() => runCommand(command, commandValue))}
            onMouseDown={onMouseDown}
            type="button"
          >
            <Icon aria-hidden="true" size={19} weight="bold" />
          </button>
        ))}
      </div>
      {isLinkComposerOpen ? (
        <form
          aria-label="Add link"
          className="editor-link-composer"
          id="editor-link-composer"
          noValidate
          onSubmit={submitLink}
          role="dialog"
        >
          <label htmlFor="editor-link-url">Link URL</label>
          <input
            aria-describedby="editor-link-error"
            aria-invalid={Boolean(linkError)}
            id="editor-link-url"
            inputMode="url"
            onChange={(event) => setLinkValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.preventDefault();
                closeLinkComposer();
              }
            }}
            ref={linkInputRef}
            type="url"
            value={linkValue}
          />
          <div className="editor-link-composer__actions">
            <button className="editor-link-action" type="submit">Apply link</button>
            <button className="editor-link-action" onClick={closeLinkComposer} type="button">Cancel</button>
          </div>
          <p aria-live="polite" className="editor-link-composer__error" id="editor-link-error">
            {linkError}
          </p>
        </form>
      ) : null}
      <div
        aria-label="Article editor"
        aria-multiline="true"
        className="editor-surface"
        contentEditable
        dangerouslySetInnerHTML={initialHtmlRef.current}
        onInput={(event) => onChange(event.currentTarget.innerHTML)}
        onPaste={handlePaste}
        ref={editorRef}
        role="textbox"
        suppressContentEditableWarning
      />
    </section>
  );
}

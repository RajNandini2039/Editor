import React, { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  FaBold,
  FaItalic,
  FaQuoteRight,
  FaLink,
  FaImage,
  FaCode,
  FaListUl,
  FaListOl,
  FaTrash,
  FaPlus,
  FaHeading,
  FaStrikethrough,
} from "react-icons/fa";
import { FaListCheck } from "react-icons/fa6";
import "./editor.css";

const Editor = ({ onEmptyNotes }) => {
  const [title, setTitle] = useState("");
  const [markdown, setMarkdown] = useState("# Enter title here");
  const [showPreview, setShowPreview] = useState(false);
  const [notes, setNotes] = useState([]);
  const textareaRef = useRef(null);

  const insertAtCursor = (before, after = "", multiLine = false) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = markdown.substring(start, end);

    let newText;
    if (multiLine) {
      // Apply formatting to each line individually
      const lines = selected.split("\n");
      const formatted = lines.map((line) => before + line).join("\n");
      newText =
        markdown.substring(0, start) + formatted + markdown.substring(end);

      setMarkdown(newText);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start, start + formatted.length);
      }, 0);
    } else {
      // Default behavior for inline formatting
      newText =
        markdown.substring(0, start) +
        before +
        selected +
        after +
        markdown.substring(end);

      setMarkdown(newText);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(
          start + before.length,
          start + before.length + selected.length
        );
      }, 0);
    }
  };

  const saveNote = () => {
    if (title.trim() !== "" || markdown.trim() !== "") {
      setNotes((prev) => [...prev, { title, content: markdown }]);
      setTitle("");
      setMarkdown("# Enter title here");
      setShowPreview(false);
    }
  };

  const deleteNote = (index) => {
    const updated = notes.filter((_, i) => i !== index);
    setNotes(updated);
    if (updated.length === 0) {
      onEmptyNotes();
    }
  };

  const openNote = (note) => {
    setTitle(note.title);
    setMarkdown(note.content);
    setShowPreview(false);
  };

  return (
    <div className="editor-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="header-name-btn">
            <h1>NOTES</h1>
            <button onClick={saveNote}>
              <FaPlus className="icon-button" />
            </button>
          </div>
          <input
            type="text"
            placeholder="Enter note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="title-input"
          />
        </div>

        <div className="notes-list">
          {notes.map((note, index) => (
            <div key={index} className="note-item">
              <div onClick={() => openNote(note)}>
                {note.title || "Untitled"}
              </div>
              <button
                onClick={() => deleteNote(index)}
                className="delete-button"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>

        <div className="title-input-section">
          <button
            onClick={() => {
              setTitle("");
              setMarkdown("# Enter title here");
            }}
            className="clear-note-button"
          >
            <FaTrash /> Clear Note
          </button>
        </div>
      </aside>

      {/* Editor & Preview */}
      <main className="editor-panel">
        <div className="toolbar">
          <button
            onClick={() => setShowPreview(false)}
            className={`toggle-tab ${!showPreview ? "active" : ""}`}
          >
            Write
          </button>
          <button
            onClick={() => setShowPreview(true)}
            className={`toggle-tab ${showPreview ? "active" : ""}`}
          >
            Preview
          </button>
          {!showPreview && (
            <div className="toolbar-icons">
              <div className="toolbar-grp">
                <FaHeading onClick={() => insertAtCursor("### ")} />
                <FaBold onClick={() => insertAtCursor("**", "**")} />
                <FaItalic onClick={() => insertAtCursor("*", "*")} />
                <FaStrikethrough onClick={() => insertAtCursor("~~", "~~")} />
              </div>
              <div className="toolbar-grp">
                <FaQuoteRight onClick={() => insertAtCursor("> ")} />
                <FaLink onClick={() => insertAtCursor("[", "](url)")} />
                <FaImage onClick={() => insertAtCursor("![alt](", ")")} />
                <FaCode onClick={() => insertAtCursor("`", "`")} />
              </div>
              <div className="toolbar-grp">
                <FaListUl onClick={() => insertAtCursor("- ", "", true)} />
                <FaListOl onClick={() => insertAtCursor("1. ", "", true)} />
                <FaListCheck
                  onClick={() => insertAtCursor("- [ ] ", "", true)}
                />
              </div>
            </div>
          )}
        </div>

        <div className="editor-body">
          <textarea
            ref={textareaRef}
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className={`editor-textarea ${showPreview ? "hidden" : ""}`}
          />
          <div
            className={`editor-preview ${showPreview ? "visible" : "hidden"}`}
          >
            <div className="markdown-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {markdown}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Editor;
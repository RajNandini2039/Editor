
import React, { useState } from 'react';
import Editor from './Editor';
import './App.css'; // <-- Importing the CSS file

const App = () => {
  const [showEditor, setShowEditor] = useState(false);

  const handleCreateNote = () => {
    setShowEditor(true);
  };

  const handleNoNotesLeft = () => {
    setShowEditor(false);
  };

  return (
    <div className="app-container">
      {!showEditor ? (
        <div className="create-screen">
          <h1>You have no notes</h1>
          <button className="create-button" onClick={handleCreateNote}>
            Create Note
          </button>
        </div>
      ) : (
        <Editor onEmptyNotes={handleNoNotesLeft} />
      )}
    </div>
  );
};

export default App;

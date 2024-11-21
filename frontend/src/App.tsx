import React, { useState } from 'react';
import './App.css';
import FileUpload from './components/NoteUpload';
import FlashcardList from './components/FlashCardList';
import { Flashcard } from './type';

function App() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);

  const handleUploadSuccess = (flashcards: Flashcard[]) => {
    setFlashcards(flashcards);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to StudySpark</h1>
        <p>Upload your PDF or image file</p>
        <FileUpload onUploadSuccess={handleUploadSuccess} />
        {flashcards.length > 0 && <FlashcardList flashcards={flashcards} />}
      </header>
    </div>
  );
}

export default App;

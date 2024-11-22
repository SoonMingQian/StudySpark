import React, { useState, useEffect } from 'react';
import './styles/App.css';
import './styles/CardHover.css'
import FileUpload from './components/NoteUpload';
import FlashcardList from './components/FlashCardList';
import DecksPage from './pages/DecksPage';
import { Flashcard, Deck } from './type';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

const testDecks: Deck[] = [
  {
    name: 'Science Basics',
    flashcards: [
      { front: 'What is the formula for water?', back: 'H₂O' },
      { front: 'What planet is known as the Red Planet?', back: 'Mars' },
    ],
  },
  {
    name: 'Math Fundamentals',
    flashcards: [
      { front: 'What is 2 + 2?', back: '4' },
      { front: 'What is the square root of 16?', back: '4' },
    ],
  },
  {
    name: 'History Facts',
    flashcards: [
      { front: 'Who was the first President of the United States?', back: 'George Washington' },
      { front: 'In what year did World War II end?', back: '1945' },
    ],
  },
]

const testFlashCards: Flashcard[] = Array.from({ length: 10 }, (_, i) => ({
  front: `Question ${i + 1}`,
  back: `Answer ${i + 1}`,
}));

function App() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([{ front: 'lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum', back: 'lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem' }, ...testFlashCards]);
  const [decks, setDecks] = useState<Deck[]>(testDecks)

  const handleUploadSuccess = (flashcards: Flashcard[]) => {
    setFlashcards(flashcards);
  };

  const saveDeck = (name: string) => {
    const newDeck: Deck = { name, flashcards }
    setDecks([...decks, newDeck])
    setFlashcards([]) //clear flashcards after saving
  }

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <nav>
            <Link to="/">Home</Link> | <Link to="/decks">Decks</Link>
          </nav>
          <Routes>
            <Route
              path="/"
              element={
                <div>
                  <h1>Welcome to StudySpark</h1>
                  <p>Upload your PDF or image file</p>
                  <FileUpload onUploadSuccess={handleUploadSuccess} />
                  {flashcards.length > 0 && (
                    <div>
                      <FlashcardList flashcards={flashcards} />
                      <button onClick={() => {
                        const deckName = prompt("Enter a name for this deck:");
                        if (deckName) saveDeck(deckName);
                      }}>
                        Save as Deck
                      </button>
                    </div>
                  )}
                </div>
              }
            />
            <Route path="/decks" element={<DecksPage decks={decks} />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;

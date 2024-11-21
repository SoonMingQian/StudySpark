import React, { useState, useEffect } from 'react';
import './App.css';
import FileUpload from './components/NoteUpload';
import FlashcardList from './components/FlashCardList';
import DecksPage from './pages/DecksPage';
import { Flashcard, Deck } from './type';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

function App() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [decks, setDecks] = useState<Deck[]>([])

  // // Load decks from localStorage on app start
  // useEffect(() => {
  //   const savedDecks = localStorage.getItem('decks');
  //   if (savedDecks) {
  //     setDecks(JSON.parse(savedDecks));
  //   }
  // }, []);

  // // Save decks to localStorage whenever it changes
  // useEffect(() => {
  //   localStorage.setItem('decks', JSON.stringify(decks));
  // }, [decks]);

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

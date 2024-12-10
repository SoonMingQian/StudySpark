import React, { useState, useEffect } from 'react';
import './styles/App.css';
// import './styles/CardHover.css'
import './styles/FlashcardList.css'
import './styles/QuizPage.css'
import './styles/DeckPage.css'
import './styles/FileUpload.css'
import './styles/LoginPage.css'
import ProtectedRoute from './components/ProtectedRoute';
import DecksPage from './pages/DecksPage';
import QuizPage from './pages/QuizPage';
import UploadPage from './pages/UploadPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { Flashcard, Deck } from './type';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CardBrowserPage from './pages/CardBrowserPage';


function App() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [decks, setDecks] = useState<Deck[]>([]) 
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  const fetchUserData = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/flashcards/getdecks`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userDecks = await response.json();
        setDecks(userDecks);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    }
  };

  useEffect(() => { 

    if (isLoggedIn) {
      fetchUserData();
    }
  }, [isLoggedIn]);

  
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <nav>
            {isLoggedIn ? <><Link to="/">Home</Link> | <Link to="/decks">Decks</Link> | </> : (<></>)}
            
            {isLoggedIn ? (
              <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                Logout
              </button>
            ) : (
              <>
                <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
              </>
            )}
          </nav>
          <Routes>
            <Route path="/" element={<ProtectedRoute>
              <UploadPage flashcards={flashcards} setFlashcards={setFlashcards} decks={decks} setDecks={setDecks} fetchUserData={fetchUserData}/>
            </ProtectedRoute>              
              } />
            <Route path="/decks" element={<ProtectedRoute><DecksPage decks={decks} /></ProtectedRoute>} />
            <Route path="/quiz/:id" element={<ProtectedRoute><QuizPage decks={decks} setDecks={setDecks} /></ProtectedRoute>} />
            <Route path="/browse/:id" element={<ProtectedRoute><CardBrowserPage decks={decks} setDecks={setDecks} /></ProtectedRoute>}/>
            <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;

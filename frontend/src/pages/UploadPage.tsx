import React from 'react';
import { Link } from 'react-router-dom';
import { Flashcard, Deck } from '../type';
import FlashcardList from '../components/FlashCardList';
import FileUpload from '../components/NoteUpload';

interface UploadPageProps {
    flashcards: Flashcard[];
    setFlashcards: React.Dispatch<React.SetStateAction<Flashcard[]>>;
    decks: Deck[];
    setDecks: React.Dispatch<React.SetStateAction<Deck[]>>;
    fetchUserData: () => Promise<void>
}



const UploadPage: React.FC<UploadPageProps> = ({ flashcards, setFlashcards, decks, setDecks, fetchUserData }) => {
    const handleUploadSuccess = (flashcards: Flashcard[]) => {
        setFlashcards(flashcards);
    };
    const saveDeck = async (name: string) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:4000/api/flashcards/saveToDeck', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ flashcards, deckName: name }),
            });

            if (response.ok) {
                const newDeck = await response.json();
                setDecks([...decks, newDeck]);
                fetchUserData(); //refetch the userdata because new data has been added in save
                setFlashcards([]); // Clear flashcards after saving
            } else {
                console.error('Failed to save deck');
            }
        } catch (error) {
            console.error('Error saving deck:', error);
        }
    };


    return (
        <div>
            <h1>Welcome to StudySpark</h1>
            <p>Upload your PDF or image file</p>
            <FileUpload onUploadSuccess={handleUploadSuccess} />
            {flashcards.length > 0 && (
                <div>
                    <FlashcardList flashcards={flashcards} setFlashcards={setFlashcards} />
                    <button onClick={() => {
                        const deckName = prompt("Enter a name for this deck:");
                        if (deckName) saveDeck(deckName);
                    }}>
                        Save as Deck
                    </button>
                </div>
            )}
        </div>
    );
};

export default UploadPage;

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import FlashcardList from '../components/FlashCardList';
import { Deck } from '../type';
import axios from 'axios';

interface CardBrowserPageProps {
    decks: Deck[];
    setDecks: React.Dispatch<React.SetStateAction<Deck[]>>;
}

const CardBrowserPage: React.FC<CardBrowserPageProps> = ({ decks, setDecks }) => {
    const { id } = useParams<{ id: string }>();
    const deck = decks.find((d) => d._id === id);  // Find by ID instead of index

    const [flashcards, setFlashcards] = useState(deck?.flashcards || []);
    const [showForm, setShowForm] = useState(false);
    const [newFlashcard, setNewFlashcard] = useState({ front: '', back: '' });

    useEffect(() => {
        if (deck) setFlashcards(deck.flashcards)
    }, [deck]);

    const handleSaveChanges = async () => {
        console.log("Flashcards being saved:", flashcards);
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('User not authenticated.');

            await axios.put(
                `${process.env.REACT_APP_API_URL}/api/flashcards/updatedeck/${id}`,
                { name: deck?.name, flashcards: flashcards.map(({ _id, front, back }) => ({ _id, front, back })) },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            // Fetch the updated deck
            const { data } = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/flashcards/getdecks`, {
                headers: { Authorization: `Bearer ${token}` }
            }
            );

            setDecks(data);  // Set the updated decks in state

            alert('Changes saved successfully!');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                // Handle Axios-specific errors
                console.error('Failed to save changes:', error.response?.data || error.message);
            } else {
                // Handle generic errors
                console.error('An unexpected error occurred:', (error as Error).message);
            }
            alert('Failed to save changes. Please try again.');
        }
    };

    const handleAddFlashcard = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('User not authenticated.');

            const { data: addedFlashcard } = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/flashcards/addflashcard`,
                { front: newFlashcard.front, back: newFlashcard.back, deckId: id },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setFlashcards([...flashcards, addedFlashcard]);
            setNewFlashcard({ front: '', back: '' });
            setShowForm(false);

            // Refetch the deck data to sync
            const { data: updatedDecks } = await axios.get(`${process.env.REACT_APP_API_URL}/api/flashcards/getdecks`, {
                headers: { Authorization: `Bearer ${token}` },
            }); 
            setDecks(updatedDecks);
        } catch (error) {
            console.error('Error adding flashcard:', error);
            alert('Failed to add flashcard.');
        }
    };

    const handleRenameDeck = async () => {
        const newName = prompt('Enter the new deck name:', deck?.name);
        if (newName && newName !== deck?.name) {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error('User not authenticated.');

                await axios.put(
                    `${process.env.REACT_APP_API_URL}/api/flashcards/updatedeck/${id}`,
                    { name: newName, flashcards },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                // Update the deck name locally
                const updatedDecks = decks.map(d => d._id === id ? { ...d, name: newName } : d);
                setDecks(updatedDecks);

                alert('Deck name updated successfully!');
            } catch (error) {
                console.error('Error updating deck name:', error);
                alert('Failed to update deck name.');
            }
        }
    };

    return (
        <div>
            <h2>Browsing Deck: {deck?.name || "Deck Not Found"}
                <span
                    style={{ cursor: 'pointer', color: 'blue', marginLeft: '10px' }}
                    onClick={handleRenameDeck}
                >
                    Rename
                </span>
            </h2>

            <button onClick={() => setShowForm(!showForm)}>Add Flashcard</button>
            <button onClick={handleSaveChanges}>Save Changes</button>

            {showForm && (
                <form onSubmit={handleAddFlashcard}>
                    <div>
                        <label>Front:</label>
                        <input
                            type="text"
                            value={newFlashcard.front}
                            onChange={(e) => setNewFlashcard({ ...newFlashcard, front: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label>Back:</label>
                        <input
                            type="text"
                            value={newFlashcard.back}
                            onChange={(e) => setNewFlashcard({ ...newFlashcard, back: e.target.value })}
                            required
                        />
                    </div>
                    <button type="submit">Add</button>
                    <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
                </form>
            )}

            <FlashcardList flashcards={flashcards} setFlashcards={setFlashcards}/>

        </div>
    );
};

export default CardBrowserPage;

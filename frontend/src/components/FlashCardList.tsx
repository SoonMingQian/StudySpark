import React, { useState } from 'react';
import '../styles/FlashcardList.css';
import { Flashcard } from '../type';
import axios from 'axios';

interface FlashCardListProps {
  flashcards: Flashcard[];
  setFlashcards: React.Dispatch<React.SetStateAction<Flashcard[]>>;
  showDeleteButton?: boolean;
}

const FlashcardList: React.FC<FlashCardListProps> = ({ flashcards, setFlashcards, showDeleteButton = true }) => {
  const [flippedCards, setFlippedCards] = useState<boolean[]>(new Array(flashcards.length).fill(false));

  const handleCardClick = (index: number) => {
    const newFlippedCards = [...flippedCards];
    newFlippedCards[index] = !newFlippedCards[index];
    setFlippedCards(newFlippedCards);
  };

  const handleEditBtnClicked = (index: number) => {
    const currentCard = flashcards[index];

    // Prompt the user to edit front and back text
    const newFront = prompt("Edit Front Text:", currentCard.front);
    const newBack = prompt("Edit Back Text:", currentCard.back);

    // Update the flashcard only if the user provides input
    if (newFront !== null && newBack !== null) {
      const updatedFlashcards = [...flashcards];
      updatedFlashcards[index] = { front: newFront, back: newBack };
      setFlashcards(updatedFlashcards); // Update state
    }
  };

  const handleDeleteBtnClicked = async (index: number) => {
    const flashcardToDelete = flashcards[index];

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('User not authenticated.');

      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/flashcards/deleteflashcard/${flashcardToDelete._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Remove the deleted flashcard from state
      const updatedFlashcards = flashcards.filter((_, i) => i !== index);
      setFlashcards(updatedFlashcards);

      alert('Flashcard deleted successfully!');
      window.location.reload(); 
    } catch (error) {
      console.error('Error deleting flashcard:', error);
      alert('Failed to delete flashcard.');
    }
  };

  return (
    <div>
      <div className="flashcard-grid">
        {flashcards.map((flashcard, index) => (
          <div key={index} className="card__container">
            <div className={`card__article ${flippedCards[index] ? 'is-flipped' : ''}`} onClick={() => handleCardClick(index)}>
              <div className="card__front">
                <p>{flashcard.front}</p>
              </div>
              <div className="card__back">
                <p>{flashcard.back}</p>
              </div>
            </div>
            <div>
              <button className="card__button" onClick={(e) => { e.stopPropagation(); handleEditBtnClicked(index); }}>Edit</button>
              {showDeleteButton && (
                <button className="card__button" onClick={(e) => { e.stopPropagation(); handleDeleteBtnClicked(index); }}>Delete</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlashcardList;
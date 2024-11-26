import React, { useState } from 'react';
import '../styles/FlashcardList.css';
import { Flashcard } from '../type';

interface FlashCardListProps {
  flashcards: Flashcard[];
  setFlashcards: React.Dispatch<React.SetStateAction<Flashcard[]>>;
}

const FlashcardList: React.FC<FlashCardListProps> = ({ flashcards, setFlashcards }) => {
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

  return (
    <div>
      <h2>Generated Flashcards</h2>
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
            <button className="card__button" onClick={(e) => { e.stopPropagation(); handleEditBtnClicked(index); }}>Edit</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlashcardList;
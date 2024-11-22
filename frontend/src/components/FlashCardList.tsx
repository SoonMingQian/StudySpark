import React from "react";
import { Flashcard } from '../type';

interface FlashCardListProps {
    flashcards: Flashcard[];
    setFlashcards: React.Dispatch<React.SetStateAction<Flashcard[]>>
}

const FlashcardList: React.FC<FlashCardListProps> = ({ flashcards, setFlashcards }) => {
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
                        <article className="card__article">
                            <div className="card__front">
                                {flashcard.front}
                            </div>
                            <div className="card__data">
                                <span className="card__description">
                                    {flashcard.back}
                                </span>
                                <button className="card__button" onClick={()=>handleEditBtnClicked(index)}>Edit</button>
                            </div>
                        </article>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default FlashcardList;
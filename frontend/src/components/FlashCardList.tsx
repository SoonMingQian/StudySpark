import React from "react";
import { Flashcard } from '../type';

interface FlashCardListProps {
    flashcards: Flashcard[];
}

const FlashcardList: React.FC<FlashCardListProps> = ({ flashcards }) => {
    return (
        <div>
            <h2>Generated Flashcards</h2>
            {flashcards.map((flashcard, index) => (
                <div key={index} className="flashcard">
                    <div className="flashcard-front">
                        <strong>Front:</strong> {flashcard.front}
                    </div>
                    <div className="flashcard-back">
                        <strong>Back:</strong> {flashcard.back}
                    </div>
                </div>
            ))}
        </div>
    )

}

export default FlashcardList;
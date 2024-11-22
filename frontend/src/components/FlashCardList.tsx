import React from "react";
import { Flashcard } from '../type';

interface FlashCardListProps {
    flashcards: Flashcard[];
}

const FlashcardList: React.FC<FlashCardListProps> = ({ flashcards }) => {
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
                                <a href="#" className="card__button">Edit</a>
                            </div>
                        </article>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default FlashcardList;
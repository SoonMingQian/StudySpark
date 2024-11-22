import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Deck } from '../type';

interface QuizPageProps {
    decks: Deck[];
    setDecks: React.Dispatch<React.SetStateAction<Deck[]>>;
}

const QuizPage: React.FC<QuizPageProps> = ({ decks, setDecks }) => {
    const { id } = useParams<{ id: string }>();
    const deckIndex = parseInt(id || '0');
    const deck = decks[deckIndex];

    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    const handleNext = () => {
        setIsFlipped(false);
        setCurrentCardIndex((prevIndex) =>
            prevIndex === deck.flashcards.length - 1 ? 0 : prevIndex + 1
        );
    };
    const handleBack = () => {
        setIsFlipped(false);
        setCurrentCardIndex((prevIndex) =>
            prevIndex === 0 ? deck.flashcards.length - 1 : prevIndex - 1
        );
    };

    const handleEdit = () => {
        const currentCard = deck.flashcards[currentCardIndex];
        const newFront = prompt("Edit Front Text:", currentCard.front);
        const newBack = prompt("Edit Back Text:", currentCard.back);

        if (newFront !== null && newBack !== null) {
            const updatedDecks = [...decks];
            updatedDecks[deckIndex].flashcards[currentCardIndex] = {
                front: newFront,
                back: newBack,
            };
            setDecks(updatedDecks);
        }
    };

    return (
        <div>
            <h2>{deck.name} Quiz</h2>
            <div className="flashcard" onClick={handleFlip}>
                {isFlipped ? deck.flashcards[currentCardIndex].back : deck.flashcards[currentCardIndex].front}
            </div>
            <button onClick={handleBack}>Back</button>
            <button onClick={handleNext}>Next</button>
            <button onClick={handleEdit}>Edit</button>
        </div>
    );
};

export default QuizPage;

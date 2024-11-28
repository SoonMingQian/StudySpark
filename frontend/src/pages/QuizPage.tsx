import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Deck } from '../type';

interface QuizPageProps {
    decks: Deck[];
    setDecks: React.Dispatch<React.SetStateAction<Deck[]>>;
}

const QuizPage: React.FC<QuizPageProps> = ({ decks, setDecks }) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const deck = decks.find((d) => d._id === id);  // Find by ID instead of index

    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    if (!deck) {
        return <p>Deck not found.</p>; // Handle missing deck scenario
    }

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

    return (
        <div>
            <h2>{deck.name} Quiz</h2>
            <button onClick={() => { navigate(`/browse/${id}`) }}>Go to Deck Browser</button>
            <div className="card__container quiz-card-container">
                <div
                    className={`card__article ${isFlipped ? 'is-flipped' : ''}`}
                    onClick={handleFlip}
                >
                    <div className="card__front">
                        {deck.flashcards[currentCardIndex].front}
                    </div>
                    <div className="card__back">
                        {deck.flashcards[currentCardIndex].back}
                    </div>
                </div>
            </div>
            <div className="controls">
                <button onClick={handleBack}>Back</button>
                <button onClick={handleNext}>Next</button>
            </div>
        </div>
    );
};

export default QuizPage;

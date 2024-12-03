import React from 'react';
import { Link } from 'react-router-dom';
import { Deck} from '../type';

interface DecksPageProps {
    decks: Deck[];
}

const DecksPage: React.FC<DecksPageProps> = ({ decks }) => {
    return (
        <div>
            <h2>Your Decks</h2>
            {decks.length === 0 ? (
                <p>No decks available. Upload and save a deck!</p>
            ) : (
                decks.map((deck, index) => (
                    <div key={index} className="deck">
                        <h3>
                            <Link to={`/quiz/${deck._id}`}>{deck.name}</Link>
                        </h3>
                        <p>{deck.flashcards.length} flashcards</p>
                        <button>
                            <Link to={`/browse/${deck._id}`}>Browse All Cards</Link>
                        </button>
                    </div>
                ))
            )}
        </div>
    );
};

export default DecksPage;

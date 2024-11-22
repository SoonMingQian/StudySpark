const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema({
    front: {
        type: String,
        required: true
    },
    back: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    deck: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Deck'
    }
});

const Flashcard = mongoose.model('Flashcard', flashcardSchema);

module.exports = Flashcard;
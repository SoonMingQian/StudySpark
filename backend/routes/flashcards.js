const express = require('express');
const multer = require('multer');
const { generateFlashcards } = require('../services/aiService');
const { protect } = require('../middleware/authMiddleware');
const Flashcard = require('../models/flashcard');
const Deck = require('../models/deck');
const User = require('../models/user');
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.post('/generate', protect, upload.single('pdf'), async (req, res) => {
    try {
        const pdfPath = req.file.path;
        const flashcards = await generateFlashcards(pdfPath, req.user._id);
        res.send(flashcards);
    } catch (error) {
        res.status(500).send('Error processing PDF');
    }
});

router.post('/saveToDeck', protect, async (req, res) => {
    try {
        const { flashcards, deckName } = req.body;

        // Create a new deck
        const newDeck = new Deck({
            name: deckName,
            user: req.user._id,
            flashcards: []
        });

        // Save the flashcards to the database and associate them with the new deck
        const savedFlashcards = [];
        for (const flashcard of flashcards) {
            const newFlashcard = new Flashcard({
                front: flashcard.front,
                back: flashcard.back,
                user: req.user._id,
                deck: newDeck._id
            });
            const savedFlashcard = await newFlashcard.save();
            savedFlashcards.push(savedFlashcard);
        }

        // Update the deck's flashcards 
        newDeck.flashcards = savedFlashcards.map(f => f._id);
        await newDeck.save();

        // Update the user's decks
        await User.findByIdAndUpdate(req.user._id, {
            $push: { decks: newDeck._id }
        });

        res.json(newDeck);
    } catch (error) {
        console.error('Error saving flashcards to deck:', error);
        res.status(500).send('Error saving flashcards to deck');
    }
});

router.get('/getflashcards', protect, async (req, res) => {
    try {
        const { deckId } = req.query;
        const flashcards = await Flashcard.find({ user: req.user._id, deck: deckId });
        res.json(flashcards);
    } catch (error) {
        res.status(500).send('Error getting flashcards');
    }
});

router.get('/getdecks', protect, async (req, res) => {
    try {
        const decks = await Deck.find({ user: req.user._id }).populate('flashcards');
        res.json(decks);
    } catch (error) {
        res.status(500).send('Error fetching decks');
    }
});


module.exports = router;
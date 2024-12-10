const express = require('express');
const multer = require('multer');
const { generateFlashcards } = require('../services/aiService');
const { protect } = require('../middleware/authMiddleware');
const Flashcard = require('../models/flashcard');
const Deck = require('../models/deck');
const User = require('../models/user');
const router = express.Router();
const mongoose = require('mongoose')
const cors = require('cors');
// Handle preflight requests
router.options('*', cors());
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

router.put('/updateflashcard/:id', protect, async (req, res) => {
    try {
        const { id } = req.params;
        const { front, back } = req.body;

        const flashcard = await Flashcard.findById(id);

        if (!flashcard) {
            return res.status(404).send('Flashcard not found');
        }

        if (flashcard.user.toString() !== req.user._id.toString()) {
            return res.status(403).send('Unauthorized');
        }

        flashcard.front = front;
        flashcard.back = back;

        const updatedFlashcard = await flashcard.save();

        res.json(updatedFlashcard);
    } catch (error) {
        res.status(500).send('Error updating flashcard');
    }
})

router.put('/updatedeck/:id', protect, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, flashcards } = req.body;

        const deck = await Deck.findById(id);
        if (!deck) return res.status(404).send('Deck not found');
        if (deck.user.toString() !== req.user._id.toString()) {
            return res.status(403).send('Unauthorized');
        }

        const savedFlashcards = [];
        for (const f of flashcards) {
            if (!f._id) {
                // Create a new flashcard if no ID is present
                const newFlashcard = new Flashcard({
                    front: f.front,
                    back: f.back,
                    user: req.user._id,
                    deck: id,
                });
                const saved = await newFlashcard.save();
                savedFlashcards.push(saved._id);
            } else {
                savedFlashcards.push(f._id);
            }
        }
        deck.name = name || deck.name;
        deck.flashcards = savedFlashcards;
        await deck.save();

        res.json(deck);
    } catch (error) {
        console.error('Error updating deck:', error);
        res.status(500).send('Error updating deck');
    }
});

router.post('/addflashcard', protect, async (req, res) => {
    try {
        const { front, back, deckId } = req.body;

        const deck = await Deck.findById(deckId);
        if (!deck) return res.status(404).send('Deck not found');
        if (deck.user.toString() !== req.user._id.toString()) {
            return res.status(403).send('Unauthorized');
        }

        // Create and save new flashcard
        const newFlashcard = new Flashcard({
            front,
            back,
            user: req.user._id,
            deck: deckId,
        });
        const savedFlashcard = await newFlashcard.save();

        // Add the flashcard to the deck
        deck.flashcards.push(savedFlashcard._id);
        await deck.save();

        res.json(savedFlashcard);
    } catch (error) {
        console.error('Error adding flashcard:', error);
        res.status(500).send('Error adding flashcard');
    }
});

router.delete('/deleteflashcard/:id', protect, async (req, res) => {
    try {
        const { id } = req.params;

        // Find the flashcard and delete it
        const flashcard = await Flashcard.findById(id);
        if (!flashcard) return res.status(404).send('Flashcard not found');

        // Ensure the flashcard belongs to the authenticated user
        if (flashcard.user.toString() !== req.user._id.toString()) {
            return res.status(403).send('Unauthorized');
        }

        // Remove the flashcard from the deck
        const deck = await Deck.findById(flashcard.deck);
        if (deck) {
            deck.flashcards = deck.flashcards.filter(f => f.toString() !== id);
            await deck.save();
        }

        // Delete the flashcard from the database
        await Flashcard.findByIdAndDelete(id);

        res.json({ message: 'Flashcard deleted successfully' });
    } catch (error) {
        console.error('Error deleting flashcard:', error);
        res.status(500).send('Error deleting flashcard');
    }
});

module.exports = router;
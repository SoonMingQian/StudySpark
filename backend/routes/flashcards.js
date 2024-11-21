const express = require('express');
const multer = require('multer');
const router = express.Router();
const { generateFlashcards } = require('../services/aiService');

const upload = multer({ dest: 'uploads/' });

router.post('/generate', upload.single('pdf'), async (req, res) => {
    try {
        const pdfPath = req.file.path;
        const flashcards = await generateFlashcards(pdfPath);
        res.send(flashcards);
    } catch (error) {
        res.status(500).send('Error processing PDF');
    }
});


module.exports = router;
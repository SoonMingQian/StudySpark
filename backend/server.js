require('dotenv').config();
const express = require('express')
const cors = require('cors');
const app = express()
app.use(express.json())
app.use(cors()); 
const port = 4000

// Import flashcards routes
const flashcards = require('./routes/flashcards');

// Use flashcards routes
app.use('/api/flashcards', flashcards);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
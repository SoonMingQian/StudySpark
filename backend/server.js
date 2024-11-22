require('dotenv').config();
const express = require('express')
const cors = require('cors');
const mongoose = require('mongoose');
const app = express()
app.use(express.json())
app.use(cors()); 
const port = 4000

const mongoURI = process.env.MONGO_URI;

// Connecting to MongoDB using mongoose
main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(mongoURI)
}

// Import flashcards routes
const auth = require('./routes/auth');
const flashcards = require('./routes/flashcards');

// Use flashcards routes
app.use('/api/auth', auth);
app.use('/api/flashcards', flashcards);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
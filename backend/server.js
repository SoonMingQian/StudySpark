// server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

// Apply CORS middleware globally before defining routes
app.use(cors({
    origin: 'https://witty-grass-0c7996403.4.azurestaticapps.net',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());

// Use the port provided by Azure or default to 4000
const port = process.env.PORT || 4000;

const mongoURI = process.env.MONGO_URI;

// Connecting to MongoDB using mongoose
main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(mongoURI)
}

// Import routes
const auth = require('./routes/auth');
const flashcards = require('./routes/flashcards');

// Use routes
app.use('/api/auth', auth);
app.use('/api/flashcards', flashcards);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
require('dotenv').config();
const express = require('express')
const cors = require('cors');
const mongoose = require('mongoose');
const app = express()
app.use(express.json())
// Define allowed origins
const allowedOrigins = [
    'https://witty-grass-0c7996403.4.azurestaticapps.net',
    'http://localhost:3000', // For local development
];

// CORS configuration
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
}));

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
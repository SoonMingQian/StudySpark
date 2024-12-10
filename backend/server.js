require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());
app.use(cors({
    origin: 'https://witty-grass-0c7996403.4.azurestaticapps.net',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Use the port provided by Azure or default to 4000
const port = process.env.PORT || 4000;
const mongoURI = process.env.MONGO_URI;

// Validate environment variables
const validateEnvironment = () => {
    const required = ['NODE_ENV', 'MONGO_URI'];
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length) {
        console.error('Missing required environment variables:', missing);
        return false;
    }
    return true;
};

// Connecting to MongoDB using mongoose
async function connectToMongoDB() {
    try {
        console.log('Attempting MongoDB connection...');
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000 // 5 second timeout
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error details:', {
            name: error.name,
            message: error.message,
            code: error.code
        });
        throw error;
    }
}

// Add error handlers for mongoose
mongoose.connection.on('error', err => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

// Start the server
async function startServer() {
    console.log('Starting server with configuration:');
    console.log('--------------------------------');
    console.log({
        NODE_ENV: process.env.NODE_ENV || 'not set',
        PORT: port,
        MONGO_URI: process.env.MONGO_URI ? 'set' : 'not set'
    });

    if (!validateEnvironment()) {
        throw new Error('Invalid environment configuration');
    }

    try {
        await connectToMongoDB();

        app.listen(port, () => {
            console.log(`Server running on port ${port} in ${process.env.NODE_ENV} mode`);
        });
    } catch (error) {
        console.error('Startup error:', error);
        process.exit(1);
    }
}

// Import routes
const auth = require('./routes/auth');
const flashcards = require('./routes/flashcards');

// Add before your routes
app.options('*', cors()); // Enable pre-flight for all routes
app.get('/api/debug', (req, res) => {
    res.json({
        environment: process.env.NODE_ENV,
        mongoURI: process.env.MONGO_URI ? 'Set' : 'Not Set',
        port: process.env.PORT,
        websitesPort: process.env.WEBSITES_PORT,
    });
});

// Use routes
app.use('/api/auth', auth);
app.use('/api/flashcards', flashcards);

// Add global error handler
app.use((err, req, res, next) => {
    console.error('Global error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
startServer().catch(err => {
    console.error('Fatal error during startup:', err);
    process.exit(1);
});
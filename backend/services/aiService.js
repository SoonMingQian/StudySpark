const axios = require('axios');
const fs = require('fs');
const pdf = require('pdf-parse');
const { GoogleGenerativeAI } = require('@google/generative-ai');


async function generateFlashcards(pdfPath) {
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
    });
    try {
        // Read the PDF file
        const pdfData = fs.readFileSync(pdfPath);
        const pdfText = await pdf(pdfData);
        
        // Create a prompt for the AI model
        const prompt = `Create flashcards from the following PDF content:\n\n${pdfText.text}`;

        // Send the prompt to the Google AI Studio API
        const result = await model.generateContent({
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: prompt }
                    ]
                }
            ]
        });

        console.log('AI Response:', JSON.stringify(result, null, 2));

        // Check if the response contains the expected data
        if (result?.response?.candidates?.[0]?.content?.parts?.[0]?.text) {
            const flashcardsText = result.response.candidates[0].content.parts[0].text;
            const flashcards = parseFlashcards(flashcardsText);
            return flashcards;
        } else {
            throw new Error('Unexpected response structure');
        }
    } catch (error) {
        console.error('Error generating flashcards:', error);
        throw error;
    }
}

function parseFlashcards(text) {
    const flashcards = [];
    const flashcardPairs = text.split('\n\n\n');

    // Remove array. as it's incorrect
    flashcardPairs.forEach(pair => {
        const [front, back] = pair.split('\n\n**Back:**');
        if (front && back) {
            flashcards.push({
                front: front.replace('**Front:**', '').trim(),
                back: back.trim()
            });
        }
    });

    return flashcards;
}

module.exports = {
    generateFlashcards
};
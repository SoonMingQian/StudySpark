const axios = require('axios');
const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function generateFlashcards(pdfPath) {
    try{
        const pdfData = fs.readFileSync(pdfPath);
        const pdfBase64 = pdfData.toString('base64');
        const prompt = `Create flashcards from the following PDF content`
        
        const response = await model.generateContent({
            input: {
                prompt: prompt,
                content: pdfBase64
            }
        })

        const flashcards = response.data.content;
        return flashcards;
    } catch (error) {
        console.error('Error generating flashcards:', error);
        throw error;
    }
}

module.exports = {
    generateFlashcards
}
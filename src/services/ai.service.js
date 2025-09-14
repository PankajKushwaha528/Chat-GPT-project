
const { GoogleGenAI } = require  ("@google/genai");

 const ai = new GoogleGenAI({});

 async function generateAIResponse(content) {
    try {
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: content,
    });

    return response.text;

    } catch (error) {
    console.error("Error generating AI response:", error);
    return "Sorry, I couldn't process your request at the moment.";
}
 }
       
module.exports = { generateAIResponse };
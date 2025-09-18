
const { Pinecone } =require ('@pinecone-database/pinecone');

// Initialize a Pinecone client with your API key
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

// Create or connect to an index
const cohortChatGptIndex = pc.Index('cohort-chat-gpt');

// Function to upsert a vector
// async function createMemory({vector,metadata,messageId}){
    
//     await cohortChatGptIIndex.upsert([{
//         id: messageId,
//         values: vector,
//         metadata: metadata
//     }]);
// }
async function createMemory({ vectors, metadata, messageId }) {
    await cohortChatGptIndex.upsert([ {
        id: messageId,
        values: vectors,
        metadata: metadata,
    } ])
}

// Function to query vectors
async function queryMemory({queryVector,limit=5,metadata}){
    const data = await cohortChatGptIndex.query({
        vector: queryVector,
        topK: limit,
        filter: metadata? metadata : undefined,
        includeMetadata: true,
    });
    return data.matches;
}

module.exports = {createMemory,queryMemory};
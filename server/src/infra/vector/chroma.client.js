import { ChromaClient } from "chromadb";
import { openai } from "../llm/openai.client.js";

const CHROMA_COLLECTION_NAME = "Indian_Law_Acts";

const chroma = new ChromaClient(); 

/**
 * OpenAI embedding function (manual, explicit)
 */
const embeddingFunction = {
  generate: async (texts) => {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: texts,
    });

    return response.data.map(d => d.embedding);
  },
};

/**
 * Get or create the Chroma collection
 */
export async function getOrCreateChromaCollection() {
  try {
    return await chroma.getCollection({
      name: CHROMA_COLLECTION_NAME,
      embeddingFunction,
    });
  } catch {
    return await chroma.createCollection({
      name: CHROMA_COLLECTION_NAME,
      embeddingFunction,
    });
  }
}
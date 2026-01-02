import { CloudClient } from "chromadb";
import { openai } from "../llm/openai.client.js";

const CHROMA_COLLECTION_NAME = "Indian_Law_Acts";

// const chroma = new ChromaClient(); 



const chroma = new CloudClient({
  apiKey: 'ck-8ePn3omPUvtBn7n3TrQh2zqcqkKgPU1qekFvLrgwdKBt',
  tenant: '1985f5f2-7b61-467f-93ed-afe6a5a9048f',
  database: 'Dev'
});
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
import { decideQueryRoute } from "./chatRouting.service.js";
import { extractLawMetadata } from "./metadataExtractor.service.js";
import { shouldUseLegalData } from "./dataQueryDecision.service.js";
import {
  generateExactLawResponse,
  generateDataDrivenChatResponse,
  generatePureChatResponse,
} from "./responseComposer.service.js";

import { getOrCreateChromaCollection } from "../../infra/vector/chroma.client.js";
import { chromaQuery } from "../../infra/vector/chroma.query.js";


export async function generateAIResponse( userQuery ) {
  
  

  const route = await decideQueryRoute(userQuery);
  console.log(route);

  const collection = await getOrCreateChromaCollection();

 
  // EXACT LAW QUERY
  
  if (route === "EXACT_LAW_QUERY") {
    const metadata = await extractLawMetadata(userQuery);

    const where = {};
    Object.entries(metadata).forEach(([k, v]) => {
      if (v) where[k] = v;
    });

    const chunks = await chromaQuery(
      collection,
      userQuery,
      where,
      5
    );

    return generateExactLawResponse(metadata, chunks);
  }

  
  // CHAT QUERY
  
  const needsData = await shouldUseLegalData(userQuery);
  console.log(needsData);

  if (!needsData) {
    return generatePureChatResponse(userQuery);
  }

  const chunks = await chromaQuery(collection, userQuery,null, 5);
  console.log(chunks);

  return generateDataDrivenChatResponse(userQuery, chunks);
}
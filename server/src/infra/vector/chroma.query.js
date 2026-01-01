/**
 * Query Chroma and normalize output
 *
 * @param collection - chroma collection
 * @param queryText  - user query
 * @param where      - optional metadata filter
 * @param k          - top K results
 */
export async function chromaQuery(
  collection,
  queryText,
  where ,
  k 
) {
  console.log(`🔍 Chroma query: "${queryText}"`);
  console.log(`🔍 Initial where:`, where);
  console.log(`🔍 k: ${k}`);
  
  try {
    // Clean the where object - remove null/undefined/empty values
    let cleanWhere = where;
    
    if (where && typeof where === 'object') {
      cleanWhere = {};
      for (const [key, value] of Object.entries(where)) {
        // Only include non-empty, non-null values
        if (value !== null && 
            value !== undefined && 
            value !== '' && 
            value !== 'null' && 
            value !== 'undefined') {
          cleanWhere[key] = value;
        }
      }
      
      // If cleanWhere is empty, set to null
      if (Object.keys(cleanWhere).length === 0) {
        cleanWhere = null;
        console.log(`⚠️ Where cleaned to empty, using null instead`);
      }
    }
    
    console.log(`🔍 Clean where:`, cleanWhere);
    
    // Build query parameters
    const queryParams = {
      queryTexts: [queryText],
      nResults: k,
    };
    
    // Only add where if it's not null/undefined and not empty
    if (cleanWhere) {
      queryParams.where = cleanWhere;
    }
    
    console.log(`📤 Final query params:`, queryParams);
    
    const result = await collection.query(queryParams);
    console.log(`✅ Found ${result.ids?.[0]?.length || 0} results`);
    
    const docs = [];
    const contents = result.documents?.[0] || [];
    const metas = result.metadatas?.[0] || [];
    const distances = result.distances?.[0] || [];

    for (let i = 0; i < contents.length; i++) {
      docs.push({
        content: contents[i],
        metadata: metas[i] || {},
        distance: distances[i] ?? null,
      });
    }

    return docs;
  } catch (error) {
    console.error('❌ Chroma query error:', error.message);
    console.error('Error details:', {
      queryText,
      where,
      k
    });
    
    // Return empty array on error
    return [];
  }
}
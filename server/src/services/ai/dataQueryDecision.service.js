import { openai, LLM_MODEL } from "../../infra/llm/openai.client.js";

export async function shouldUseLegalData(userQuery) {
  console.log(`🔍 Evaluating if legal data needed for: "${userQuery}"`);
  
  // First, do a quick local check for obvious cases
  const lowerQuery = userQuery.toLowerCase().trim();
  
  // Always use data for serious legal questions about crimes, laws, statutes
  const alwaysUseDataKeywords = [
    // Crimes
    'murder', 'rape', 'assault', 'theft', 'robbery', 'fraud', 'kidnapping', 
    'homicide', 'manslaughter', 'crime', 'criminal',
    // Laws and statutes
    'law', 'act', 'statute', 'section', 'ipc', 'crpc', 'cpc', 'constitution',
    'article', 'provision', 'clause', 'rule', 'regulation',
    // Legal procedures
    'bail', 'arrest', 'trial', 'court', 'judge', 'police', 'fir', 'complaint',
    'evidence', 'witness', 'sentencing', 'punishment', 'penalty',
    // Specific legal questions
    'apply', 'applicable', 'relevant', 'govern', 'cover', 'pertain',
    'what laws', 'which laws', 'legal provisions', 'statutory'
  ];

  // Check if query contains any of these keywords
  for (const keyword of alwaysUseDataKeywords) {
    if (lowerQuery.includes(keyword)) {
      console.log(`✅ Keyword match "${keyword}" - definitely needs legal data`);
      return true;
    }
  }

  // For ambiguous cases, use LLM with better prompt
  const prompt = `
You are a legal expert determining if answering this question requires referencing specific laws, statutes, or legal texts.

Answer "YES" if:
- The question asks about specific laws or legal provisions that apply to a situation
- The question mentions a crime or legal issue that would be governed by specific statutes
- The question asks "what laws apply" or "which laws govern"
- The answer would benefit from citing specific sections of law
- The question is about legal procedures, rights, or obligations

Answer "NO" only if:
- The question is purely hypothetical or philosophical about law in general
- The question is asking about your capabilities as an AI
- The question is a simple greeting or introduction
- The question is too vague to provide any meaningful legal references

Important: When in doubt, answer "YES" for legal questions.

Examples:
- "my child was murdered what laws apply here" → YES
- "what is section 420 of IPC" → YES
- "how to file for divorce" → YES
- "what can you do for me" → NO
- "hello" → NO
- "what is law" → NO (too philosophical)
- "should I get a lawyer" → NO (advisory)
- "what are my rights if arrested" → YES

Question: "${userQuery}"

Answer with ONLY one word: "YES" or "NO"
`;

  try {
    const resp = await openai.chat.completions.create({
      model: LLM_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
      max_tokens: 5,
    });

    const result = resp.choices[0].message.content.trim().toUpperCase();
    console.log(`🤖 LLM decision: ${result} for query: "${userQuery}"`);
    
    return result === "YES";
  } catch (error) {
    console.error('Error in shouldUseLegalData:', error);
    // Default to true for legal questions to be safe
    return true;
  }
}
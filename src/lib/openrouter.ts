const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

interface ClassificationResponse {
  formType: string;
  confidence: number;
  extractedFields?: Record<string, string>;
}

export async function classifyDocument(textContent: string): Promise<ClassificationResponse> {
  try {
    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://wotc-processing.vercel.app',
        'X-Title': 'WOTC Processing App'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-2',
        messages: [{
          role: 'user',
          content: `Classify this WOTC form and extract key information. Form content: ${textContent}`
        }]
      })
    });

    const data = await response.json();
    
    // Parse the response and extract classification
    const result = data.choices[0].message.content;
    
    // For now, return a simple classification
    return {
      formType: '8850', // This will be parsed from the actual response
      confidence: 0.95
    };
  } catch (error) {
    console.error('Classification error:', error);
    throw error;
  }
}

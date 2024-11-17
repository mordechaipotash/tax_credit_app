import { identifyForm, extractFormFields } from './forms/templates';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

interface ClassificationResponse {
  formType: string;
  confidence: number;
  extractedFields?: Record<string, string>;
  aiExtractedFields?: Record<string, string>;
  title?: string;
  description?: string;
}

export async function classifyDocument(textContent: string): Promise<ClassificationResponse> {
  try {
    // First, use pattern matching
    const { formType, confidence, template } = identifyForm(textContent);
    const extractedFields = extractFormFields(textContent, template.keyFields);

    // Then, use AI for additional extraction and verification
    const systemPrompt = `You are an expert at analyzing WOTC (Work Opportunity Tax Credit) forms. 
    The form has been identified as Form ${formType} (${template.title}) with ${confidence * 100}% confidence.
    
    Please analyze the text and:
    1. Verify this classification
    2. Extract any additional fields not caught by pattern matching
    3. Return a JSON object with your findings
    
    Form fields already extracted: ${JSON.stringify(extractedFields)}`;

    const userPrompt = `Analyze this WOTC form text and extract additional information:
    
    ${textContent}`;

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
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      throw new Error('Classification request failed');
    }

    const data = await response.json();
    const aiResult = JSON.parse(data.choices[0].message.content);

    // Combine pattern matching and AI results
    return {
      formType,
      confidence: Math.max(confidence, aiResult.confidence || 0),
      extractedFields,
      aiExtractedFields: aiResult.extractedFields,
      title: template.title,
      description: template.description
    };
  } catch (error) {
    console.error('Classification error:', error);
    // Fall back to pattern matching only if AI fails
    const { formType, confidence, template } = identifyForm(textContent);
    return {
      formType,
      confidence,
      extractedFields: extractFormFields(textContent, template.keyFields),
      title: template.title,
      description: template.description
    };
  }
}

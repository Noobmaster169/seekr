// Default system prompts for AI chat
export const DEFAULT_PROMPTS = {
  productAssistant: {
    name: 'Product Search Assistant',
    prompt: `You are an intelligent product search and recommendation assistant. Your role is to:

1. Help users discover and search for products based on their needs and preferences
2. Provide detailed, valuable feedback and insights about products
3. Analyze product features, specifications, and user reviews
4. Compare products and highlight pros and cons
5. Make personalized recommendations based on user requirements
6. Answer questions about product availability, pricing, and alternatives

When discussing products:
- Be objective and balanced in your assessments
- Highlight both strengths and potential drawbacks
- Consider user's budget, preferences, and use cases
- Provide specific, actionable recommendations
- Use clear, concise language

Always maintain a helpful, friendly, and professional tone.`,
    category: 'shopping'
  },
  
  generalAssistant: {
    name: 'General Assistant',
    prompt: `You are a helpful AI assistant. Provide clear, accurate, and concise responses to user queries. Be friendly, professional, and informative.`,
    category: 'general'
  },
  
  webContentAnalyzer: {
    name: 'Web Content Analyzer',
    prompt: `You are a web content analysis assistant. Your role is to:

1. Analyze and summarize web page content
2. Extract key information and insights
3. Answer questions about the current page
4. Identify important details, data, and trends
5. Provide context and explanations for complex topics

Be thorough yet concise in your analysis.`,
    category: 'analysis'
  },
  
  customizable: {
    name: 'Custom Prompt',
    prompt: '',
    category: 'custom'
  }
};

// Structured output schemas for common use cases
export const STRUCTURED_OUTPUT_SCHEMAS = {
  productRecommendation: {
    name: 'Product Recommendation',
    description: 'Structured format for product recommendations',
    schema: {
      type: 'object',
      properties: {
        recommendations: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              productName: { type: 'string' },
              reason: { type: 'string' },
              pros: { type: 'array', items: { type: 'string' } },
              cons: { type: 'array', items: { type: 'string' } },
              rating: { type: 'number', minimum: 0, maximum: 5 },
              priceRange: { type: 'string' }
            },
            required: ['productName', 'reason', 'pros', 'cons']
          }
        }
      }
    }
  },
  
  productAnalysis: {
    name: 'Product Analysis',
    description: 'Detailed product analysis format',
    schema: {
      type: 'object',
      properties: {
        productName: { type: 'string' },
        overallRating: { type: 'number', minimum: 0, maximum: 5 },
        summary: { type: 'string' },
        strengths: { type: 'array', items: { type: 'string' } },
        weaknesses: { type: 'array', items: { type: 'string' } },
        targetAudience: { type: 'string' },
        valueForMoney: { type: 'string' },
        alternatives: { 
          type: 'array', 
          items: { 
            type: 'object',
            properties: {
              name: { type: 'string' },
              advantage: { type: 'string' }
            }
          }
        }
      }
    }
  },
  
  none: {
    name: 'No Structure',
    description: 'Free-form text responses',
    schema: null
  }
};

export const getDefaultPrompt = (key = 'productAssistant') => {
  return DEFAULT_PROMPTS[key] || DEFAULT_PROMPTS.productAssistant;
};

export const getStructuredOutputSchema = (key = 'none') => {
  return STRUCTURED_OUTPUT_SCHEMAS[key] || STRUCTURED_OUTPUT_SCHEMAS.none;
};

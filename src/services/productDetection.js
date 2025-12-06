/**
 * Product Detection Service for Instagram Reels
 * 
 * This service uses Claude API to detect fashion products from Instagram Reels.
 * NO search functionality - only detection and structured JSON output.
 */

/**
 * Product Detection Result Schema
 * @typedef {Object} ProductDetectionResult
 * @property {string} reel_url - The Instagram Reel URL
 * @property {string} primary_focus - Primary focus category
 * @property {Array<Product>} products - Detected products
 * @property {Array<string>} search_queries - Search queries for Lindy (not used by extension)
 * @property {string} notes - Additional notes
 */

/**
 * Product Schema
 * @typedef {Object} Product
 * @property {string} id - Unique product identifier
 * @property {string} role - "primary" | "secondary"
 * @property {string} category - Product category
 * @property {string} description - Product description
 * @property {string|null} color - Product color
 * @property {string|null} style - Product style
 * @property {string|null} fit - Product fit
 * @property {string|null} pattern - Product pattern
 * @property {string|null} material - Product material
 * @property {string} brand - Product brand (or "UNKNOWN")
 * @property {string|null} gender - Gender target
 * @property {number} confidence - Confidence score (0-1)
 */

/**
 * Get Claude API key from storage or environment
 * @returns {Promise<string|null>}
 */
async function getClaudeApiKey() {
  try {
    // Try to get from Chrome storage first
    if (typeof chrome !== 'undefined' && chrome.storage) {
      const result = await chrome.storage.sync.get(['claudeApiKey'])
      if (result.claudeApiKey) {
        return result.claudeApiKey
      }
    }
    
    // Fallback to environment variable (for development)
    // In production, this should be set via extension settings
    return null
  } catch (error) {
    console.error('Error getting Claude API key:', error)
    return null
  }
}

/**
 * Build the Claude prompt for product detection
 * @param {string} reelUrl - Instagram Reel URL
 * @param {string} caption - Reel caption (optional)
 * @param {Array<string>} hashtags - Hashtags (optional)
 * @param {string} imageBase64 - Base64 encoded image (optional)
 * @returns {string}
 */
function buildDetectionPrompt(reelUrl, caption = '', hashtags = [], imageBase64 = null) {
  const hashtagsText = hashtags.length > 0 ? hashtags.join(', ') : 'None'
  const captionText = caption || 'No caption available'
  
  let prompt = `You are a fashion product detection expert. Analyze the provided Instagram Reel and detect all visible fashion products.

REEL INFORMATION:
- URL: ${reelUrl}
- Caption: ${captionText}
- Hashtags: ${hashtagsText}
${imageBase64 ? '- Image: Provided (base64 encoded)' : '- Image: Not provided'}

INSTRUCTIONS:
1. Analyze the visual content and text to identify ALL fashion products visible in the reel
2. Focus on: Tops, Bottoms, Dresses, Outerwear, Shoes, Bags, Accessories
3. Allow MULTIPLE products per reel
4. NEVER hallucinate brands - use "UNKNOWN" if brand is unclear
5. Assign a confidence score (0.0 to 1.0) for each product detection
6. Generate 2-4 search query phrases that Lindy can use for product searching (you are NOT performing the search)

CRITICAL RULES:
- Return ONLY valid JSON - no markdown, no code blocks, no explanations
- Use "UNKNOWN" for brand if not clearly visible or mentioned
- Confidence scores must be between 0.0 and 1.0
- Include all products visible, not just the primary one
- Search queries should be descriptive phrases (e.g., "red midi dress", "white sneakers")

REQUIRED JSON SCHEMA:
{
  "reel_url": "${reelUrl}",
  "primary_focus": "top" | "bottom" | "dress" | "shoes" | "bag" | "accessory" | "outfit" | "unknown",
  "products": [
    {
      "id": "unique-id-1",
      "role": "primary" | "secondary",
      "category": "string (e.g., 'dress', 'top', 'shoes')",
      "description": "detailed description",
      "color": "string | null",
      "style": "string | null",
      "fit": "string | null",
      "pattern": "string | null",
      "material": "string | null",
      "brand": "string (use 'UNKNOWN' if unclear)",
      "gender": "string | null",
      "confidence": 0.0-1.0
    }
  ],
  "search_queries": [
    "string (2-4 descriptive phrases for Lindy)"
  ],
  "notes": "string (any additional observations)"
}

Return ONLY the JSON object, nothing else.`

  return prompt
}

/**
 * Call Claude API for product detection
 * @param {string} apiKey - Claude API key
 * @param {string} prompt - Detection prompt
 * @param {string|null} imageBase64 - Base64 encoded image (optional)
 * @returns {Promise<string>} - Raw JSON response
 */
async function callClaudeAPI(apiKey, prompt, imageBase64 = null) {
  const apiUrl = 'https://api.anthropic.com/v1/messages'
  
  const messages = []
  
  // Add image if provided
  if (imageBase64) {
    messages.push({
      role: 'user',
      content: [
        {
          type: 'image',
          source: {
            type: 'base64',
            media_type: 'image/jpeg',
            data: imageBase64
          }
        },
        {
          type: 'text',
          text: prompt
        }
      ]
    })
  } else {
    messages.push({
      role: 'user',
      content: prompt
    })
  }
  
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      messages: messages
    })
  })
  
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Claude API error: ${response.status} - ${errorText}`)
  }
  
  const data = await response.json()
  
  // Extract text from response
  if (data.content && data.content.length > 0) {
    return data.content[0].text
  }
  
  throw new Error('No content in Claude API response')
}

/**
 * Parse and validate JSON response
 * @param {string} jsonString - Raw JSON string
 * @param {string} reelUrl - Reel URL for fallback
 * @returns {ProductDetectionResult}
 */
function parseAndValidateJSON(jsonString, reelUrl) {
  try {
    // Clean the JSON string (remove markdown code blocks if present)
    let cleaned = jsonString.trim()
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '')
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '')
    }
    
    const parsed = JSON.parse(cleaned)
    
    // Validate required fields
    if (!parsed.reel_url) parsed.reel_url = reelUrl
    if (!parsed.primary_focus) parsed.primary_focus = 'unknown'
    if (!Array.isArray(parsed.products)) parsed.products = []
    if (!Array.isArray(parsed.search_queries)) parsed.search_queries = []
    if (!parsed.notes) parsed.notes = ''
    
    // Validate products
    parsed.products = parsed.products.map((product, index) => ({
      id: product.id || `product-${index + 1}`,
      role: product.role || 'secondary',
      category: product.category || 'unknown',
      description: product.description || 'No description',
      color: product.color || null,
      style: product.style || null,
      fit: product.fit || null,
      pattern: product.pattern || null,
      material: product.material || null,
      brand: product.brand || 'UNKNOWN',
      gender: product.gender || null,
      confidence: typeof product.confidence === 'number' 
        ? Math.max(0, Math.min(1, product.confidence)) 
        : 0.5
    }))
    
    return parsed
  } catch (error) {
    console.error('JSON parsing error:', error)
    throw new Error(`Invalid JSON response: ${error.message}`)
  }
}

/**
 * Main detection function
 * @param {string} reelUrl - Instagram Reel URL
 * @param {string} [caption] - Reel caption (optional)
 * @param {Array<string>} [hashtags] - Hashtags (optional)
 * @param {string} [imageBase64] - Base64 encoded image (optional)
 * @returns {Promise<ProductDetectionResult>}
 */
export async function detectProductsFromReel(reelUrl, caption = '', hashtags = [], imageBase64 = null) {
  // Validate reel URL
  if (!reelUrl || typeof reelUrl !== 'string') {
    throw new Error('Invalid reel URL provided')
  }
  
  if (!reelUrl.includes('instagram.com') && !reelUrl.includes('reel')) {
    console.warn('URL does not appear to be an Instagram Reel:', reelUrl)
  }
  
  // Get API key
  const apiKey = await getClaudeApiKey()
  if (!apiKey) {
    throw new Error('Claude API key not configured. Please set it in extension settings.')
  }
  
  // Build prompt
  const prompt = buildDetectionPrompt(reelUrl, caption, hashtags, imageBase64)
  
  // Retry logic for JSON parsing
  let lastError = null
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      // Call Claude API
      const rawResponse = await callClaudeAPI(apiKey, prompt, imageBase64)
      
      // Parse and validate
      const result = parseAndValidateJSON(rawResponse, reelUrl)
      
      console.log('✅ Product detection successful:', result)
      return result
    } catch (error) {
      lastError = error
      console.warn(`Attempt ${attempt + 1} failed:`, error.message)
      
      if (attempt === 0) {
        // Retry once
        await new Promise(resolve => setTimeout(resolve, 1000))
        continue
      }
    }
  }
  
  // If all attempts failed, return fallback
  console.error('All detection attempts failed:', lastError)
  return {
    reel_url: reelUrl,
    primary_focus: 'unknown',
    products: [],
    search_queries: [],
    notes: `Detection failed: ${lastError?.message || 'Unknown error'}`
  }
}

/**
 * Extract Instagram Reel data from current page
 * This is a placeholder - actual implementation would need to scrape Instagram
 * @param {string} reelUrl - Instagram Reel URL
 * @returns {Promise<{caption: string, hashtags: string[], imageBase64: string|null}>}
 */
export async function extractReelData(reelUrl) {
  // TODO: Implement Instagram Reel scraping
  // For now, return empty data
  // In production, this would:
  // 1. Navigate to the reel URL (if on Instagram)
  // 2. Extract caption from DOM
  // 3. Extract hashtags from caption or DOM
  // 4. Capture screenshot or extract image
  
  return {
    caption: '',
    hashtags: [],
    imageBase64: null
  }
}



/**
 * Background Service Worker for Seekr Extension
 * 
 * Handles product detection by:
 * 1. Capturing screenshot of Instagram Reel
 * 2. Sending image to Claude for description
 * 3. Sending Claude's description to Lindy for product searching
 */

// Claude API Configuration
// API key will be injected from .env during build
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY || 'CLAUDE_API_KEY_PLACEHOLDER'
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages'
const CLAUDE_MODEL = 'claude-sonnet-4-5'

// Lindy Webhook Configuration
const LINDY_WEBHOOK_URL = 'https://public.lindy.ai/api/v1/webhooks/lindy/7b7d5220-f16b-4ca5-92bd-8f5b01522e36'
const LINDY_WEBHOOK_SECRET = 'abd89b8381f73d0d0451093cb1ceb029b2eec82b27b9aefd4bf0f06583e56b22'

// Listen for messages from popup/content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('📨 Background received:', request.action, 'from tab:', sender.tab?.id)
  
  if (request.action === 'detectProducts') {
    // Pass sender tab info for screenshot permission
    handleProductDetection(request.data, sender.tab)
      .then(result => {
        console.log('✅ Detection result:', result)
        sendResponse({ 
          success: true, 
          data: result,
          payloadInfo: result.payloadInfo || null
        })
      })
      .catch(error => {
        console.error('❌ Detection error:', error)
        sendResponse({ success: false, error: error.message })
      })
    
    return true // Keep channel open for async response
  }
  
  if (request.action === 'sendToLindy') {
    sendTextToLindy(request.data)
      .then(() => sendResponse({ success: true }))
      .catch(error => sendResponse({ success: false, error: error.message }))
    return true
  }
  
  if (request.action === 'captureScreenshot') {
    // activeTab permission is granted when user interacts with extension
    // The sender.tab indicates which tab the user interacted with
    captureScreenshot()
      .then(imageDataUrl => {
        console.log('📸 Screenshot captured, size:', imageDataUrl ? imageDataUrl.length : 0)
        sendResponse({ success: true, imageDataUrl })
      })
      .catch(error => {
        console.error('❌ Screenshot error:', error)
        sendResponse({ success: false, error: error.message })
      })
    return true
  }
  
  // Unknown action
  console.warn('⚠️ Unknown action:', request.action)
  sendResponse({ success: false, error: `Unknown action: ${request.action}` })
  return true
})

/**
 * Capture screenshot of current tab
 * Returns full data URL for Claude API
 * Uses activeTab permission - must be called after user interaction
 */
async function captureScreenshot() {
  return new Promise((resolve, reject) => {
    // Use null for windowId - this captures the current window
    // activeTab permission works with null windowId
    console.log('📸 Attempting to capture screenshot of current window...')
    
    chrome.tabs.captureVisibleTab(null, { 
      format: 'jpeg', 
      quality: 90 
    }, (screenshot) => {
      if (chrome.runtime.lastError) {
        const errorMsg = chrome.runtime.lastError.message
        console.error('❌ Screenshot capture error:', errorMsg)
        
        // If permission error, provide helpful message
        if (errorMsg.includes('permission') || errorMsg.includes('activeTab') || errorMsg.includes('Cannot access') || errorMsg.includes('all_urls')) {
          reject(new Error('Screenshot permission denied. The extension needs permission to capture the tab. Please:\n1. Make sure the Instagram Reel tab is the active/visible tab\n2. Click "Detect Products" button in the overlay\n3. If error persists, reload the extension'))
        } else {
          reject(new Error(errorMsg))
        }
        return
      }
      
      if (screenshot) {
        console.log('✅ Screenshot captured successfully, size:', screenshot.length, 'characters')
        // Return full data URL for Claude API
        resolve(screenshot)
      } else {
        reject(new Error('Failed to capture screenshot - no data returned'))
      }
    })
  })
}

/**
 * Handle product detection request
 * 1. Capture screenshot
 * 2. Send to Claude for description
 * 3. Send description to Lindy for searching
 * @param {Object} data - Detection request data
 * @param {Object} senderTab - Tab that sent the request (for permission)
 * @returns {Promise<ProductDetectionResult>}
 */
async function handleProductDetection(data, senderTab = null) {
  const { reelUrl, imageDataUrl } = data
  
  console.log('🔍 Starting product detection for:', reelUrl)
  
  try {
    // Step 1: Get image - either from content script (video frame) or fallback to screenshot
    let finalImageDataUrl = imageDataUrl
    
    if (!finalImageDataUrl) {
      // Fallback: Try to capture screenshot (requires permission)
      console.log('📸 No video frame, attempting screenshot as fallback...')
      try {
        finalImageDataUrl = await captureScreenshot()
        console.log('✅ Screenshot captured, size:', finalImageDataUrl.length, 'characters')
      } catch (screenshotError) {
        console.warn('⚠️ Screenshot failed:', screenshotError.message)
        throw new Error('Could not capture image. Please make sure the Instagram Reel is visible and playing.')
      }
    } else {
      console.log('✅ Using video frame from content script, size:', finalImageDataUrl.length, 'characters')
    }
    
    if (!finalImageDataUrl) {
      throw new Error('No image available')
    }
    
    // Step 2: Send image to Claude for description
    console.log('🤖 Sending image to Claude for analysis...')
    const claudeDescription = await describeImageWithClaude(finalImageDataUrl)
    
    if (!claudeDescription || !claudeDescription.trim()) {
      throw new Error('Claude did not return a description')
    }
    
    console.log('✅ Claude description received:', claudeDescription.substring(0, 100) + '...')
    
    // Step 3: Send description to Lindy for product searching
    console.log('📤 Sending description to Lindy for product searching...')
    const lindyResponse = await sendDescriptionToLindy(reelUrl, claudeDescription)
    
    return {
      reel_url: reelUrl,
      primary_focus: 'unknown',
      products: [],
      search_queries: [],
      notes: 'Image analyzed by Claude and description sent to Lindy for product searching. Check callback server for results.',
      claudeDescription: claudeDescription,
      payloadInfo: lindyResponse?.payloadInfo || null
    }
  } catch (error) {
    console.error('❌ Error in product detection:', error)
    throw error
  }
}

/**
 * Describe image using Claude API
 * @param {string} imageDataUrl - Full data URL of the image (data:image/jpeg;base64,...)
 * @returns {Promise<string>} - Claude's description of the image
 */
async function describeImageWithClaude(imageDataUrl) {
  console.log('🤖 Sending image to Claude for analysis...')
  
  try {
    // Extract base64 from data URL
    const base64Data = imageDataUrl.split(',')[1]
    
    // Check image size - if too large, log warning
    const imageSizeKB = Math.round(base64Data.length * 0.75 / 1024)
    console.log(`📊 Image size: ${imageSizeKB} KB`)
    if (imageSizeKB > 5000) {
      console.warn(`⚠️ Large image detected: ${imageSizeKB} KB. This may cause timeout.`)
    }
    
    const payload = {
      model: CLAUDE_MODEL,
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/jpeg',
                data: base64Data
              }
            },
            {
              type: 'text',
              text: 'Please analyze this Instagram Reel screenshot and describe all fashion products visible in detail. Identify:\n\n1. Clothing items (tops, bottoms, dresses, jackets, coats, etc.)\n2. Footwear (shoes, sneakers, boots, etc.)\n3. Accessories (bags, jewelry, hats, belts, etc.)\n\nFor each item, describe:\n- Type/category\n- Colors\n- Styles/patterns\n- Materials (if visible)\n- Fit/cut (if visible)\n- Any distinctive features\n\nBe very specific and detailed. Format your response as a clear, structured description that can be used to search for similar products online.'
            }
          ]
        }
      ]
    }
    
    console.log('📤 Sending request to Claude API...')
    console.log('📊 Image size:', base64Data.length, 'base64 characters')
    console.log('🤖 Using model:', CLAUDE_MODEL)
    
    // Create AbortController for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 60000) // 60 second timeout
    
    try {
      const response = await fetch(CLAUDE_API_URL, {
        method: 'POST',
        headers: {
          'x-api-key': CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
    
      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Claude API error:', response.status, errorText)
        throw new Error(`Claude API error: ${response.status} - ${errorText}`)
      }
      
      const result = await response.json()
      console.log('✅ Claude response received')
      
      // Extract text from Claude's response
      const description = result.content?.[0]?.text || ''
      
      if (!description) {
        throw new Error('Claude did not return a text description')
      }
      
      console.log('📝 Description length:', description.length, 'characters')
      return description
    } catch (fetchError) {
      clearTimeout(timeoutId)
      
      if (fetchError.name === 'AbortError') {
        console.error('❌ Claude API request timed out after 60 seconds')
        throw new Error('Claude API request timed out. The image might be too large or the API is slow. Try again or use a smaller image.')
      }
      
      throw fetchError
    }
  } catch (error) {
    console.error('❌ Error describing image with Claude:', error)
    throw error
  }
}

/**
 * Send text description to Lindy for product searching
 * @param {string} reelUrl - Instagram Reel URL
 * @param {string} description - Claude's description of the image
 * @returns {Promise<Object>}
 */
async function sendDescriptionToLindy(reelUrl, description) {
  console.log('📤 Sending description to Lindy for product searching')
  
  if (!description || !description.trim()) {
    throw new Error('No description provided to send to Lindy')
  }
  
  try {
    const payload = {
      callbackUrl: 'https://unspaded-stipitiform-estell.ngrok-free.dev/callback',
      message: `Based on this detailed product description from an Instagram Reel, please search for similar fashion products online:\n\n${description}\n\nPlease find and return links to similar products with prices.`,
      budgetMYR: 200
    }
    
    console.log('📦 Payload structure:', {
      hasCallbackUrl: !!payload.callbackUrl,
      hasMessage: !!payload.message,
      messageLength: payload.message.length,
      budgetMYR: payload.budgetMYR
    })
    console.log('📋 Full payload:', JSON.stringify(payload, null, 2))
    console.log('🔗 Webhook URL:', LINDY_WEBHOOK_URL)
    console.log('🔑 Using webhook secret:', LINDY_WEBHOOK_SECRET ? '✅ Set' : '❌ Missing')
    
    const response = await fetch(LINDY_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LINDY_WEBHOOK_SECRET}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Lindy error:', response.status, errorText)
      throw new Error(`Lindy API error: ${response.status} - ${errorText}`)
    }
    
    const result = await response.json()
    console.log('✅ Successfully sent to Lindy! Response:', result)
    console.log('📊 Response status:', response.status)
    
    // Return payload info for debugging
    return {
      success: true,
      payloadInfo: {
        callbackUrl: payload.callbackUrl,
        messageLength: payload.message.length,
        descriptionLength: description.length,
        budgetMYR: payload.budgetMYR
      },
      response: result
    }
  } catch (error) {
    console.error('❌ Error sending to Lindy:', error)
    throw error
  }
}

/**
 * Send text search query to Lindy
 */
async function sendTextToLindy(data) {
  const { text, budget = '200 MYR' } = data
  
  if (!text || text.trim().length === 0) {
    throw new Error('No text provided to send to Lindy')
  }
  
  console.log('📤 Sending text search to Lindy:', text)
  
  try {
    const payload = {
      text: text.trim(),
      budget: budget
    }
    
    const response = await fetch(LINDY_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LINDY_WEBHOOK_SECRET}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Lindy error:', response.status, errorText)
      throw new Error(`Lindy API error: ${response.status} - ${errorText}`)
    }
    
    const result = await response.json()
    console.log('✅ Sent to Lindy:', result)
    
    return result
  } catch (error) {
    console.error('❌ Error sending to Lindy:', error)
    throw error
  }
}
// Background script for handling API calls
console.log('🔧 AI Chat background script loaded');

// Handle API calls from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('🔧 Background Script: Received message:', request);
  
  if (request.action === 'makeApiCall') {
    console.log('🚀 Background Script: Starting API call');
    console.log('📋 API call data:', request.data);
    
    handleApiCall(request.data)
      .then(response => {
        console.log('✅ Background Script: API call successful');
        console.log('📋 API response:', response);
        sendResponse({ success: true, data: response });
      })
      .catch(error => {
        console.error('❌ Background Script: API call failed:', error);
        sendResponse({ success: false, error: error.message });
      });
    
    // Return true to indicate we'll send a response asynchronously
    return true;
  }
  
  // Handle Uniqlo scraping requests
  if (request.action === 'scrapeUniqlo') {
    console.log('🛍️ Background Script: Scraping Uniqlo:', request.url);
    
    handleUniqloScrape(request.url, request.productId)
      .then(result => {
        console.log('✅ Background Script: Scrape successful');
        sendResponse(result);
      })
      .catch(error => {
        console.error('❌ Background Script: Scrape failed:', error);
        sendResponse({ success: false, error: error.message });
      });
    
    return true;
  }
});

async function handleUniqloScrape(url, productId) {
  try {
    // Create a new tab in the background
    const tab = await chrome.tabs.create({ url: url, active: false });
    
    console.log(`📑 Created tab ${tab.id} for scraping`);
    
    // Wait for page to load
    await new Promise((resolve) => {
      const listener = (tabId, changeInfo) => {
        if (tabId === tab.id && changeInfo.status === 'complete') {
          chrome.tabs.onUpdated.removeListener(listener);
          // Give extra time for JS to execute
          setTimeout(resolve, 3000);
        }
      };
      chrome.tabs.onUpdated.addListener(listener);
    });
    
    console.log('✅ Tab loaded, injecting scraper...');
    
    // Inject and execute scraping script
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        // Scrape color options
        const colorOptions = [];
        const colorPickers = document.querySelectorAll('[name="product-color-picker"]');
        
        colorPickers.forEach((input) => {
          const inputId = input.getAttribute('id');
          const label = document.querySelector(`label[for="${inputId}"]`);
          
          if (label) {
            const colorNameEl = label.querySelector('.fr-implicit');
            const colorName = colorNameEl ? colorNameEl.textContent.trim() : '';
            const colorValue = input.getAttribute('value') || '';
            const styleAttr = label.getAttribute('style') || '';
            
            let iconUrl = '';
            const match = styleAttr.match(/background-image:\s*url\(["\']?(.+?)["\']?\)/);
            if (match) {
              iconUrl = match[1];
            }
            
            colorOptions.push({
              name: colorName,
              value: colorValue,
              iconUrl: iconUrl
            });
          }
        });
        
        // Scrape size options
        const sizeOptions = [];
        const sizePickers = document.querySelectorAll('[name="product-size-picker"]');
        
        sizePickers.forEach((input) => {
          const inputId = input.getAttribute('id');
          const label = document.querySelector(`label[for="${inputId}"]`);
          
          if (label) {
            const sizeTextEl = label.querySelector('.fr-chip-text');
            const sizeText = sizeTextEl ? sizeTextEl.textContent.trim() : '';
            const sizeValue = input.getAttribute('value') || '';
            
            const hasStrikethrough = label.querySelector('.chip-strikethrough-icon') !== null;
            const isAvailable = !hasStrikethrough;
            
            sizeOptions.push({
              name: sizeText,
              value: sizeValue,
              available: isAvailable
            });
          }
        });
        
        return { colors: colorOptions, sizes: sizeOptions };
      }
    });
    
    // Close the tab
    await chrome.tabs.remove(tab.id);
    console.log(`🗑️ Closed tab ${tab.id}`);
    
    const scraped = results[0].result;
    
    return {
      success: true,
      productId: productId,
      url: url,
      colors: scraped.colors,
      sizes: scraped.sizes
    };
  } catch (error) {
    console.error('❌ Scrape error:', error);
    throw error;
  }
}

async function handleApiCall({ provider, apiKey, baseURL, model, messages, stream = false, structuredOutputSchema = null }) {
  console.log(`🎯 Background Script: Making ${provider} API call`);
  console.log('📋 Call parameters:', { provider, baseURL, model, messagesCount: messages.length, hasStructuredOutput: !!structuredOutputSchema });
  
  try {
    if (provider === 'anthropic') {
      console.log('🤖 Background Script: Calling Anthropic API');
      const result = await makeAnthropicCall({ apiKey, baseURL, model, messages, stream, structuredOutputSchema });
      console.log('✅ Background Script: Anthropic call successful, result:', result);
      return result;
    } else {
      console.log('🤖 Background Script: Calling OpenAI API');
      const result = await makeOpenAICall({ apiKey, baseURL, model, messages, stream, structuredOutputSchema });
      console.log('✅ Background Script: OpenAI call successful, result:', result);
      return result;
    }
  } catch (error) {
    console.error('❌ Background API call error:', error);
    throw error;
  }
}

async function makeAnthropicCall({ apiKey, baseURL, model, messages, stream, structuredOutputSchema = null }) {
  // Convert OpenAI format to Anthropic format
  const systemMessage = messages.find(msg => msg.role === 'system');
  const conversationMessages = messages.filter(msg => msg.role !== 'system');
  
  const requestBody = {
    model: model,
    max_tokens: 2000,
    temperature: 0.7,
    messages: conversationMessages,
    stream: false // Disable streaming for now to avoid SSE parsing issues
  };

  if (systemMessage) {
    requestBody.system = systemMessage.content;
  }

  // Add structured output configuration if provided
  // For Anthropic, we can use their tool calling feature or prompt engineering
  // Here we'll add it as a JSON schema instruction in the system prompt
  if (structuredOutputSchema && structuredOutputSchema.schema) {
    const schemaInstruction = `\n\nIMPORTANT: You must respond with a JSON object that matches this exact schema:\n${JSON.stringify(structuredOutputSchema.schema, null, 2)}\n\nYour response should be valid JSON only, without any additional text or markdown formatting.`;
    
    if (requestBody.system) {
      requestBody.system += schemaInstruction;
    } else {
      requestBody.system = schemaInstruction;
    }
  }

  const response = await fetch(`${baseURL}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
  }

  // Always handle as non-streaming response
  console.log('📨 Background Script: Parsing Anthropic response');
  const data = await response.json();
  console.log('📋 Background Script: Anthropic response data:', data);
  
  const result = data.content[0]?.text || 'No response received';
  console.log('📝 Background Script: Extracted text:', result);
  return result;
}

async function makeOpenAICall({ apiKey, baseURL, model, messages, stream, structuredOutputSchema = null }) {
  const requestBody = {
    model: model,
    messages: messages,
    stream: false, // Disable streaming for OpenAI too
    temperature: 0.7,
    max_tokens: 2000,
  };

  // Add structured output configuration for OpenAI (if schema provided)
  if (structuredOutputSchema && structuredOutputSchema.schema) {
    requestBody.response_format = {
      type: 'json_object'
    };
    
    // Add schema instructions to the last user message or system message
    const schemaInstruction = `\n\nYou must respond with a JSON object that matches this schema:\n${JSON.stringify(structuredOutputSchema.schema, null, 2)}`;
    
    // Find system message and append or create one
    const systemMsgIndex = messages.findIndex(msg => msg.role === 'system');
    if (systemMsgIndex !== -1) {
      requestBody.messages = [...messages];
      requestBody.messages[systemMsgIndex] = {
        ...requestBody.messages[systemMsgIndex],
        content: requestBody.messages[systemMsgIndex].content + schemaInstruction
      };
    } else {
      requestBody.messages = [
        { role: 'system', content: schemaInstruction },
        ...messages
      ];
    }
  }

  const response = await fetch(`${baseURL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
  }

  // Always handle as non-streaming response
  const data = await response.json();
  return data.choices[0]?.message?.content || 'No response received';
}

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

async function handleApiCall({ provider, apiKey, baseURL, model, messages, stream = false }) {
  console.log(`🎯 Background Script: Making ${provider} API call`);
  console.log('📋 Call parameters:', { provider, baseURL, model, messagesCount: messages.length });
  
  try {
    if (provider === 'anthropic') {
      console.log('🤖 Background Script: Calling Anthropic API');
      const result = await makeAnthropicCall({ apiKey, baseURL, model, messages, stream });
      console.log('✅ Background Script: Anthropic call successful, result:', result);
      return result;
    } else {
      console.log('🤖 Background Script: Calling OpenAI API');
      const result = await makeOpenAICall({ apiKey, baseURL, model, messages, stream });
      console.log('✅ Background Script: OpenAI call successful, result:', result);
      return result;
    }
  } catch (error) {
    console.error('❌ Background API call error:', error);
    throw error;
  }
}

async function makeAnthropicCall({ apiKey, baseURL, model, messages, stream }) {
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

async function makeOpenAICall({ apiKey, baseURL, model, messages, stream }) {
  const response = await fetch(`${baseURL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model,
      messages: messages,
      stream: false, // Disable streaming for OpenAI too
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
  }

  // Always handle as non-streaming response
  const data = await response.json();
  return data.choices[0]?.message?.content || 'No response received';
}

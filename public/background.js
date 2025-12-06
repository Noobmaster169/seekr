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
});

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

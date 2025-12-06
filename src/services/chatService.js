// AI Chat Service for handling LLM interactions
class ChatService {
  constructor() {
    this.apiKey = null;
    this.provider = 'anthropic'; // Default provider
    this.model = 'claude-sonnet-4-5';
    this.baseURL = 'https://api.anthropic.com/v1';
    this.systemPrompt = null; // Default system prompt
    this.structuredOutputSchema = null; // Structured output configuration
  }

  // Set API configuration
  setConfig(config) {
    this.apiKey = config.apiKey;
    this.provider = config.provider || 'anthropic';
    this.model = config.model || 'claude-sonnet-4-5';
    this.baseURL = config.baseURL || 'https://api.anthropic.com/v1';
    this.systemPrompt = config.systemPrompt || null;
    this.structuredOutputSchema = config.structuredOutputSchema || null;
  }

  // Send message to LLM and get response
  async sendMessage(messages, onStream = null, options = {}) {
    if (!this.apiKey) {
      throw new Error('API key not configured. Please set your API key in settings.');
    }

    // Inject system prompt if configured and not already present
    let processedMessages = [...messages];
    const hasSystemMessage = messages.some(msg => msg.role === 'system');
    
    if (this.systemPrompt && !hasSystemMessage && !options.skipSystemPrompt) {
      processedMessages = [
        { role: 'system', content: this.systemPrompt },
        ...messages
      ];
    }

    try {
      // Use background script for API calls to avoid CORS issues
      return await this.sendMessageViaBackground(processedMessages, onStream, options);
    } catch (error) {
      console.error('Chat service error:', error);
      throw error;
    }
  }

  // Send message via background script through content script bridge
  async sendMessageViaBackground(messages, onStream = null, options = {}) {
    console.log('🚀 ChatService: Starting sendMessageViaBackground');
    console.log('📝 Messages:', messages);
    console.log('🔧 Provider:', this.provider);
    console.log('🤖 Model:', this.model);
    
    return new Promise((resolve, reject) => {
      const requestId = Date.now() + Math.random();
      console.log('🆔 Request ID:', requestId);
      
      const payload = {
        provider: this.provider,
        apiKey: this.apiKey,
        baseURL: this.baseURL,
        model: this.model,
        messages: messages,
        stream: !!onStream,
        structuredOutputSchema: this.structuredOutputSchema
      };
      
      console.log('📦 Payload:', payload);

      // Listen for response
      const handleResponse = (event) => {
        console.log('📨 Received message event:', event.data);
        
        if (event.data.type === 'API_CALL_RESPONSE' && event.data.requestId === requestId) {
          console.log('✅ Found matching response for request:', requestId);
          console.log('📋 Response data:', event.data.response);
          
          window.removeEventListener('message', handleResponse);
          
          if (event.data.response.success) {
            console.log('🎉 Success! Response data:', event.data.response.data);
            resolve(event.data.response.data);
          } else {
            console.error('❌ API call failed:', event.data.response.error);
            reject(new Error(event.data.response.error));
          }
        }
      };

      window.addEventListener('message', handleResponse);

      // Send request to content script
      console.log('📤 Sending API request to content script');
      window.postMessage({
        type: 'API_CALL_REQUEST',
        requestId: requestId,
        payload: payload
      }, '*');

      // Timeout after 30 seconds
      setTimeout(() => {
        console.log('⏰ API call timeout for request:', requestId);
        window.removeEventListener('message', handleResponse);
        reject(new Error('API call timeout'));
      }, 30000);
    });
  }

  // Send message to OpenAI
  async sendOpenAIMessage(messages, onStream = null) {
    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: messages,
        stream: !!onStream,
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    if (onStream) {
      return this.handleStreamResponse(response, onStream);
    } else {
      const data = await response.json();
      console.log("OpenAI Response:", data);
      return data.choices[0]?.message?.content || 'No response received';
    }
  }

  // Send message to Anthropic
  async sendAnthropicMessage(messages, onStream = null) {
    // Convert OpenAI format to Anthropic format
    const systemMessage = messages.find(msg => msg.role === 'system');
    const conversationMessages = messages.filter(msg => msg.role !== 'system');
    
    const requestBody = {
      model: this.model,
      max_tokens: 2000,
      temperature: 0.7,
      messages: conversationMessages,
      stream: !!onStream
    };

    if (systemMessage) {
      requestBody.system = systemMessage.content;
    }

    const response = await fetch(`${this.baseURL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    if (onStream) {
      return this.handleAnthropicStreamResponse(response, onStream);
    } else {
      const data = await response.json();
      console.log("Anthropic Response:", data);
      return data.content[0]?.text || 'No response received';
    }
  }

  // Handle OpenAI streaming response
  async handleStreamResponse(response, onStream) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullResponse = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') return fullResponse;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content;
              if (content) {
                fullResponse += content;
                onStream(content);
              }
            } catch (e) {
              // Ignore parsing errors for incomplete chunks
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    return fullResponse;
  }

  // Handle Anthropic streaming response
  async handleAnthropicStreamResponse(response, onStream) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullResponse = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') return fullResponse;

            try {
              const parsed = JSON.parse(data);
              if (parsed.type === 'content_block_delta') {
                const content = parsed.delta?.text;
                if (content) {
                  fullResponse += content;
                  onStream(content);
                }
              }
            } catch (e) {
              // Ignore parsing errors for incomplete chunks
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    return fullResponse;
  }

  // Test API connection
  async testConnection() {
    try {
      const testMessages = [
        { role: 'user', content: 'Hello! Please respond with just "Connection successful"' }
      ];
      const response = await this.sendMessage(testMessages);
      return { success: true, message: 'Connection successful' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // Get available models
  async getAvailableModels() {
    if (!this.apiKey) {
      throw new Error('API key not configured');
    }

    try {
      if (this.provider === 'anthropic') {
        // Return static list for Anthropic (they don't have a models endpoint)
        return [
          'claude-sonnet-4-5'
        ];
      } else {
        // OpenAI models endpoint
        const response = await fetch(`${this.baseURL}/models`, {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch models: ${response.statusText}`);
        }

        const data = await response.json();
        return data.data
          .filter(model => model.id.includes('gpt'))
          .map(model => model.id)
          .sort();
      }
    } catch (error) {
      console.error('Error fetching models:', error);
      // Return default models based on provider
      if (this.provider === 'anthropic') {
        return [
          'claude-sonnet-4-5'
        ];
      } else {
        return ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo-preview'];
      }
    }
  }
}

// Create singleton instance
const chatService = new ChatService();

export default chatService;

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Trash2, Download, RefreshCw } from 'lucide-react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import chatService from '../services/chatService';

const ChatInterface = ({ isConfigured }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const messagesEndRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Load saved messages
  useEffect(() => {
    const savedMessages = localStorage.getItem('chat-messages');
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (error) {
        console.error('Error loading saved messages:', error);
      }
    }
  }, []);

  // Save messages whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chat-messages', JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingMessage]);

  const handleSendMessage = async (content) => {
    if (!isConfigured) {
      return;
    }

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setStreamingMessage('');

    // Create abort controller for this request
    abortControllerRef.current = new AbortController();

    try {
      // Prepare conversation history
      const conversationMessages = [...messages, userMessage].map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      let assistantResponse = '';
      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: '',
        timestamp: new Date().toISOString()
      };

      // Add placeholder for assistant message
      setMessages(prev => [...prev, assistantMessage]);

      // Get the response (non-streaming for now)
      console.log('🎯 ChatInterface: Calling chatService.sendMessage');
      const response = await chatService.sendMessage(conversationMessages);
      console.log('📨 ChatInterface: Received response:', response);
      
      // Update the assistant message with the complete response
      assistantResponse = response;
      setMessages(prev => 
        prev.map(msg => 
          msg.id === assistantMessage.id 
            ? { ...msg, content: assistantResponse }
            : msg
        )
      );
      
      console.log('✅ ChatInterface: Updated messages with response');

    } catch (error) {
      console.error('Chat error:', error);
      
      // Remove the placeholder assistant message and add error message
      setMessages(prev => prev.filter(msg => msg.role !== 'assistant' || msg.content));
      
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: `❌ **Error**: ${error.message}\n\nPlease check your API configuration and try again.`,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setStreamingMessage('');
      abortControllerRef.current = null;
    }
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
      setStreamingMessage('');
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem('chat-messages');
  };

  const exportChat = () => {
    const chatData = {
      messages,
      exportDate: new Date().toISOString(),
      totalMessages: messages.length
    };
    
    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const refreshChat = () => {
    // Add a system message about page context
    const pageInfo = {
      url: window.location.href,
      title: document.title,
      domain: window.location.hostname
    };

    const contextMessage = {
      id: Date.now(),
      role: 'assistant',
      content: `🔄 **Chat Refreshed**\n\nI can now help you with the current page:\n\n**Page**: ${pageInfo.title}\n**URL**: ${pageInfo.url}\n**Domain**: ${pageInfo.domain}\n\nFeel free to ask me anything about this page or any other topic!`,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, contextMessage]);
  };

  if (!isConfigured) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center h-64 text-center p-6"
      >
        <MessageSquare className="w-12 h-12 text-white/40 mb-4" />
        <h3 className="text-white/90 font-medium mb-2">AI Chat Not Configured</h3>
        <p className="text-white/60 text-sm mb-4">
          Please configure your API key in the Settings tab to start chatting with AI.
        </p>
        <div className="bg-white/5 rounded-lg p-3 border border-white/20">
          <p className="text-white/70 text-xs">
            💡 You'll need an API key from OpenAI or another supported provider
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-purple-400" />
          <span className="text-white font-medium">AI Chat</span>
          <span className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded-full">
            {messages.length} messages
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <motion.button
            onClick={refreshChat}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Refresh with page context"
          >
            <RefreshCw className="w-4 h-4 text-white/60" />
          </motion.button>
          
          {messages.length > 0 && (
            <>
              <motion.button
                onClick={exportChat}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Export chat"
              >
                <Download className="w-4 h-4 text-white/60" />
              </motion.button>
              
              <motion.button
                onClick={clearChat}
                className="p-2 rounded-lg hover:bg-red-500/20 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Clear chat"
              >
                <Trash2 className="w-4 h-4 text-red-400" />
              </motion.button>
            </>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        <AnimatePresence>
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full text-center py-8"
            >
              <MessageSquare className="w-16 h-16 text-white/20 mb-4" />
              <h3 className="text-white/90 font-medium mb-2">Start a Conversation</h3>
              <p className="text-white/60 text-sm mb-6 max-w-xs">
                Ask me anything! I can help you understand content, answer questions, or just have a chat.
              </p>
              <div className="grid grid-cols-1 gap-2 w-full max-w-sm">
                {[
                  "What's on this page?",
                  "Explain this topic",
                  "Help me understand",
                  "Ask me anything"
                ].map((suggestion, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleSendMessage(suggestion)}
                    className="p-3 bg-white/5 border border-white/20 rounded-lg text-white/80 hover:bg-white/10 transition-all text-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {suggestion}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                isTyping={isLoading && message.role === 'assistant' && !message.content}
              />
            ))
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <ChatInput
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        onStop={handleStopGeneration}
        disabled={!isConfigured}
      />
    </div>
  );
};

export default ChatInterface;

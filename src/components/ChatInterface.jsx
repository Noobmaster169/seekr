import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Clock } from 'lucide-react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import chatService from '../services/chatService';

const ChatInterface = forwardRef(({ isConfigured }, ref) => {
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Load conversations on mount
  useEffect(() => {
    const savedConversations = localStorage.getItem('chat-conversations');
    if (savedConversations) {
      try {
        const parsed = JSON.parse(savedConversations);
        setConversations(parsed);
        // Load the most recent conversation
        if (parsed.length > 0) {
          const mostRecent = parsed[0];
          setCurrentConversationId(mostRecent.id);
          setMessages(mostRecent.messages);
        } else {
          createNewConversation();
        }
      } catch (error) {
        console.error('Error loading conversations:', error);
        createNewConversation();
      }
    } else {
      createNewConversation();
    }
  }, []);

  // Save current conversation whenever messages change
  useEffect(() => {
    if (currentConversationId && messages.length > 0) {
      updateCurrentConversation();
    }
  }, [messages]);

  const createNewConversation = () => {
    const newConv = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setConversations(prev => [newConv, ...prev]);
    setCurrentConversationId(newConv.id);
    setMessages([]);
    saveConversations([newConv, ...conversations]);
  };

  const loadConversation = (convId) => {
    const conv = conversations.find(c => c.id === convId);
    if (conv) {
      setCurrentConversationId(conv.id);
      setMessages(conv.messages);
      setShowHistory(false);
    }
  };

  const updateCurrentConversation = () => {
    const updatedConvs = conversations.map(conv => {
      if (conv.id === currentConversationId) {
        // Generate title from first user message
        let title = conv.title;
        if (conv.title === 'New Chat' && messages.length > 0) {
          const firstUserMsg = messages.find(m => m.role === 'user');
          if (firstUserMsg) {
            title = firstUserMsg.content.slice(0, 30) + (firstUserMsg.content.length > 30 ? '...' : '');
          }
        }
        return {
          ...conv,
          title,
          messages,
          updatedAt: new Date().toISOString()
        };
      }
      return conv;
    });
    setConversations(updatedConvs);
    saveConversations(updatedConvs);
  };

  const saveConversations = (convs) => {
    localStorage.setItem('chat-conversations', JSON.stringify(convs));
  };

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

  const formatRelativeTime = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const toggleHistory = () => {
    setShowHistory(prev => !prev);
  };

  const showProductDemo = () => {
    // Demo products data
    const demoProducts = [
      {
        id: 1,
        title: 'Premium Wireless Headphones',
        price: 299.99,
        description: 'High-quality audio with active noise cancellation',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
        colors: [
          { name: 'Midnight Black', hex: '#1a1a1a' },
          { name: 'Silver', hex: '#C0C0C0' },
          { name: 'Rose Gold', hex: '#B76E79' },
        ],
      },
      {
        id: 2,
        title: 'Smart Fitness Watch',
        price: 449.99,
        description: 'Track your health and fitness goals',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
        colors: [
          { name: 'Space Gray', hex: '#52575C' },
          { name: 'Gold', hex: '#FFD700' },
          { name: 'White', hex: '#FFFFFF' },
        ],
      },
      {
        id: 3,
        title: 'Designer Sneakers',
        price: 189.99,
        description: 'Comfortable and stylish',
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
        colors: [
          { name: 'White', hex: '#FFFFFF' },
          { name: 'Black', hex: '#000000' },
          { name: 'Navy Blue', hex: '#001f3f' },
        ],
      },
    ];

    const handleProductSelect = (product) => {
      console.log('Product selected:', product);
      // Add a confirmation message
      const confirmMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: `✅ Great choice! You selected **${product.title}** ($${product.price}).\n\nWould you like to proceed with customizing your order?`,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, confirmMessage]);
    };

    const productMessage = {
      id: Date.now(),
      role: 'assistant',
      content: `🛍️ **Product Recommendations**\n\nBased on your browsing, here are some products you might like. Browse through and select one to continue:`,
      timestamp: new Date().toISOString(),
      component: {
        type: 'product-carousel',
        data: {
          products: demoProducts,
          onSelectProduct: handleProductSelect
        }
      }
    };

    setMessages(prev => [...prev, productMessage]);
  };

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    createNewConversation,
    showProductDemo,
    toggleHistory
  }));

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
    <div className="flex h-full">
      {/* History Sidebar */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 200, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-r border-white/10 overflow-hidden"
          >
            <div className="h-full flex flex-col">
              <div className="p-3 border-b border-white/10">
                <h3 className="text-white font-semibold text-sm">History</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {conversations.map((conv) => (
                  <motion.button
                    key={conv.id}
                    onClick={() => loadConversation(conv.id)}
                    className={`w-full text-left p-2 rounded-lg transition-colors ${
                      conv.id === currentConversationId
                        ? 'bg-white/20 text-white'
                        : 'text-white/70 hover:bg-white/10'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-xs font-medium truncate">{conv.title}</div>
                    <div className="text-xs text-white/40 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {formatRelativeTime(conv.updatedAt)}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">

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
    </div>
  );
});

export default ChatInterface;

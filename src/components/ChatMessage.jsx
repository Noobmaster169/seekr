import React from 'react';
import { motion } from 'framer-motion';
import { User, Bot, Copy, Check } from 'lucide-react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

const ChatMessage = ({ message, isTyping = false, onCopy }) => {
  const [copied, setCopied] = React.useState(false);
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onCopy?.();
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const renderContent = () => {
    if (isUser) {
      return <div className="whitespace-pre-wrap">{message.content}</div>;
    }

    // For assistant messages, render markdown
    try {
      const html = marked(message.content, {
        breaks: true,
        gfm: true,
      });
      const sanitizedHtml = DOMPurify.sanitize(html);
      
      return (
        <div 
          className="prose prose-invert prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
          style={{
            '--tw-prose-body': 'rgb(255 255 255 / 0.9)',
            '--tw-prose-headings': 'rgb(255 255 255)',
            '--tw-prose-links': 'rgb(168 85 247)',
            '--tw-prose-code': 'rgb(196 181 253)',
            '--tw-prose-pre-bg': 'rgb(0 0 0 / 0.3)',
            '--tw-prose-pre-code': 'rgb(255 255 255 / 0.9)',
          }}
        />
      );
    } catch (error) {
      console.error('Error rendering markdown:', error);
      return <div className="whitespace-pre-wrap">{message.content}</div>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 p-3 rounded-lg ${
        isUser 
          ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-400/30 ml-8' 
          : 'bg-white/5 border border-white/10 mr-8'
      }`}
    >
      {/* Avatar */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isUser 
          ? 'bg-gradient-to-r from-purple-500 to-blue-500' 
          : 'bg-gradient-to-r from-emerald-500 to-teal-500'
      }`}>
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-white/60">
            {isUser ? 'You' : 'AI Assistant'}
          </span>
          {!isUser && message.content && (
            <motion.button
              onClick={handleCopy}
              className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/10 transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {copied ? (
                <Check className="w-3 h-3 text-green-400" />
              ) : (
                <Copy className="w-3 h-3 text-white/60" />
              )}
            </motion.button>
          )}
        </div>
        
        <div className="text-white/90 text-sm leading-relaxed group">
          {isTyping ? (
            <div className="flex items-center gap-1">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-white/60 text-xs ml-2">AI is thinking...</span>
            </div>
          ) : (
            renderContent()
          )}
        </div>
        
        {message.timestamp && (
          <div className="text-xs text-white/40 mt-2">
            {new Date(message.timestamp).toLocaleTimeString()}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ChatMessage;

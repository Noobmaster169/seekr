import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, Square } from 'lucide-react';

const ChatInput = ({ onSendMessage, isLoading, onStop, disabled = false }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  }, [message]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading && !disabled) {
      // TODO: ADD CUSTOMIZED PROMPT HANDLING HERE
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleStop = () => {
    onStop?.();
  };

  return (
    <div className="border-t border-white/10 p-4">
      <form onSubmit={handleSubmit} className="flex gap-3 items-end">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={disabled ? "Configure API key in settings to start chatting..." : "Type your message..."}
            disabled={disabled || isLoading}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all min-h-[48px] max-h-[120px]"
            rows={1}
          />
          
          {/* Character count */}
          {message.length > 0 && (
            <div className="absolute bottom-1 right-2 text-xs text-white/40">
              {message.length}
            </div>
          )}
        </div>

        {/* Send/Stop button */}
        <motion.button
          type={isLoading ? "button" : "submit"}
          onClick={isLoading ? handleStop : undefined}
          disabled={disabled || (!message.trim() && !isLoading)}
          className={`p-3 rounded-lg transition-all flex items-center justify-center min-w-[48px] ${
            disabled || (!message.trim() && !isLoading)
              ? 'bg-white/5 text-white/30 cursor-not-allowed'
              : isLoading
              ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30'
              : 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white hover:from-purple-500/30 hover:to-blue-500/30 border border-purple-400/30'
          }`}
          whileHover={!disabled && (message.trim() || isLoading) ? { scale: 1.05 } : {}}
          whileTap={!disabled && (message.trim() || isLoading) ? { scale: 0.95 } : {}}
        >
          {isLoading ? (
            <>
              <Square className="w-4 h-4" />
            </>
          ) : (
            <Send className="w-4 h-4" />
          )}
        </motion.button>
      </form>

      {/* Quick actions */}
      {/*<div className="flex gap-2 mt-3">
        {[
          "Explain this page",
          "Summarize content",
          "Help me understand",
          "Ask a question"
        ].map((suggestion, index) => (
          <motion.button
            key={index}
            onClick={() => !disabled && !isLoading && setMessage(suggestion)}
            disabled={disabled || isLoading}
            className="px-3 py-1.5 text-xs bg-white/5 border border-white/20 rounded-full text-white/70 hover:bg-white/10 hover:text-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={!disabled && !isLoading ? { scale: 1.05 } : {}}
            whileTap={!disabled && !isLoading ? { scale: 0.95 } : {}}
          >
            {suggestion}
          </motion.button>
        ))}
      </div>*/}
    </div>
  );
};

export default ChatInput;

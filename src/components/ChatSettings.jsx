import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Check, X, AlertCircle, Loader2, MessageSquare, Code } from 'lucide-react';
import chatService from '../services/chatService';
import { DEFAULT_PROMPTS, STRUCTURED_OUTPUT_SCHEMAS } from '../config/defaultPrompts';

const ChatSettings = ({ onConfigChange }) => {
  const [config, setConfig] = useState({
    apiKey: '',
    provider: 'anthropic',
    model: 'claude-sonnet-4-5',
    baseURL: 'https://api.anthropic.com/v1',
    systemPrompt: DEFAULT_PROMPTS.productAssistant.prompt,
    selectedPromptKey: 'productAssistant',
    structuredOutputSchema: null,
    selectedSchemaKey: 'none'
  });
  const [showApiKey, setShowApiKey] = useState(false);
  const [testStatus, setTestStatus] = useState(null);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [availableModels, setAvailableModels] = useState([]);

  // Load saved configuration
  useEffect(() => {
    const savedConfig = localStorage.getItem('chat-config');
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        
        // Migration: If saved config doesn't have provider or has old default, update it
        if (!parsed.provider || parsed.provider === 'openai') {
          console.log('🔄 Migrating to Anthropic as default provider');
          const migratedConfig = {
            ...parsed,
            provider: 'anthropic',
            model: 'claude-sonnet-4-5',
            baseURL: 'https://api.anthropic.com/v1',
            systemPrompt: parsed.systemPrompt || DEFAULT_PROMPTS.productAssistant.prompt,
            selectedPromptKey: parsed.selectedPromptKey || 'productAssistant',
            structuredOutputSchema: parsed.structuredOutputSchema || null,
            selectedSchemaKey: parsed.selectedSchemaKey || 'none'
          };
          setConfig(migratedConfig);
          localStorage.setItem('chat-config', JSON.stringify(migratedConfig));
          chatService.setConfig(migratedConfig);
          onConfigChange?.(migratedConfig);
        } else {
          // Add missing fields to existing config
          const updatedConfig = {
            ...parsed,
            systemPrompt: parsed.systemPrompt || DEFAULT_PROMPTS.productAssistant.prompt,
            selectedPromptKey: parsed.selectedPromptKey || 'productAssistant',
            structuredOutputSchema: parsed.structuredOutputSchema || null,
            selectedSchemaKey: parsed.selectedSchemaKey || 'none'
          };
          setConfig(updatedConfig);
          chatService.setConfig(updatedConfig);
          onConfigChange?.(updatedConfig);
        }
      } catch (error) {
        console.error('Error loading saved config:', error);
      }
    }
  }, [onConfigChange]);

  // Save configuration
  const saveConfig = (newConfig) => {
    setConfig(newConfig);
    localStorage.setItem('chat-config', JSON.stringify(newConfig));
    chatService.setConfig(newConfig);
    onConfigChange?.(newConfig);
  };

  const handleInputChange = (field, value) => {
    const newConfig = { ...config, [field]: value };
    saveConfig(newConfig);
  };

  const handlePromptChange = (promptKey) => {
    const selectedPrompt = DEFAULT_PROMPTS[promptKey];
    const newConfig = {
      ...config,
      selectedPromptKey: promptKey,
      systemPrompt: selectedPrompt ? selectedPrompt.prompt : ''
    };
    saveConfig(newConfig);
  };

  const handleCustomPromptChange = (value) => {
    const newConfig = {
      ...config,
      systemPrompt: value,
      selectedPromptKey: 'customizable'
    };
    saveConfig(newConfig);
  };

  const handleSchemaChange = (schemaKey) => {
    const selectedSchema = STRUCTURED_OUTPUT_SCHEMAS[schemaKey];
    const newConfig = {
      ...config,
      selectedSchemaKey: schemaKey,
      structuredOutputSchema: selectedSchema && selectedSchema.schema ? selectedSchema : null
    };
    saveConfig(newConfig);
  };

  const testConnection = async () => {
    if (!config.apiKey.trim()) {
      setTestStatus({ success: false, message: 'Please enter an API key' });
      return;
    }

    setIsTestingConnection(true);
    setTestStatus(null);

    try {
      const result = await chatService.testConnection();
      setTestStatus(result);
      
      if (result.success) {
        // Fetch available models
        try {
          const models = await chatService.getAvailableModels();
          setAvailableModels(models);
        } catch (error) {
          console.error('Error fetching models:', error);
        }
      }
    } catch (error) {
      setTestStatus({ success: false, message: error.message });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const providers = [
    { id: 'anthropic', name: 'Anthropic', baseURL: 'https://api.anthropic.com/v1' },
    //{ id: 'openai', name: 'OpenAI', baseURL: 'https://api.openai.com/v1' },
    //{ id: 'custom', name: 'Custom API', baseURL: '' }
  ];

  const defaultModels = {
    anthropic: [
      'claude-sonnet-4-5'
    ],
    //openai: ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo-preview'],
    //custom: ['custom-model']
  };

  const currentModels = availableModels.length > 0 ? availableModels : defaultModels[config.provider] || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-white font-bold text-lg mb-4">AI Chat Settings</h3>
        
        {/* Provider Selection */}
        <div className="space-y-3">
          <label className="block text-white/90 text-sm font-medium">
            AI Provider
          </label>
          <select
            value={config.provider}
            onChange={(e) => {
              const provider = e.target.value;
              const providerConfig = providers.find(p => p.id === provider);
              handleInputChange('provider', provider);
              if (providerConfig?.baseURL) {
                handleInputChange('baseURL', providerConfig.baseURL);
              }
            }}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          >
            {providers.map(provider => (
              <option key={provider.id} value={provider.id} className="bg-gray-800">
                {provider.name}
              </option>
            ))}
          </select>
        </div>

        {/* API Key */}
        <div className="space-y-3">
          <label className="block text-white/90 text-sm font-medium">
            API Key
          </label>
          <div className="relative">
            <input
              type={showApiKey ? 'text' : 'password'}
              value={config.apiKey}
              onChange={(e) => handleInputChange('apiKey', e.target.value)}
              placeholder="Enter your API key..."
              className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 pr-10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80"
            >
              {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Base URL (for custom providers) */}
        {config.provider === 'custom' && (
          <div className="space-y-3">
            <label className="block text-white/90 text-sm font-medium">
              Base URL
            </label>
            <input
              type="text"
              value={config.baseURL}
              onChange={(e) => handleInputChange('baseURL', e.target.value)}
              placeholder="https://api.example.com/v1"
              className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>
        )}

        {/* Model Selection */}
        <div className="space-y-3">
          <label className="block text-white/90 text-sm font-medium">
            Model
          </label>
          <select
            value={config.model}
            onChange={(e) => handleInputChange('model', e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          >
            {currentModels.map(model => (
              <option key={model} value={model} className="bg-gray-800">
                {model}
              </option>
            ))}
          </select>
        </div>

        {/* System Prompt Configuration */}
        <div className="space-y-3 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-purple-400" />
            <label className="block text-white/90 text-sm font-medium">
              System Prompt
            </label>
          </div>
          <select
            value={config.selectedPromptKey}
            onChange={(e) => handlePromptChange(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          >
            {Object.entries(DEFAULT_PROMPTS).map(([key, prompt]) => (
              <option key={key} value={key} className="bg-gray-800">
                {prompt.name}
              </option>
            ))}
          </select>
          
          {/* Custom Prompt Text Area */}
          <div className="space-y-2">
            <label className="block text-white/70 text-xs">
              {config.selectedPromptKey === 'customizable' ? 'Custom Prompt:' : 'Preview:'}
            </label>
            <textarea
              value={config.systemPrompt}
              onChange={(e) => handleCustomPromptChange(e.target.value)}
              placeholder="Enter your custom system prompt..."
              className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm min-h-[120px] resize-y"
              disabled={config.selectedPromptKey !== 'customizable'}
            />
          </div>
        </div>

        {/* Structured Output Configuration */}
        <div className="space-y-3 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-blue-400" />
            <label className="block text-white/90 text-sm font-medium">
              Structured Output
            </label>
          </div>
          <select
            value={config.selectedSchemaKey}
            onChange={(e) => handleSchemaChange(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          >
            {Object.entries(STRUCTURED_OUTPUT_SCHEMAS).map(([key, schema]) => (
              <option key={key} value={key} className="bg-gray-800">
                {schema.name}
              </option>
            ))}
          </select>
          
          {config.selectedSchemaKey !== 'none' && (
            <div className="bg-white/5 rounded-lg p-3 border border-white/20">
              <p className="text-white/70 text-xs mb-2">
                {STRUCTURED_OUTPUT_SCHEMAS[config.selectedSchemaKey]?.description}
              </p>
              {config.structuredOutputSchema?.schema && (
                <details className="text-white/60 text-xs">
                  <summary className="cursor-pointer hover:text-white/80">View Schema</summary>
                  <pre className="mt-2 overflow-x-auto">
                    {JSON.stringify(config.structuredOutputSchema.schema, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          )}
        </div>

        {/* Test Connection */}
        <div className="space-y-3">
          <motion.button
            onClick={testConnection}
            disabled={isTestingConnection || !config.apiKey.trim()}
            className="w-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-400/30 rounded-lg px-4 py-2 text-white font-medium hover:from-purple-500/30 hover:to-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            whileHover={!isTestingConnection && config.apiKey.trim() ? { scale: 1.02 } : {}}
            whileTap={!isTestingConnection && config.apiKey.trim() ? { scale: 0.98 } : {}}
          >
            {isTestingConnection ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Testing Connection...
              </>
            ) : (
              'Test Connection'
            )}
          </motion.button>

          {/* Test Status */}
          {testStatus && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-center gap-2 p-3 rounded-lg border ${
                testStatus.success
                  ? 'bg-green-500/10 border-green-500/30 text-green-400'
                  : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}
            >
              {testStatus.success ? (
                <Check className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              <span className="text-sm">{testStatus.message}</span>
            </motion.div>
          )}
        </div>

        {/* Usage Tips */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/20">
          <h4 className="text-white/90 font-medium mb-2">💡 Tips</h4>
          <p>The AI Chat supports multiple providers:</p>
          <ul className="text-white/70 text-sm space-y-1">
            <li>• <span className="highlight">Anthropic</span> - Claude 3.5 Sonnet, Claude 3 Opus, and other models</li>
            <li>• <span className="highlight">OpenAI</span> - GPT-3.5, GPT-4, and other models</li>
            <li>• <span className="highlight">Custom APIs</span> - Use your own AI endpoints</li>
          </ul>
          <p>To get started, you'll need an API key from your chosen provider. The default option is Anthropic, which you can get from <strong>console.anthropic.com</strong>.</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatSettings;

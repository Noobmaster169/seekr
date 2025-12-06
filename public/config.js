// Configuration for Seekr Extension
// Set your Claude API key here for auto-configuration
const SEEKR_CONFIG = {
  // Set your Claude API key here (starts with sk-ant-api03-...)
  // Leave empty to use manual configuration in overlay
  CLAUDE_API_KEY: '', // <-- PUT YOUR API KEY HERE
  
  // Or use environment variable (for development)
  // This will be replaced during build if needed
  USE_ENV_KEY: false
}

// Export for use in background script
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SEEKR_CONFIG
}


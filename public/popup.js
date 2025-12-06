// Popup script for Seekr extension
document.addEventListener('DOMContentLoaded', () => {
  const detectBtn = document.getElementById('detectBtn')
  const reelUrlInput = document.getElementById('reelUrlInput')
  const statusText = document.getElementById('statusText')
  const errorMessage = document.getElementById('errorMessage')
  const results = document.getElementById('results')
  const settingsLink = document.getElementById('settingsLink')
  const settingsSection = document.getElementById('settingsSection')
  const apiKeyInput = document.getElementById('apiKeyInput')
  const saveApiKeyBtn = document.getElementById('saveApiKeyBtn')
  const cancelSettingsBtn = document.getElementById('cancelSettingsBtn')
  const apiKeyStatus = document.getElementById('apiKeyStatus')

  // Check for API key on load
  checkApiKey().then(hasKey => {
    updateApiKeyStatus(hasKey)
  })

  // Detect products button
  detectBtn.addEventListener('click', async () => {
    const reelUrl = reelUrlInput.value.trim()
    
    if (!reelUrl) {
      showError('Please enter an Instagram Reel URL')
      return
    }
    
    if (!reelUrl.includes('instagram.com') && !reelUrl.includes('reel')) {
      showError('Please enter a valid Instagram Reel URL')
      return
    }
    
    await detectProducts(reelUrl)
  })

  // Enter key to detect
  reelUrlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      detectBtn.click()
    }
  })

  // Settings link
  settingsLink.addEventListener('click', (e) => {
    e.preventDefault()
    toggleSettings()
  })

  // Save API key button
  saveApiKeyBtn.addEventListener('click', async () => {
    const apiKey = apiKeyInput.value.trim()
    if (!apiKey) {
      showError('Please enter an API key')
      return
    }
    
    try {
      await chrome.runtime.sendMessage({
        action: 'setApiKey',
        apiKey: apiKey
      })
      
      statusText.textContent = 'API key saved!'
      updateApiKeyStatus(true)
      toggleSettings()
      
      setTimeout(() => {
        statusText.textContent = 'Ready'
      }, 2000)
    } catch (error) {
      showError('Failed to save API key: ' + error.message)
    }
  })

  // Cancel settings button
  cancelSettingsBtn.addEventListener('click', () => {
    toggleSettings()
    apiKeyInput.value = ''
  })

  /**
   * Detect products from reel URL
   */
  async function detectProducts(reelUrl) {
    try {
      // Show loading state
      detectBtn.disabled = true
      detectBtn.classList.add('loading')
      statusText.textContent = 'Detecting products...'
      hideError()
      results.classList.remove('show')
      results.innerHTML = ''

      // Check API key first
      const hasApiKey = await checkApiKey()
      if (!hasApiKey) {
        showError('Claude API key not configured. Click "Configure Claude API Key" to set it up.')
        detectBtn.disabled = false
        detectBtn.classList.remove('loading')
        return
      }

      // Extract reel data from current page if on Instagram
      let reelData = { caption: '', hashtags: [], imageBase64: null }
      
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
        if (tab.url && tab.url.includes('instagram.com')) {
          // Try to extract data from content script
          try {
            const extractResponse = await chrome.tabs.sendMessage(tab.id, { action: 'extractReelData' })
            if (extractResponse && extractResponse.success) {
              reelData = extractResponse.data
              console.log('✅ Extracted reel data:', reelData)
            }
          } catch (e) {
            console.warn('Could not extract from content script:', e)
          }
          
          // Try to capture screenshot
          try {
            const screenshot = await chrome.tabs.captureVisibleTab(null, { format: 'jpeg', quality: 80 })
            if (screenshot) {
              // Convert data URL to base64
              reelData.imageBase64 = screenshot.split(',')[1]
              console.log('✅ Captured screenshot')
            }
          } catch (e) {
            console.warn('Could not capture screenshot:', e)
          }
        }
      } catch (error) {
        console.warn('Error extracting reel data:', error)
      }

      // Send message to background script
      const response = await chrome.runtime.sendMessage({
        action: 'detectProducts',
        data: {
          reelUrl: reelUrl,
          caption: reelData.caption,
          hashtags: reelData.hashtags,
          imageBase64: reelData.imageBase64
        }
      })

      if (response.success) {
        displayResults(response.data)
        statusText.textContent = `Found ${response.data.products.length} product(s)`
        
        // Send to Lindy
        sendToLindy(response.data)
      } else {
        throw new Error(response.error || 'Detection failed')
      }
    } catch (error) {
      console.error('Detection error:', error)
      showError(error.message || 'Failed to detect products. Please check your API key and try again.')
      statusText.textContent = 'Error'
    } finally {
      detectBtn.disabled = false
      detectBtn.classList.remove('loading')
    }
  }

  /**
   * Display detection results
   */
  function displayResults(data) {
    results.innerHTML = ''
    
    if (data.products.length === 0) {
      results.innerHTML = '<div class="result-item"><p>No products detected.</p></div>'
      results.classList.add('show')
      return
    }

    data.products.forEach((product, index) => {
      const item = document.createElement('div')
      item.className = 'result-item'
      
      const details = []
      if (product.color) details.push(`Color: ${product.color}`)
      if (product.style) details.push(`Style: ${product.style}`)
      if (product.brand && product.brand !== 'UNKNOWN') details.push(`Brand: ${product.brand}`)
      details.push(`Confidence: ${(product.confidence * 100).toFixed(0)}%`)
      
      item.innerHTML = `
        <h4>${product.category} (${product.role})</h4>
        <p>${product.description}</p>
        <p style="font-size: 11px; opacity: 0.7;">${details.join(' • ')}</p>
      `
      
      results.appendChild(item)
    })

    // Show search queries
    if (data.search_queries && data.search_queries.length > 0) {
      const queriesItem = document.createElement('div')
      queriesItem.className = 'result-item'
      queriesItem.style.background = 'rgba(59, 130, 246, 0.2)'
      queriesItem.innerHTML = `
        <h4>Search Queries (for Lindy)</h4>
        <p style="font-size: 12px;">${data.search_queries.join(', ')}</p>
      `
      results.appendChild(queriesItem)
    }

    results.classList.add('show')
  }

  /**
   * Check if API key is configured
   */
  async function checkApiKey() {
    try {
      const response = await chrome.runtime.sendMessage({ action: 'getApiKey' })
      const hasKey = !!response.apiKey
      updateApiKeyStatus(hasKey)
      return hasKey
    } catch (error) {
      console.error('Error checking API key:', error)
      updateApiKeyStatus(false)
      return false
    }
  }

  /**
   * Show error message
   */
  function showError(message) {
    errorMessage.textContent = message
    errorMessage.classList.add('show')
  }

  /**
   * Hide error message
   */
  function hideError() {
    errorMessage.classList.remove('show')
  }

  /**
   * Toggle settings section
   */
  function toggleSettings() {
    const isVisible = settingsSection.style.display !== 'none'
    settingsSection.style.display = isVisible ? 'none' : 'block'
    settingsSection.classList.toggle('show', !isVisible)
    
    if (!isVisible) {
      // Load current API key if exists
      chrome.runtime.sendMessage({ action: 'getApiKey' }, (response) => {
        if (response && response.apiKey) {
          apiKeyInput.value = response.apiKey
        }
      })
    } else {
      apiKeyInput.value = ''
    }
  }

  /**
   * Update API key status indicator
   */
  function updateApiKeyStatus(hasKey) {
    if (hasKey) {
      apiKeyStatus.textContent = 'API Key ✓'
      apiKeyStatus.className = 'api-key-status configured'
    } else {
      apiKeyStatus.textContent = 'No API Key'
      apiKeyStatus.className = 'api-key-status not-configured'
    }
  }

  /**
   * Send detection result to Lindy
   */
  function sendToLindy(data) {
    // Store in local storage for Lindy to read
    chrome.storage.local.set({
      'seekr-latest-detection': {
        data: data,
        timestamp: new Date().toISOString()
      }
    }, () => {
      console.log('✅ Detection result stored for Lindy')
    })

    // Also broadcast via message
    chrome.runtime.sendMessage({
      type: 'PRODUCT_DETECTION_RESULT',
      data: data
    }).catch(() => {
      // Ignore errors if no listeners
    })
  }
})

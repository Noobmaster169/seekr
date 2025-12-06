// Content script for Seekr Extension
console.log('🔍 Seekr content script loaded on:', window.location.href)

// IMPORTANT: Set up message listener FIRST, before injecting overlay
// This ensures the listener is ready when overlay sends messages
window.addEventListener('message', async (event) => {
  // Only accept messages from our extension
  if (event.data && event.data.type === 'SEEKR_REQUEST') {
    const { messageId, action, data } = event.data
    console.log('📨 Content script received request:', action, messageId, data)
    
    try {
      let response
      
      // Handle actions locally in content script first
      if (action === 'captureVideoFrame') {
        // Capture frame from video element using canvas (no permission needed)
        console.log('🎥 Capturing video frame from DOM')
        const frameData = await captureVideoFrame()
        response = { success: true, data: frameData }
      } else if (action === 'extractReelData') {
        // Handle locally in content script
        console.log('📋 Extracting reel data locally')
        const reelData = await extractInstagramReelData()
        response = { success: true, data: reelData }
      }
      // Forward other actions to background script
      else if (action === 'getApiKey' || action === 'setApiKey' || action === 'detectProducts' || action === 'captureScreenshot') {
        response = await new Promise((resolve, reject) => {
          // Build message object correctly
          const message = { action }
          
          // For setApiKey, the apiKey is in data.apiKey
          if (action === 'setApiKey') {
            message.apiKey = data.apiKey
          }
          // For detectProducts, the data object contains all the fields
          else if (action === 'detectProducts') {
            message.data = data
          }
          
          console.log('📤 Content script sending to background:', message)
          
          chrome.runtime.sendMessage(message, (result) => {
            if (chrome.runtime.lastError) {
              console.error('❌ Background error:', chrome.runtime.lastError.message)
              reject(new Error(chrome.runtime.lastError.message))
            } else {
              console.log('✅ Background response received:', result)
              resolve(result)
            }
          })
        })
      } else {
        throw new Error(`Unknown action: ${action}`)
      }
      
      // Send response back to overlay
      console.log('📥 Content script sending response to overlay:', messageId, response)
      window.postMessage({
        type: 'SEEKR_RESPONSE',
        messageId,
        response
      }, '*')
    } catch (error) {
      console.error('❌ Error handling request:', error)
      // Send error back to overlay
      window.postMessage({
        type: 'SEEKR_RESPONSE',
        messageId,
        error: error.message
      }, '*')
    }
  }
})

// Check if we're on a restricted page
const isRestrictedPage = window.location.protocol === 'chrome-extension:' || 
                        window.location.protocol === 'chrome:' ||
                        window.location.protocol === 'edge:' ||
                        window.location.protocol === 'about:'

// Check if we're on Instagram
const isInstagram = window.location.hostname.includes('instagram.com')

if (isRestrictedPage) {
  console.log('❌ Seekr: Cannot run on restricted page')
} else if (!isInstagram) {
  console.log('ℹ️ Seekr: Not on Instagram, overlay will not be injected')
} else {
  console.log('✅ Seekr: On Instagram, initializing overlay...')
  
  // Function to inject overlay
  function injectOverlay() {
    try {
      // Inject the React overlay bundle (CSS is included in the bundle)
      const script = document.createElement('script')
      script.src = chrome.runtime.getURL('assets/overlay.js')
      script.onload = () => {
        console.log('✨ Seekr overlay loaded successfully!')
      }
      script.onerror = (error) => {
        console.error('❌ Failed to load Seekr overlay script:', error)
      }

      // Try to append script
      const target = document.head || document.documentElement
      if (target) {
        target.appendChild(script)
        console.log('📝 Seekr script injected into:', target.tagName)
      } else {
        console.error('❌ No valid target found for script injection')
      }
    } catch (error) {
      console.error('❌ Seekr injection failed:', error)
    }
  }

  // Wait for document to be ready
  if (document.readyState === 'loading') {
    console.log('⏳ Waiting for DOMContentLoaded...')
    document.addEventListener('DOMContentLoaded', injectOverlay)
  } else {
    console.log('✅ DOM already ready, injecting now...')
    injectOverlay()
  }
}

// Listen for messages from popup/background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleOverlay') {
    window.postMessage({ type: 'TOGGLE_OVERLAY' }, '*')
    sendResponse({ success: true })
    return true
  }
  
  if (request.action === 'extractReelData') {
    // Extract Instagram Reel data from current page
    extractInstagramReelData()
      .then(data => sendResponse({ success: true, data }))
      .catch(error => sendResponse({ success: false, error: error.message }))
    return true // Keep channel open for async
  }
  
  return true
})

/**
 * Extract Instagram Reel data from current page
 * Only extracts caption and hashtags - image capture is handled by screenshot
 */
async function extractInstagramReelData() {
  const data = {
    caption: '',
    hashtags: []
  }
  
  // Check if we're on Instagram
  if (!window.location.hostname.includes('instagram.com')) {
    return data
  }
  
  try {
    // Extract caption
    const captionSelectors = [
      'h1[dir="auto"]', // Main caption
      'span[dir="auto"]', // Alternative caption location
      'article h1',
      '[data-testid="post-caption"]'
    ]
    
    for (const selector of captionSelectors) {
      const element = document.querySelector(selector)
      if (element && element.textContent.trim()) {
        data.caption = element.textContent.trim()
        break
      }
    }
    
    // Extract hashtags from caption or dedicated elements
    const hashtagRegex = /#[\w]+/g
    if (data.caption) {
      const matches = data.caption.match(hashtagRegex)
      if (matches) {
        data.hashtags = matches.map(tag => tag.substring(1)) // Remove #
      }
    }
    
    // Try to find hashtag elements
    const hashtagElements = document.querySelectorAll('a[href*="/explore/tags/"]')
    if (hashtagElements.length > 0 && data.hashtags.length === 0) {
      hashtagElements.forEach(el => {
        const tag = el.textContent.trim()
        if (tag.startsWith('#')) {
          data.hashtags.push(tag.substring(1))
        } else if (tag) {
          data.hashtags.push(tag)
        }
      })
    }
    
  } catch (error) {
    console.error('Error extracting reel data:', error)
  }
  
  return data
}

/**
 * Capture current frame from video element using canvas
 * This doesn't require any special permissions - works directly from DOM
 * Returns full data URL for Claude API
 */
async function captureVideoFrame() {
  const videoElement = document.querySelector('video')
  if (!videoElement) {
    return { imageDataUrl: null, error: 'No video element found' }
  }
  
  try {
    console.log('🎥 Capturing video frame from DOM...')
    console.log('Video state:', {
      readyState: videoElement.readyState,
      videoWidth: videoElement.videoWidth,
      videoHeight: videoElement.videoHeight
    })
    
    // Wait for video metadata
    if (videoElement.readyState < 2) {
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          console.warn('Video load timeout, proceeding anyway')
          resolve()
        }, 3000)
        
        const checkReady = () => {
          if (videoElement.readyState >= 2) {
            clearTimeout(timeout)
            resolve()
          }
        }
        
        videoElement.addEventListener('loadedmetadata', checkReady, { once: true })
        videoElement.addEventListener('loadeddata', checkReady, { once: true })
        checkReady()
      })
    }
    
    // Get dimensions
    let width = videoElement.videoWidth
    let height = videoElement.videoHeight
    
    if (!width || !height || width === 0 || height === 0) {
      width = videoElement.clientWidth || 1080
      height = videoElement.clientHeight || 1920
    }
    
    if (width < 100) width = 1080
    if (height < 100) height = 1920
    
    // Create canvas
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    
    // Draw video frame
    ctx.drawImage(videoElement, 0, 0, width, height)
    
    // Convert to data URL with reduced quality to speed up API calls
    // Using 0.85 quality instead of 0.95 to reduce size and improve speed
    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.85)
    
    console.log(`✅ Captured video frame: ${imageDataUrl.length} characters`)
    return { imageDataUrl }
  } catch (error) {
    console.error('❌ Error capturing video frame:', error)
    return { imageDataUrl: null, error: error.message }
  }
}

// Bridge messages between overlay and background script
window.addEventListener('message', async (event) => {
  // Only accept messages from same origin
  if (event.source !== window) return
  
  if (event.data.type === 'API_CALL_REQUEST') {
    console.log('🌉 Content Script: Received API request from overlay');
    console.log('📋 Request data:', event.data);
    
    try {
      console.log('📤 Content Script: Forwarding to background script');
      
      // Forward to background script
      const response = await chrome.runtime.sendMessage({
        action: 'makeApiCall',
        data: event.data.payload
      })
      
      console.log('📨 Content Script: Received response from background');
      console.log('📋 Background response:', response);
      
      // Send response back to overlay
      console.log('📤 Content Script: Sending response back to overlay');
      window.postMessage({
        type: 'API_CALL_RESPONSE',
        requestId: event.data.requestId,
        response: response
      }, '*')
    } catch (error) {
      console.error('❌ Content Script: Error in API bridge:', error);
      
      // Send error back to overlay
      window.postMessage({
        type: 'API_CALL_RESPONSE',
        requestId: event.data.requestId,
        response: { success: false, error: error.message }
      }, '*')
    }
  }
  
  // Handle scrape requests
  if (event.data.type === 'SCRAPE_UNIQLO_REQUEST') {
    console.log('🛍️ Content Script: Received scrape request from overlay');
    console.log('📋 URL:', event.data.url);
    
    try {
      // Forward to background script
      const response = await chrome.runtime.sendMessage({
        action: 'scrapeUniqlo',
        url: event.data.url,
        productId: event.data.productId
      })
      
      console.log('✅ Content Script: Scrape successful');
      
      // Send response back to overlay
      window.postMessage({
        type: 'SCRAPE_UNIQLO_RESPONSE',
        requestId: event.data.requestId,
        result: response
      }, '*')
    } catch (error) {
      console.error('❌ Content Script: Scrape error:', error);
      
      // Send error back to overlay
      window.postMessage({
        type: 'SCRAPE_UNIQLO_RESPONSE',
        requestId: event.data.requestId,
        result: { success: false, error: error.message }
      }, '*')
    }
  }
})

// Content script - injected into every webpage
console.log('🌊 Liquid Glass overlay loading on:', window.location.href)

// Check if we're on a restricted page
const isRestrictedPage = window.location.protocol === 'chrome-extension:' || 
                        window.location.protocol === 'chrome:' ||
                        window.location.protocol === 'edge:' ||
                        window.location.protocol === 'about:'

if (isRestrictedPage) {
  console.log('❌ Liquid Glass: Cannot run on restricted page')
} else {
  console.log('✅ Liquid Glass: Page allowed, initializing...')
  
  // Function to inject overlay with error handling
  function injectOverlay() {
    try {
      // Inject the CSS first
      const styleLink = document.createElement('link')
      styleLink.rel = 'stylesheet'
      styleLink.href = chrome.runtime.getURL('assets/style.css')
      styleLink.onerror = () => {
        console.error('❌ Failed to load Liquid Glass CSS')
      }
      styleLink.onload = () => {
        console.log('✅ Liquid Glass CSS loaded')
      }
      document.head.appendChild(styleLink)

      // Inject the React overlay bundle
      const script = document.createElement('script')
      script.src = chrome.runtime.getURL('assets/overlay.js')
      script.onload = () => {
        console.log('✨ Liquid Glass overlay loaded successfully!')
      }
      script.onerror = (error) => {
        console.error('❌ Failed to load Liquid Glass overlay script:', error)
        console.error('This might be due to Content Security Policy restrictions')
        console.log('🔄 Trying alternative injection method...')
        
        // Fallback: Try injecting into body or create overlay directly
        setTimeout(() => {
          tryDirectOverlayCreation()
        }, 1000)
      }

      // Try to append script
      const target = document.head || document.documentElement
      if (target) {
        target.appendChild(script)
        console.log('📝 Liquid Glass script injected into:', target.tagName)
      } else {
        console.error('❌ No valid target found for script injection')
      }
    } catch (error) {
      console.error('❌ Liquid Glass injection failed:', error)
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

  // Fallback function for CSP-restricted sites
  function tryDirectOverlayCreation() {
    console.log('🔧 Attempting direct overlay creation...')
    
    // Check if overlay already exists
    if (document.getElementById('liquid-glass-overlay-root')) {
      console.log('✅ Overlay already exists')
      return
    }
    
    try {
      // Create a simple overlay container
      const overlayRoot = document.createElement('div')
      overlayRoot.id = 'liquid-glass-overlay-root'
      overlayRoot.style.cssText = `
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        z-index: 2147483647 !important;
        pointer-events: none !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif !important;
      `
      
      // Create a simple fallback overlay
      const fallbackOverlay = document.createElement('div')
      fallbackOverlay.style.cssText = `
        position: fixed !important;
        top: 20px !important;
        right: 20px !important;
        width: 300px !important;
        background: rgba(0, 0, 0, 0.8) !important;
        color: white !important;
        padding: 15px !important;
        border-radius: 10px !important;
        pointer-events: auto !important;
        z-index: 2147483647 !important;
        font-size: 14px !important;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3) !important;
      `
      fallbackOverlay.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <strong>🌊 Liquid Glass</strong>
          <button id="liquid-glass-close" style="background: none; border: none; color: white; cursor: pointer; font-size: 16px;">×</button>
        </div>
        <div style="font-size: 12px; opacity: 0.8;">
          Extension loaded in fallback mode due to site restrictions.
          <br><br>
          Press <kbd style="background: rgba(255,255,255,0.2); padding: 2px 6px; border-radius: 3px;">Alt+L</kbd> to toggle.
        </div>
      `
      
      overlayRoot.appendChild(fallbackOverlay)
      document.body.appendChild(overlayRoot)
      
      // Add close functionality
      document.getElementById('liquid-glass-close').onclick = () => {
        overlayRoot.style.display = 'none'
      }
      
      // Add keyboard shortcut
      document.addEventListener('keydown', (e) => {
        if (e.altKey && e.key === 'l') {
          e.preventDefault()
          overlayRoot.style.display = overlayRoot.style.display === 'none' ? 'block' : 'none'
        }
      })
      
      console.log('✅ Fallback overlay created successfully')
      
    } catch (error) {
      console.error('❌ Fallback overlay creation failed:', error)
    }
  }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleOverlay') {
    window.postMessage({ type: 'TOGGLE_OVERLAY' }, '*')
    sendResponse({ success: true })
  }
  return true
})

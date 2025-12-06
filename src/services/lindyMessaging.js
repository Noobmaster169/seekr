/**
 * Lindy Messaging Service
 * 
 * Handles communication with Lindy agent for product detection results.
 * This extension ONLY sends detection results - no searching.
 */

/**
 * Send product detection result to Lindy
 * @param {ProductDetectionResult} detectionResult - Product detection result
 * @returns {Promise<boolean>} - Success status
 */
export async function sendToLindy(detectionResult) {
  try {
    // Method 1: Send via Chrome runtime message (if Lindy extension is installed)
    if (typeof chrome !== 'undefined' && chrome.runtime) {
      try {
        // Replace with actual Lindy extension ID when available
        const lindyExtensionId = 'lindy-extension-id' // TODO: Configure this
        
        await chrome.runtime.sendMessage(lindyExtensionId, {
          type: 'PRODUCT_DETECTION_RESULT',
          data: detectionResult,
          timestamp: new Date().toISOString()
        })
        
        console.log('✅ Sent to Lindy via extension message')
        return true
      } catch (error) {
        console.warn('Lindy extension message failed:', error)
      }
    }
    
    // Method 2: Send via custom event (for web-based Lindy)
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('seekr-product-detection', {
        detail: {
          type: 'PRODUCT_DETECTION_RESULT',
          data: detectionResult,
          timestamp: new Date().toISOString()
        }
      })
      
      window.dispatchEvent(event)
      console.log('✅ Sent to Lindy via custom event')
      return true
    }
    
    // Method 3: Store in Chrome storage for Lindy to read
    if (typeof chrome !== 'undefined' && chrome.storage) {
      await chrome.storage.local.set({
        'seekr-latest-detection': {
          data: detectionResult,
          timestamp: new Date().toISOString()
        }
      })
      
      console.log('✅ Stored detection result for Lindy')
      return true
    }
    
    console.warn('⚠️ No Lindy communication method available')
    return false
  } catch (error) {
    console.error('❌ Error sending to Lindy:', error)
    return false
  }
}

/**
 * Broadcast detection result to all listeners
 * @param {ProductDetectionResult} detectionResult - Product detection result
 */
export function broadcastDetectionResult(detectionResult) {
  // Send to UI
  if (typeof window !== 'undefined') {
    window.postMessage({
      type: 'SEEKR_PRODUCT_DETECTION',
      data: detectionResult
    }, '*')
  }
  
  // Send to Lindy
  sendToLindy(detectionResult)
}



/**
 * Scrapes Uniqlo product options (colors and sizes) from a product page.
 * Uses window.postMessage to communicate with content script which uses chrome.tabs API.
 * 
 * @param {string} productId - The Uniqlo product ID (e.g., "E465191-000")
 * @returns {Promise<Object>} An object containing scraped data or error information
 */
export async function scrapeUniqloProductOptions(productId) {
  try {
    const url = `https://www.uniqlo.com/my/en/products/${productId}`;
    
    console.log('🔍 Requesting scrape via background worker:', url);
    
    // Use postMessage to communicate with content script
    const requestId = `scrape_${Date.now()}_${Math.random()}`;
    
    const result = await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Scrape request timeout'));
      }, 30000); // 30 second timeout
      
      // Listen for response
      const messageHandler = (event) => {
        if (event.data.type === 'SCRAPE_UNIQLO_RESPONSE' && event.data.requestId === requestId) {
          clearTimeout(timeout);
          window.removeEventListener('message', messageHandler);
          
          if (event.data.result.success) {
            resolve(event.data.result);
          } else {
            reject(new Error(event.data.result.error || 'Scrape failed'));
          }
        }
      };
      
      window.addEventListener('message', messageHandler);
      
      // Send request to content script
      window.postMessage({
        type: 'SCRAPE_UNIQLO_REQUEST',
        requestId: requestId,
        url: url,
        productId: productId
      }, '*');
    });
    
    console.log('✅ Scrape completed:', result);
    
    return result;

  } catch (error) {
    console.error('Error scraping Uniqlo product:', error);
    
    return {
      success: false,
      error: error.message,
      productId: productId
    };
  }
}
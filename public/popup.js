// Popup script for browser extension
document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('toggleBtn')
  const refreshBtn = document.getElementById('refreshBtn')
  const statusText = document.getElementById('statusText')

  // Toggle overlay
  toggleBtn.addEventListener('click', async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      
      // Check if we can inject on this page
      if (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:')) {
        statusText.textContent = 'Cannot run on browser pages'
        setTimeout(() => {
          statusText.textContent = 'Extension active'
        }, 2000)
        return
      }
      
      try {
        await chrome.tabs.sendMessage(tab.id, { action: 'toggleOverlay' })
        statusText.textContent = 'Overlay toggled!'
      } catch (err) {
        // Content script not loaded - reload the page
        statusText.textContent = 'Reloading page...'
        await chrome.tabs.reload(tab.id)
        statusText.textContent = 'Page reloaded! Click again.'
      }
      
      setTimeout(() => {
        statusText.textContent = 'Extension active'
      }, 2000)
    } catch (error) {
      console.error('Error toggling overlay:', error)
      statusText.textContent = 'Error: ' + error.message
    }
  })

  // Refresh overlay
  refreshBtn.addEventListener('click', async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      
      await chrome.tabs.reload(tab.id)
      
      statusText.textContent = 'Page refreshed!'
      setTimeout(() => {
        statusText.textContent = 'Extension active'
      }, 2000)
    } catch (error) {
      console.error('Error refreshing:', error)
      statusText.textContent = 'Error: ' + error.message
    }
  })

  // Show extension is loaded
  statusText.textContent = 'Extension active'
})

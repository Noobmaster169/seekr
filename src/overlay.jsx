import React from 'react'
import ReactDOM from 'react-dom/client'
import SimpleOverlay from './SimpleOverlay.jsx'
import './index.css'

// Make React available globally for the bundle
window.React = React
window.ReactDOM = ReactDOM

console.log('🎨 Liquid Glass overlay.jsx loaded!')
console.log('⚛️ React version:', React.version)
console.log('⚛️ ReactDOM available:', !!ReactDOM)

// Create overlay container
const createOverlayContainer = () => {
  console.log('📦 Creating overlay container...')
  const existingContainer = document.getElementById('liquid-glass-overlay-root')
  if (existingContainer) {
    console.log('✅ Existing container found')
    return existingContainer
  }

  const container = document.createElement('div')
  container.id = 'liquid-glass-overlay-root'
  container.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2147483647;
    pointer-events: none;
  `
  document.body.appendChild(container)
  console.log('✅ New container created and appended')
  return container
}

// Initialize overlay
const initOverlay = () => {
  try {
    console.log('🚀 Initializing Liquid Glass overlay...')
    const container = createOverlayContainer()
    console.log('📍 Container:', container)
    
    const root = ReactDOM.createRoot(container)
    console.log('⚛️ React root created')
    
    root.render(
      <React.StrictMode>
        <SimpleOverlay />
      </React.StrictMode>
    )
    console.log('✨ Overlay rendered!')
  } catch (error) {
    console.error('❌ Error initializing overlay:', error)
  }
}

// Wait for DOM to be ready
console.log('⏳ Document ready state:', document.readyState)
if (document.readyState === 'loading') {
  console.log('⏳ Waiting for DOMContentLoaded...')
  document.addEventListener('DOMContentLoaded', initOverlay)
} else {
  console.log('✅ DOM already loaded, initializing now...')
  initOverlay()
}

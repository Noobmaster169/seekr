import React, { useState, useEffect } from 'react'
import { Minimize2, Maximize2, Eye, EyeOff, Search, Loader } from 'lucide-react'

// Make chrome API available in overlay context
const chrome = window.chrome || (window.browser && window.browser)

function SeekrOverlay() {
  const [isVisible, setIsVisible] = useState(true)
  const [isMinimized, setIsMinimized] = useState(false)
  const [position, setPosition] = useState({ x: 20, y: 20 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  
  // Product detection state
  const [reelUrl, setReelUrl] = useState('')
  const [isDetecting, setIsDetecting] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState('')
  const [capturedImage, setCapturedImage] = useState(null) // Store captured image for display
  const [claudeDescription, setClaudeDescription] = useState(null) // Store Claude's description
  const [payloadInfo, setPayloadInfo] = useState(null) // Store payload info for debugging
  const [showPayload, setShowPayload] = useState(false) // Toggle payload display
  const [lindyResults, setLindyResults] = useState(null) // Store results from Lindy callback
  const [isPolling, setIsPolling] = useState(false) // Track if we're polling for results

  // Load saved visibility state
  useEffect(() => {
    const savedVisibility = localStorage.getItem('seekr-overlay-visible')
    if (savedVisibility !== null) {
      setIsVisible(JSON.parse(savedVisibility))
    }
  }, [])

  // Save visibility state
  useEffect(() => {
    localStorage.setItem('seekr-overlay-visible', JSON.stringify(isVisible))
  }, [isVisible])

  // No API key check needed - using Lindy directly

  // Listen for toggle commands
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'TOGGLE_OVERLAY') {
        setIsVisible(prev => !prev)
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  // Keyboard shortcut (Alt+L)
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.altKey && e.key === 'l') {
        e.preventDefault()
        setIsVisible(prev => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  const handleMouseDown = (e) => {
    const target = e.target
    const isHeaderClick = target.classList.contains('overlay-header') || 
                         target.closest('.overlay-header')
    const isButton = target.tagName === 'BUTTON' || 
                    target.closest('button') ||
                    target.tagName === 'INPUT' ||
                    target.closest('input')
    
    if (isHeaderClick && !isButton) {
      e.preventDefault()
      setIsDragging(true)
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      })
    }
  }

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e) => {
      e.preventDefault()
      const newX = e.clientX - dragOffset.x
      const newY = e.clientY - dragOffset.y
      setPosition({
        x: Math.max(0, Math.min(newX, window.innerWidth - 480)),
        y: Math.max(0, Math.min(newY, window.innerHeight - 100))
      })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    document.addEventListener('mousemove', handleMouseMove, { passive: false })
    document.addEventListener('mouseup', handleMouseUp)
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragOffset])

  // Helper function to send messages via window.postMessage to content script
  function sendMessageToBackground(action, data = {}) {
    return new Promise((resolve, reject) => {
      const messageId = Math.random().toString(36).substring(7)
      
      console.log('📤 Overlay sending request:', action, messageId, data)
      
      // Listen for response
      const handleResponse = (event) => {
        // Only process our messages
        if (event.data && event.data.type === 'SEEKR_RESPONSE' && event.data.messageId === messageId) {
          console.log('📥 Overlay received response:', event.data)
          window.removeEventListener('message', handleResponse)
          clearTimeout(timeoutId)
          
          if (event.data.error) {
            reject(new Error(event.data.error))
          } else {
            resolve(event.data.response)
          }
        }
      }
      
      window.addEventListener('message', handleResponse)
      
      // Send message to content script
      window.postMessage({
        type: 'SEEKR_REQUEST',
        messageId,
        action,
        data
      }, '*')
      
      // Timeout after 90 seconds (Claude API can take up to 60s, plus buffer for Lindy)
      const timeoutId = setTimeout(() => {
        window.removeEventListener('message', handleResponse)
        console.error('⏱️ Request timeout:', action, messageId)
        reject(new Error('Request timeout - the operation is taking longer than expected. Please try again.'))
      }, 90000) // 90 seconds
    })
  }

  // No API key functions needed - using Lindy directly

  // Poll callback server for results
  async function startPollingForResults() {
    setIsPolling(true)
    const maxAttempts = 30 // Poll for up to 60 seconds (30 attempts * 2 seconds)
    let attempts = 0
    
    const pollInterval = setInterval(async () => {
      attempts++
      
      try {
        // Try to fetch results from callback server
        const response = await fetch('http://localhost:5000/results')
        if (response.ok) {
          const data = await response.json()
          
          // Check if we have actual results (not just "no_results" status)
          if (data.status !== 'no_results' && (data.summary || data.notes || data.products)) {
            console.log('✅ Received results from Lindy:', data)
            setLindyResults(data)
            setIsPolling(false)
            clearInterval(pollInterval)
            return
          }
        }
      } catch (error) {
        // Silently fail - callback server might not be running
        console.log('⏳ Waiting for results...', attempts)
      }
      
      // Stop polling after max attempts
      if (attempts >= maxAttempts) {
        console.log('⏱️ Polling timeout - results may still arrive later')
        setIsPolling(false)
        clearInterval(pollInterval)
      }
    }, 2000) // Poll every 2 seconds
  }

  async function handleDetect() {
    if (!reelUrl.trim()) {
      setError('Please enter an Instagram Reel URL')
      return
    }

    if (!reelUrl.includes('instagram.com') && !reelUrl.includes('reel')) {
      setError('Please enter a valid Instagram Reel URL')
      return
    }

    setIsDetecting(true)
    setError('')
    setResults(null)
    setCapturedImage(null) // Clear previous image
    setClaudeDescription(null) // Clear previous description
    setPayloadInfo(null) // Clear previous payload info
    setShowPayload(false) // Hide payload display
    setLindyResults(null) // Clear previous Lindy results
    setIsPolling(false) // Reset polling state

    try {
      let imageDataUrl = null
      
      // Try to capture video frame from DOM first (no permission needed)
      if (window.location.hostname.includes('instagram.com')) {
        console.log('📱 On Instagram, trying to capture video frame from DOM...')
        try {
          const frameResponse = await sendMessageToBackground('captureVideoFrame')
          if (frameResponse && frameResponse.success && frameResponse.data && frameResponse.data.imageDataUrl) {
            imageDataUrl = frameResponse.data.imageDataUrl
            console.log('✅ Video frame captured from DOM')
            // Display the captured image in overlay
            setCapturedImage(imageDataUrl)
          }
        } catch (e) {
          console.warn('⚠️ Could not capture video frame:', e)
        }
      }
      
      // Fallback: Try screenshot if no video frame
      if (!imageDataUrl) {
        console.log('📸 No video frame, trying screenshot...')
        try {
          const screenshotResponse = await sendMessageToBackground('captureScreenshot')
          if (screenshotResponse && screenshotResponse.success && screenshotResponse.imageDataUrl) {
            imageDataUrl = screenshotResponse.imageDataUrl
            console.log('✅ Screenshot captured')
            // Display the captured screenshot in overlay
            setCapturedImage(imageDataUrl)
          }
        } catch (e) {
          console.warn('⚠️ Could not capture screenshot:', e)
        }
      }
      
      if (!imageDataUrl) {
        throw new Error('Could not capture image. Please make sure the Instagram Reel is visible and playing.')
      }
      
      // Send detection request with image - background will handle Claude and Lindy
      const response = await sendMessageToBackground('detectProducts', {
        reelUrl: reelUrl.trim(),
        imageDataUrl: imageDataUrl
      })

      if (response.success) {
        setResults(response.data)
        setClaudeDescription(response.data.claudeDescription || null) // Store Claude's description
        setPayloadInfo(response.payloadInfo || null) // Store payload info for debugging
        
        // Show notification that products were sent to Lindy
        if (response.data.products && response.data.products.length > 0) {
          console.log('✅ Products detected and sent to Lindy for searching')
        }
        
        // Start polling for results from callback server
        startPollingForResults()
      } else {
        throw new Error(response.error || 'Detection failed')
      }
    } catch (error) {
      console.error('Detection error:', error)
      setError(error.message || 'Failed to detect products. Please try again.')
    } finally {
      setIsDetecting(false)
    }
  }

  if (!isVisible) {
    return (
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          pointerEvents: 'auto',
          zIndex: 2147483647
        }}
      >
        <button
          onClick={() => setIsVisible(true)}
          style={{
            backdropFilter: 'blur(24px)',
            background: 'rgba(30, 58, 138, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            borderRadius: '50%',
            padding: '1rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(30, 58, 138, 0.9)'
            e.target.style.transform = 'scale(1.1)'
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(30, 58, 138, 0.8)'
            e.target.style.transform = 'scale(1)'
          }}
        >
          <Eye style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
        </button>
      </div>
    )
  }

  return (
    <div
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: isMinimized ? '320px' : '480px',
        maxWidth: '90vw',
        maxHeight: '90vh',
        pointerEvents: 'auto',
        zIndex: 2147483647,
        cursor: isDragging ? 'grabbing' : 'default',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}
    >
      <div 
        style={{
          background: 'linear-gradient(to bottom right, rgba(88, 28, 135, 0.9), rgba(30, 58, 138, 0.9), rgba(49, 46, 129, 0.9))',
          border: '1px solid rgba(168, 85, 247, 0.5)',
          borderRadius: '1rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          backdropFilter: 'blur(20px)'
        }}
        onMouseDown={handleMouseDown}
      >
        {/* Header */}
        <div 
          className="overlay-header"
          style={{
            background: 'rgba(0, 0, 0, 0.3)',
            padding: '0.75rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(168, 85, 247, 0.3)',
            cursor: 'grab'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Search style={{ width: '1.25rem', height: '1.25rem', color: 'rgb(196, 181, 253)' }} />
            <span style={{ color: 'white', fontWeight: '600' }}>Seekr</span>
            <span style={{ 
              fontSize: '0.7rem', 
              color: 'rgba(34, 197, 94, 1)',
              background: 'rgba(34, 197, 94, 0.2)',
              padding: '2px 6px',
              borderRadius: '4px'
            }}>Lindy ✓</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              style={{
                padding: '0.375rem',
                borderRadius: '0.5rem',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
              onMouseLeave={(e) => e.target.style.background = 'transparent'}
            >
              {isMinimized ? (
                <Maximize2 style={{ width: '1rem', height: '1rem', color: 'rgba(255, 255, 255, 0.7)' }} />
              ) : (
                <Minimize2 style={{ width: '1rem', height: '1rem', color: 'rgba(255, 255, 255, 0.7)' }} />
              )}
            </button>
            <button
              onClick={() => setIsVisible(false)}
              style={{
                padding: '0.375rem',
                borderRadius: '0.5rem',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.2)'}
              onMouseLeave={(e) => e.target.style.background = 'transparent'}
            >
              <EyeOff style={{ width: '1rem', height: '1rem', color: 'rgba(255, 255, 255, 0.7)' }} />
            </button>
          </div>
        </div>

        {/* Content */}
        {!isMinimized && (
          <div style={{ padding: '1rem', maxHeight: '70vh', overflowY: 'auto' }}>
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ 
                color: 'white', 
                fontWeight: '700', 
                fontSize: '1.125rem', 
                marginBottom: '0.5rem' 
              }}>
                🔍 Instagram Reel Product Detector
              </h3>
              <p style={{ 
                color: 'rgba(255, 255, 255, 0.7)', 
                fontSize: '0.875rem', 
                lineHeight: '1.625' 
              }}>
                Paste an Instagram Reel URL to detect fashion products
              </p>
            </div>

            {/* Input Field */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ 
                display: 'block', 
                color: 'rgba(255, 255, 255, 0.9)', 
                fontSize: '0.875rem', 
                fontWeight: '600', 
                marginBottom: '0.5rem' 
              }}>
                Instagram Reel URL
              </label>
              <input
                type="text"
                value={reelUrl}
                onChange={(e) => setReelUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleDetect()}
                placeholder="https://www.instagram.com/reel/..."
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '0.5rem',
                  color: 'white',
                  fontSize: '0.875rem',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            {/* Detect Button */}
            <button
              onClick={handleDetect}
              disabled={isDetecting}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: isDetecting ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                borderRadius: '0.5rem',
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: isDetecting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                marginBottom: '1rem',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (!isDetecting) {
                  e.target.style.background = 'rgba(255, 255, 255, 0.4)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isDetecting) {
                  e.target.style.background = 'rgba(255, 255, 255, 0.3)'
                }
              }}
            >
              {isDetecting ? (
                <>
                  <Loader style={{ width: '1rem', height: '1rem', animation: 'spin 1s linear infinite' }} />
                  <span>Detecting...</span>
                </>
              ) : (
                <>
                  <Search style={{ width: '1rem', height: '1rem' }} />
                  <span>Detect Products</span>
                </>
              )}
            </button>

            {/* Error Message */}
            {error && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.5)',
                borderRadius: '0.5rem',
                padding: '0.75rem',
                color: 'white',
                fontSize: '0.875rem',
                marginBottom: '1rem'
              }}>
                {error}
              </div>
            )}

            {/* Captured Image Preview */}
            {capturedImage && (
              <div style={{ marginTop: '1rem' }}>
                <h4 style={{ 
                  color: 'white', 
                  fontSize: '1rem', 
                  fontWeight: '600', 
                  marginBottom: '0.75rem' 
                }}>
                  Captured Image
                </h4>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '0.5rem',
                  padding: '0.5rem',
                  overflow: 'hidden'
                }}>
                  <img
                    src={capturedImage}
                    alt="Captured video frame"
                    style={{
                      width: '100%',
                      height: 'auto',
                      maxHeight: '300px',
                      objectFit: 'contain',
                      borderRadius: '0.25rem',
                      display: 'block'
                    }}
                  />
                  <p style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.75rem',
                    marginTop: '0.5rem',
                    textAlign: 'center'
                  }}>
                    📸 This image was sent to Lindy for analysis
                  </p>
                </div>
              </div>
            )}

            {/* Results */}
            {results && (
              <div style={{ marginTop: '1rem' }}>
                <h4 style={{ 
                  color: 'white', 
                  fontSize: '1rem', 
                  fontWeight: '600', 
                  marginBottom: '0.75rem' 
                }}>
                  Status
                </h4>
                <div style={{
                  background: 'rgba(34, 197, 94, 0.2)',
                  border: '1px solid rgba(34, 197, 94, 0.5)',
                  borderRadius: '0.5rem',
                  padding: '0.75rem',
                  color: 'white',
                  fontSize: '0.875rem'
                }}>
                  ✅ Image sent to Lindy for product detection and searching.
                  <br />
                  <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                    Check your callback server for search results.
                  </span>
                </div>
              </div>
            )}

            {/* Status Message */}
            {results && results.notes && (
              <div style={{
                background: 'rgba(59, 130, 246, 0.2)',
                border: '1px solid rgba(59, 130, 246, 0.5)',
                borderRadius: '0.5rem',
                padding: '0.75rem',
                marginTop: '1rem',
                fontSize: '0.75rem',
                color: 'white'
              }}>
                ℹ️ {results.notes}
              </div>
            )}

            {/* Polling Status */}
            {isPolling && (
              <div style={{
                background: 'rgba(251, 191, 36, 0.2)',
                border: '1px solid rgba(251, 191, 36, 0.5)',
                borderRadius: '0.5rem',
                padding: '0.75rem',
                marginTop: '1rem',
                fontSize: '0.875rem',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Loader style={{ width: '1rem', height: '1rem', animation: 'spin 1s linear infinite' }} />
                <span>Waiting for results from Lindy...</span>
              </div>
            )}

            {/* Lindy Results - Summary */}
            {lindyResults && lindyResults.summary && (
              <div style={{ marginTop: '1rem' }}>
                <h4 style={{ 
                  color: 'white', 
                  fontSize: '1rem', 
                  fontWeight: '600', 
                  marginBottom: '0.75rem' 
                }}>
                  📝 Summary
                </h4>
                <div style={{
                  background: 'rgba(34, 197, 94, 0.2)',
                  border: '1px solid rgba(34, 197, 94, 0.5)',
                  borderRadius: '0.5rem',
                  padding: '0.75rem',
                  color: 'white',
                  fontSize: '0.875rem',
                  whiteSpace: 'pre-wrap',
                  lineHeight: '1.5'
                }}>
                  {lindyResults.summary}
                </div>
              </div>
            )}

            {/* Lindy Results - Products */}
            {lindyResults && lindyResults.products && lindyResults.products.length > 0 && (
              <div style={{ marginTop: '1rem' }}>
                <h4 style={{ 
                  color: 'white', 
                  fontSize: '1rem', 
                  fontWeight: '600', 
                  marginBottom: '0.75rem' 
                }}>
                  📦 Found Products ({lindyResults.products.length})
                </h4>
                <div style={{
                  maxHeight: '400px',
                  overflowY: 'auto'
                }}>
                  {lindyResults.products.map((product, index) => (
                    <div
                      key={index}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '0.5rem',
                        padding: '0.75rem',
                        marginBottom: '0.75rem'
                      }}
                    >
                      <div style={{ 
                        color: 'white', 
                        fontWeight: '600', 
                        fontSize: '0.875rem',
                        marginBottom: '0.5rem' 
                      }}>
                        {product.name || `Product ${index + 1}`}
                      </div>
                      {product.brand && (
                        <div style={{ 
                          color: 'rgba(196, 181, 253, 0.9)', 
                          fontSize: '0.75rem', 
                          marginBottom: '0.25rem',
                          fontWeight: '500'
                        }}>
                          🏷️ {product.brand}
                        </div>
                      )}
                      {product.price && (
                        <div style={{ 
                          color: 'rgba(255, 255, 255, 0.9)', 
                          fontSize: '0.875rem', 
                          marginBottom: '0.5rem',
                          fontWeight: '500'
                        }}>
                          💰 {product.price}
                        </div>
                      )}
                      {product.link && (
                        <a
                          href={product.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: 'rgb(196, 181, 253)',
                            fontSize: '0.75rem',
                            textDecoration: 'underline',
                            wordBreak: 'break-all',
                            display: 'block',
                            marginBottom: '0.5rem'
                          }}
                        >
                          🔗 {product.link}
                        </a>
                      )}
                      {product.description && (
                        <div style={{ 
                          color: 'rgba(255, 255, 255, 0.7)', 
                          fontSize: '0.75rem', 
                          marginTop: '0.5rem',
                          lineHeight: '1.4',
                          fontStyle: 'italic'
                        }}>
                          {product.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Lindy Results - Notes */}
            {lindyResults && lindyResults.notes && (
              <div style={{ marginTop: '1rem' }}>
                <h4 style={{ 
                  color: 'white', 
                  fontSize: '1rem', 
                  fontWeight: '600', 
                  marginBottom: '0.75rem' 
                }}>
                  📋 Notes
                </h4>
                <div style={{
                  background: 'rgba(59, 130, 246, 0.2)',
                  border: '1px solid rgba(59, 130, 246, 0.5)',
                  borderRadius: '0.5rem',
                  padding: '0.75rem',
                  color: 'white',
                  fontSize: '0.875rem',
                  whiteSpace: 'pre-wrap',
                  lineHeight: '1.5'
                }}>
                  {lindyResults.notes}
                </div>
              </div>
            )}

            {/* Claude Description */}
            {claudeDescription && (
              <div style={{ marginTop: '1rem' }}>
                <h4 style={{ 
                  color: 'white', 
                  fontSize: '1rem', 
                  fontWeight: '600', 
                  marginBottom: '0.75rem' 
                }}>
                  🤖 Claude's Description
                </h4>
                <div style={{
                  background: 'rgba(59, 130, 246, 0.2)',
                  border: '1px solid rgba(59, 130, 246, 0.5)',
                  borderRadius: '0.5rem',
                  padding: '0.75rem',
                  color: 'white',
                  fontSize: '0.875rem',
                  maxHeight: '200px',
                  overflowY: 'auto',
                  whiteSpace: 'pre-wrap'
                }}>
                  {claudeDescription}
                </div>
              </div>
            )}

            {/* Payload Verification Section */}
            {payloadInfo && (
              <div style={{ marginTop: '1rem' }}>
                <button
                  onClick={() => setShowPayload(!showPayload)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    background: 'rgba(59, 130, 246, 0.2)',
                    border: '1px solid rgba(59, 130, 246, 0.5)',
                    borderRadius: '0.5rem',
                    color: 'white',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {showPayload ? '🔽' : '▶️'} {showPayload ? 'Hide' : 'Show'} Payload Details
                </button>
                
                {showPayload && (
                  <div style={{
                    marginTop: '0.5rem',
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '0.5rem',
                    padding: '0.75rem',
                    fontSize: '0.7rem',
                    fontFamily: 'monospace',
                    color: 'rgba(255, 255, 255, 0.9)',
                    maxHeight: '300px',
                    overflowY: 'auto'
                  }}>
                    <div style={{ marginBottom: '0.5rem', fontWeight: '600' }}>📦 Payload Sent to Lindy:</div>
                    <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      {JSON.stringify({
                        callbackUrl: payloadInfo.callbackUrl,
                        messageLength: payloadInfo.messageLength,
                        descriptionLength: payloadInfo.descriptionLength,
                        budgetMYR: payloadInfo.budgetMYR
                      }, null, 2)}
                    </div>
                    
                    <div style={{ 
                      marginTop: '0.75rem', 
                      paddingTop: '0.75rem', 
                      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                      fontSize: '0.65rem',
                      opacity: 0.7
                    }}>
                      💡 Tip: Check browser console (F12) for full payload details and network requests
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Keyboard Shortcut Hint */}
            <div style={{
              marginTop: '1rem',
              paddingTop: '1rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.2)',
              fontSize: '0.7rem',
              color: 'rgba(255, 255, 255, 0.6)',
              textAlign: 'center'
            }}>
              Press <kbd style={{
                padding: '2px 6px',
                background: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '3px',
                fontSize: '0.7rem'
              }}>Alt+L</kbd> to toggle
            </div>
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        input::placeholder {
          color: rgba(255, 255, 255, 0.5) !important;
        }
      `}</style>
    </div>
  )
}

export default SeekrOverlay


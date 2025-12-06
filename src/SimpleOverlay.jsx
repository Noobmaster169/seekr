import React, { useState, useEffect } from 'react'
import { X, Minimize2, Maximize2, Sparkles, Eye, EyeOff } from 'lucide-react'

function SimpleOverlay() {
  const [isVisible, setIsVisible] = useState(true)
  const [isMinimized, setIsMinimized] = useState(false)
  const [position, setPosition] = useState({ x: 20, y: 20 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  // Load saved visibility state from localStorage on mount
  useEffect(() => {
    const savedVisibility = localStorage.getItem('liquid-glass-visible')
    if (savedVisibility !== null) {
      setIsVisible(JSON.parse(savedVisibility))
    }
  }, [])

  // Save visibility state whenever it changes
  useEffect(() => {
    localStorage.setItem('liquid-glass-visible', JSON.stringify(isVisible))
  }, [isVisible])

  // Listen for toggle commands from popup
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'TOGGLE_OVERLAY') {
        setIsVisible(prev => !prev)
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  // Handle keyboard shortcut (Alt+L)
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
                    target.tagName === 'svg' ||
                    target.closest('svg')
    
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
          background: 'rgba(30, 58, 138, 0.9)',
          border: '1px solid rgba(59, 130, 246, 0.5)',
          borderRadius: '1rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden'
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
            borderBottom: '1px solid rgba(59, 130, 246, 0.3)',
            cursor: 'grab'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles style={{ width: '1.25rem', height: '1.25rem', color: 'rgb(147, 197, 253)' }} />
            <span style={{ color: 'white', fontWeight: '600' }}>Liquid Glass</span>
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
          <div style={{ padding: '1rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ 
                color: 'white', 
                fontWeight: '700', 
                fontSize: '1.125rem', 
                marginBottom: '0.5rem' 
              }}>
                Welcome to Liquid Glass! 🌊
              </h3>
              <p style={{ 
                color: 'rgba(255, 255, 255, 0.7)', 
                fontSize: '0.875rem', 
                lineHeight: '1.625' 
              }}>
                This beautiful overlay demonstrates the power of glassmorphism design.
                It floats above any website with stunning visual effects.
              </p>
            </div>
            
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '0.5rem',
              padding: '0.75rem',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              marginBottom: '1rem'
            }}>
              <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.875rem' }}>
                <strong>Keyboard Shortcut:</strong> Press{' '}
                <kbd style={{
                  padding: '0.25rem 0.5rem',
                  background: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: '0.25rem',
                  fontSize: '0.75rem'
                }}>
                  Alt+L
                </kbd>{' '}
                to toggle visibility
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <div style={{
                flex: '1',
                background: 'rgba(30, 58, 138, 0.3)',
                borderRadius: '0.5rem',
                padding: '0.75rem',
                border: '1px solid rgba(59, 130, 246, 0.3)'
              }}>
                <Sparkles style={{ 
                  width: '1.25rem', 
                  height: '1.25rem', 
                  color: 'rgb(147, 197, 253)', 
                  marginBottom: '0.25rem' 
                }} />
                <p style={{ 
                  color: 'rgba(255, 255, 255, 0.9)', 
                  fontSize: '0.75rem', 
                  fontWeight: '500' 
                }}>
                  Draggable
                </p>
              </div>
              <div style={{
                flex: '1',
                background: 'rgba(30, 58, 138, 0.3)',
                borderRadius: '0.5rem',
                padding: '0.75rem',
                border: '1px solid rgba(59, 130, 246, 0.3)'
              }}>
                <Sparkles style={{ 
                  width: '1.25rem', 
                  height: '1.25rem', 
                  color: 'rgb(147, 197, 253)', 
                  marginBottom: '0.25rem' 
                }} />
                <p style={{ 
                  color: 'rgba(255, 255, 255, 0.9)', 
                  fontSize: '0.75rem', 
                  fontWeight: '500' 
                }}>
                  Animated
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SimpleOverlay

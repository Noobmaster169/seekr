import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Minimize2,
  Maximize2,
  Sparkles,
  Settings,
  Info,
  Zap,
  Eye,
  EyeOff
} from 'lucide-react'
import GlassCard from './components/GlassCard'

function OverlayApp() {
  console.log('🎯 OverlayApp component rendering...')
  const [isVisible, setIsVisible] = useState(true)
  const [isMinimized, setIsMinimized] = useState(false)
  const [position, setPosition] = useState({ x: 20, y: 20 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [activeTab, setActiveTab] = useState('info')

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
    // Check if clicking on header or any header child element
    const target = e.target
    const isHeaderClick = target.classList.contains('overlay-header') || 
                         target.closest('.overlay-header')
    
    // Don't drag if clicking on buttons
    const isButton = target.tagName === 'BUTTON' || 
                    target.closest('button') ||
                    target.tagName === 'svg' ||
                    target.closest('svg')
    
    if (isHeaderClick && !isButton) {
      e.preventDefault()
      console.log('🖱️ Drag started')
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
      console.log('🖱️ Drag ended')
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
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          pointerEvents: 'auto',
          zIndex: 2147483647
        }}
      >
        <motion.button
          onClick={() => setIsVisible(true)}
          className="backdrop-blur-xl bg-gradient-to-br from-purple-500/30 to-blue-500/30 border border-white/40 rounded-full p-4 shadow-2xl hover:from-purple-500/40 hover:to-blue-500/40 transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Eye className="w-6 h-6 text-white" />
        </motion.button>
      </motion.div>
    )
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          style={{
            position: 'fixed',
            left: `${position.x}px`,
            top: `${position.y}px`,
            width: isMinimized ? '320px' : '480px',
            maxWidth: '90vw',
            maxHeight: '90vh',
            pointerEvents: 'auto',
            zIndex: 2147483647,
            cursor: isDragging ? 'grabbing' : 'default'
          }}
        >
          <div 
            style={{
              background: 'linear-gradient(to bottom right, rgba(88, 28, 135, 0.9), rgba(30, 58, 138, 0.9), rgba(49, 46, 129, 0.9))',
              border: '1px solid rgba(168, 85, 247, 0.5)',
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
                borderBottom: '1px solid rgba(168, 85, 247, 0.3)',
                cursor: 'grab'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles style={{ width: '1.25rem', height: '1.25rem', color: 'rgb(196, 181, 253)' }} />
                <span style={{ color: 'white', fontWeight: '600' }}>Liquid Glass</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <motion.button
                  onClick={() => setIsMinimized(!isMinimized)}
                  style={{
                    padding: '0.375rem',
                    borderRadius: '0.5rem',
                    transition: 'all 0.15s',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                >
                  {isMinimized ? (
                    <Maximize2 style={{ width: '1rem', height: '1rem', color: 'rgba(255, 255, 255, 0.7)' }} />
                  ) : (
                    <Minimize2 style={{ width: '1rem', height: '1rem', color: 'rgba(255, 255, 255, 0.7)' }} />
                  )}
                </motion.button>
                <motion.button
                  onClick={() => setIsVisible(false)}
                  style={{
                    padding: '0.375rem',
                    borderRadius: '0.5rem',
                    transition: 'all 0.15s',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.2)'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                >
                  <EyeOff style={{ width: '1rem', height: '1rem', color: 'rgba(255, 255, 255, 0.7)' }} />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            {!isMinimized && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                {/* Tabs */}
                <div className="flex gap-2 p-3 bg-white/0 border-b border-white/10">
                  {[
                    { id: 'info', icon: Info, label: 'Info' },
                    { id: 'features', icon: Zap, label: 'Features' },
                    { id: 'settings', icon: Settings, label: 'Settings' }
                  ].map((tab) => {
                    const Icon = tab.icon
                    return (
                      <motion.button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                          activeTab === tab.id
                            ? 'bg-white/20 text-white'
                            : 'text-white/60 hover:bg-white/10 hover:text-white/80'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{tab.label}</span>
                      </motion.button>
                    )
                  })}
                </div>

                {/* Tab Content */}
                <div className="p-4 max-h-[400px] overflow-y-auto">
                  {activeTab === 'info' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <div>
                        <h3 className="text-white font-bold text-lg mb-2">
                          Welcome to Liquid Glass! 🌊
                        </h3>
                        <p className="text-white/70 text-sm leading-relaxed">
                          This beautiful overlay demonstrates the power of glassmorphism design.
                          It floats above any website with stunning visual effects.
                        </p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3 border border-white/20">
                        <p className="text-white/90 text-sm">
                          <strong>Keyboard Shortcut:</strong> Press <kbd className="px-2 py-1 bg-white/15 rounded">Alt+L</kbd> to toggle visibility
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-lg p-3 border border-purple-400/30">
                          <Sparkles className="w-5 h-5 text-purple-300 mb-1" />
                          <p className="text-white/90 text-xs font-medium">Draggable</p>
                        </div>
                        <div className="flex-1 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg p-3 border border-blue-400/30">
                          <Zap className="w-5 h-5 text-blue-300 mb-1" />
                          <p className="text-white/90 text-xs font-medium">Animated</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'features' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3"
                    >
                      <h3 className="text-white font-bold text-lg mb-3">Features</h3>
                      {[
                        'Beautiful glassmorphism design',
                        'Draggable and resizable',
                        'Keyboard shortcuts',
                        'Smooth animations',
                        'Minimal performance impact',
                        'Works on any website'
                      ].map((feature, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-3 text-white/80 text-sm"
                        >
                          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                          {feature}
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  {activeTab === 'settings' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <h3 className="text-white font-bold text-lg mb-3">How to Use</h3>
                      
                      <div className="space-y-3">
                        <div className="bg-white/5 rounded-lg p-3 border border-white/20">
                          <p className="text-white/90 text-sm font-medium mb-1">🖱️ Drag to Move</p>
                          <p className="text-white/70 text-xs">Click and hold the header to drag this overlay anywhere</p>
                        </div>

                        <div className="bg-white/5 rounded-lg p-3 border border-white/20">
                          <p className="text-white/90 text-sm font-medium mb-1">⌨️ Keyboard Shortcut</p>
                          <p className="text-white/70 text-xs">Press <kbd className="px-2 py-0.5 bg-white/15 rounded text-xs">Alt+L</kbd> to toggle visibility</p>
                        </div>

                        <div className="bg-white/5 rounded-lg p-3 border border-white/20">
                          <p className="text-white/90 text-sm font-medium mb-1">👁️ Hide/Show</p>
                          <p className="text-white/70 text-xs">Click the eye icon in header to hide temporarily</p>
                        </div>

                        <div className="bg-white/5 rounded-lg p-3 border border-white/20">
                          <p className="text-white/90 text-sm font-medium mb-1">📏 Minimize</p>
                          <p className="text-white/70 text-xs">Use the minimize button to collapse the panel</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default OverlayApp

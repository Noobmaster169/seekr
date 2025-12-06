import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Minimize2,
  Maximize2,
  MessageSquare,
  Settings,
  Bot,
  Eye,
  EyeOff
} from 'lucide-react'
import ChatInterface from './components/ChatInterface'
import ChatSettings from './components/ChatSettings'

function OverlayApp() {
  console.log('🎯 OverlayApp component rendering...')
  const [isVisible, setIsVisible] = useState(true)
  const [isMinimized, setIsMinimized] = useState(false)
  const [position, setPosition] = useState({ x: 20, y: 20 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [activeTab, setActiveTab] = useState('chat')
  const [isConfigured, setIsConfigured] = useState(false)

  // Load saved visibility state from localStorage on mount
  useEffect(() => {
    const savedVisibility = localStorage.getItem('liquid-glass-visible')
    if (savedVisibility !== null) {
      setIsVisible(JSON.parse(savedVisibility))
    }
    
    // Check if chat is configured
    const savedConfig = localStorage.getItem('chat-config')
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig)
        setIsConfigured(!!config.apiKey)
      } catch (error) {
        console.error('Error loading chat config:', error)
      }
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
            width: isMinimized ? '320px' : '520px',
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
                <Bot style={{ width: '1.25rem', height: '1.25rem', color: 'rgb(196, 181, 253)' }} />
                <span style={{ color: 'white', fontWeight: '600' }}>AI Chat Assistant</span>
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
                    { id: 'chat', icon: MessageSquare, label: 'Chat' },
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
                        {tab.id === 'chat' && !isConfigured && (
                          <div className="w-2 h-2 bg-red-400 rounded-full" title="Not configured" />
                        )}
                      </motion.button>
                    )
                  })}
                </div>

                {/* Tab Content */}
                <div className={`${activeTab === 'chat' ? 'h-[500px] flex flex-col' : 'p-4 max-h-[400px] overflow-y-auto'}`}>
                  {activeTab === 'chat' && (
                    <ChatInterface isConfigured={isConfigured} />
                  )}

                  {activeTab === 'settings' && (
                    <div className="p-4 max-h-[400px] overflow-y-auto">
                      <ChatSettings 
                        onConfigChange={(config) => {
                          setIsConfigured(!!config.apiKey)
                        }}
                      />
                    </div>
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

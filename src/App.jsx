import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Sparkles, 
  Layers, 
  Zap, 
  Settings, 
  Globe, 
  Code,
  Cpu,
  Database
} from 'lucide-react'
import GlassCard from './components/GlassCard'
import FeatureCard from './components/FeatureCard'
import Header from './components/Header'

function App() {
  const [activeTab, setActiveTab] = useState('overview')

  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized for speed and performance',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      icon: Layers,
      title: 'Modular Design',
      description: 'Built with reusable components',
      color: 'from-blue-400 to-cyan-500'
    },
    {
      icon: Globe,
      title: 'Global Ready',
      description: 'Multi-language support included',
      color: 'from-green-400 to-emerald-500'
    },
    {
      icon: Code,
      title: 'Developer Friendly',
      description: 'Clean API and documentation',
      color: 'from-purple-400 to-pink-500'
    },
    {
      icon: Cpu,
      title: 'Smart Processing',
      description: 'AI-powered automation',
      color: 'from-red-400 to-rose-500'
    },
    {
      icon: Database,
      title: 'Secure Storage',
      description: 'Encrypted data management',
      color: 'from-indigo-400 to-violet-500'
    }
  ]

  return (
    <div className="min-h-screen p-8 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ top: '10%', left: '10%' }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ bottom: '10%', right: '10%' }}
        />
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto relative z-10">
        <Header />

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center gap-2 mb-6"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-12 h-12 text-purple-300" />
          </motion.div>
          <h1 className="text-6xl font-bold text-white mb-6 bg-clip-text text-transparent">
            Liquid Glass Plugin
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            A beautiful, modern plugin boilerplate with glassmorphism design.
            Built with React, Vite, and TailwindCSS.
          </p>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="flex justify-center gap-4 mb-12">
          {['overview', 'features', 'settings'].map((tab) => (
            <motion.button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`glass-button capitalize ${
                activeTab === tab ? 'bg-white/30' : ''
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tab}
            </motion.button>
          ))}
        </div>

        {/* Content Sections */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <GlassCard className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
                <Sparkles className="w-8 h-8" />
                Welcome to Liquid Glass
              </h2>
              <p className="text-white/80 text-lg leading-relaxed">
                This is a modern plugin boilerplate featuring the stunning Liquid Glass design aesthetic.
                The glassmorphism effect creates depth and visual interest while maintaining excellent readability.
                Perfect for building beautiful, professional applications.
              </p>
            </GlassCard>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <FeatureCard key={index} {...feature} delay={index * 0.1} />
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'features' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <GlassCard>
              <h2 className="text-3xl font-bold text-white mb-6">Features</h2>
              <ul className="space-y-4 text-white/80 text-lg">
                <li className="flex items-start gap-3">
                  <Zap className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                  <span>Built with Vite for blazing fast development</span>
                </li>
                <li className="flex items-start gap-3">
                  <Layers className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                  <span>React 18 with modern hooks and patterns</span>
                </li>
                <li className="flex items-start gap-3">
                  <Sparkles className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
                  <span>Stunning glassmorphism UI with TailwindCSS</span>
                </li>
                <li className="flex items-start gap-3">
                  <Code className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <span>Lucide React icons for beautiful iconography</span>
                </li>
                <li className="flex items-start gap-3">
                  <Settings className="w-6 h-6 text-pink-400 flex-shrink-0 mt-1" />
                  <span>Framer Motion for smooth animations</span>
                </li>
              </ul>
            </GlassCard>
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <GlassCard>
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Settings className="w-8 h-8" />
                Settings
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-white mb-2 font-medium">Project Name</label>
                  <input
                    type="text"
                    placeholder="Enter project name"
                    className="glass-input w-full"
                    defaultValue="Liquid Glass Plugin"
                  />
                </div>
                <div>
                  <label className="block text-white mb-2 font-medium">API Endpoint</label>
                  <input
                    type="text"
                    placeholder="https://api.example.com"
                    className="glass-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-white mb-2 font-medium">Theme Color</label>
                  <div className="flex gap-4">
                    {['purple', 'blue', 'pink', 'green'].map((color) => (
                      <button
                        key={color}
                        className={`w-12 h-12 rounded-lg bg-${color}-500 hover:scale-110 transition-transform border-2 border-white/30`}
                      />
                    ))}
                  </div>
                </div>
                <motion.button
                  className="glass-button w-full mt-6"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Save Settings
                </motion.button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default App

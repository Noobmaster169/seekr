import { motion } from 'framer-motion'
import { Menu, Bell, User } from 'lucide-react'

function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass-card p-4 mb-12 flex items-center justify-between"
    >
      <div className="flex items-center gap-4">
        <button className="glass-button !p-2">
          <Menu className="w-6 h-6 text-white" />
        </button>
        <span className="text-white font-semibold text-lg">Liquid Glass</span>
      </div>
      
      <div className="flex items-center gap-3">
        <motion.button
          className="glass-button !p-2 relative"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Bell className="w-6 h-6 text-white" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
            3
          </span>
        </motion.button>
        <motion.button
          className="glass-button !p-2"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <User className="w-6 h-6 text-white" />
        </motion.button>
      </div>
    </motion.header>
  )
}

export default Header

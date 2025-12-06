import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, ExternalLink, Package, ShoppingCart } from 'lucide-react';

const ItemConfirmation = ({ selection, onConfirm, onBack }) => {
  const { product, color, size, quantity } = selection;
  const totalPrice = (product.price * quantity).toFixed(2);

  const handleConfirmPurchase = () => {
    // This will redirect to the actual product page
    onConfirm(selection);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <motion.button
            onClick={onBack}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </motion.button>
          <div>
            <h2 className="text-lg font-bold text-white">Confirm Purchase</h2>
            <p className="text-xs text-white/60">Review your selection</p>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="flex justify-center py-4"
        >
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-2xl">
              <Check className="w-10 h-10 text-white" />
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="absolute -bottom-2 -right-2 bg-purple-500 rounded-full p-2 shadow-lg"
            >
              <ShoppingCart className="w-5 h-5 text-white" />
            </motion.div>
          </div>
        </motion.div>

        {/* Product Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl overflow-hidden backdrop-blur-xl bg-white/10 border border-white/20"
        >
          <div className="flex gap-4 p-4">
            {/* Product Image */}
            <div className="w-24 h-24 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23667" width="100" height="100"/%3E%3Ctext x="50" y="50" text-anchor="middle" dominant-baseline="middle" fill="%23fff" font-size="14"%3ENo Image%3C/text%3E%3C/svg%3E';
                }}
              />
            </div>

            {/* Product Details */}
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-bold text-base truncate">
                {product.title}
              </h3>
              <p className="text-purple-300 font-semibold text-lg mt-1">
                ${product.price}
              </p>
              {product.description && (
                <p className="text-white/60 text-xs mt-1 line-clamp-2">
                  {product.description}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Selection Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          <h3 className="text-white font-semibold text-sm">Your Selection</h3>
          
          <div className="grid grid-cols-2 gap-3">
            {/* Color */}
            <div className="rounded-lg bg-white/5 border border-white/10 p-3">
              <p className="text-white/60 text-xs mb-2">Color</p>
              <div className="flex items-center gap-2">
                {color.iconUrl ? (
                  <img
                    src={color.iconUrl}
                    alt={color.name}
                    className="w-5 h-5 rounded-full border-2 border-white/30 object-cover"
                  />
                ) : (
                  <div
                    className="w-5 h-5 rounded-full border-2 border-white/30"
                    style={{
                      backgroundColor: color.hex,
                      boxShadow: color.hex === '#FFFFFF' ? 'inset 0 0 0 1px rgba(0,0,0,0.2)' : 'none',
                    }}
                  />
                )}
                <span className="text-white font-semibold text-sm">{color.name}</span>
              </div>
            </div>

            {/* Size */}
            <div className="rounded-lg bg-white/5 border border-white/10 p-3">
              <p className="text-white/60 text-xs mb-2">Size</p>
              <span className="text-white font-semibold text-base">{typeof size === 'object' ? size.name : size}</span>
            </div>

            {/* Quantity */}
            <div className="rounded-lg bg-white/5 border border-white/10 p-3">
              <p className="text-white/60 text-xs mb-2">Quantity</p>
              <span className="text-white font-semibold text-base">{quantity}</span>
            </div>

            {/* Total Price */}
            <div className="rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-400/30 p-3">
              <p className="text-white/60 text-xs mb-2">Total</p>
              <span className="text-purple-300 font-bold text-lg">${totalPrice}</span>
            </div>
          </div>
        </motion.div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-400/20"
        >
          <Package className="w-5 h-5 text-purple-300 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-white font-semibold text-sm">Ready to purchase?</h4>
            <p className="text-white/70 text-xs mt-1">
              Clicking "Confirm & Go to Store" will redirect you to the product page where you can complete your purchase.
            </p>
          </div>
        </motion.div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-lg bg-white/5 border border-white/10 p-4 space-y-2"
        >
          <h4 className="text-white font-semibold text-sm mb-3">Order Summary</h4>
          
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Subtotal</span>
            <span className="text-white">${totalPrice}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Shipping</span>
            <span className="text-white">Calculated at checkout</span>
          </div>
          
          <div className="border-t border-white/10 pt-2 mt-2">
            <div className="flex justify-between">
              <span className="text-white font-semibold">Total</span>
              <span className="text-purple-300 font-bold text-lg">${totalPrice}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer Actions */}
      <div className="px-4 pb-4 pt-3 border-t border-white/10 bg-black/20 space-y-2">
        <motion.button
          onClick={handleConfirmPurchase}
          className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold transition-all shadow-lg flex items-center justify-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span>Confirm & Go to Store</span>
          <ExternalLink className="w-4 h-4" />
        </motion.button>
        
        <p className="text-center text-xs text-white/50">
          You'll be redirected to complete your purchase
        </p>
      </div>
    </div>
  );
};

export default ItemConfirmation;

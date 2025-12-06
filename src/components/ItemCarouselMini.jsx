import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';

const ItemCarouselMini = ({ products, onSelectProduct }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  const handleSelect = (product) => {
    onSelectProduct?.(product);
  };

  if (!products || products.length === 0) {
    return (
      <div className="flex items-center justify-center p-4 text-white/60 text-sm">
        <p>No products available</p>
      </div>
    );
  }

  const currentProduct = products[currentIndex];

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <ShoppingCart className="w-4 h-4 text-purple-300" />
        <h3 className="text-sm font-semibold text-white">Product Selection</h3>
        <div className="flex-1 flex justify-end gap-1">
          {products.map((_, idx) => (
            <div
              key={idx}
              className={`h-1 rounded-full transition-all ${
                idx === currentIndex
                  ? 'w-4 bg-purple-400'
                  : 'w-1 bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Compact Product Card */}
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-lg overflow-hidden backdrop-blur-xl bg-white/10 border border-white/20"
      >
        <div className="flex gap-3 p-3">
          {/* Product Image */}
          <div className="w-20 h-20 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
            <img
              src={currentProduct.image}
              alt={currentProduct.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23667" width="100" height="100"/%3E%3Ctext x="50" y="50" text-anchor="middle" dominant-baseline="middle" fill="%23fff" font-size="12"%3ENo Image%3C/text%3E%3C/svg%3E';
              }}
            />
          </div>

          {/* Product Details */}
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div>
              <h4 className="text-white font-semibold text-sm truncate">
                {currentProduct.title}
              </h4>
              {currentProduct.description && (
                <p className="text-white/60 text-xs mt-0.5 line-clamp-1">
                  {currentProduct.description}
                </p>
              )}
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-purple-300 font-bold text-base">
                ${currentProduct.price}
              </span>
              {currentProduct.colors && (
                <div className="flex gap-1">
                  {currentProduct.colors.slice(0, 3).map((color, idx) => (
                    <div
                      key={idx}
                      className="w-3 h-3 rounded-full border border-white/30"
                      style={{
                        backgroundColor: color.hex,
                        boxShadow: color.hex === '#FFFFFF' ? 'inset 0 0 0 1px rgba(0,0,0,0.2)' : 'none',
                      }}
                      title={color.name}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation & Action Bar */}
        <div className="flex items-center gap-2 px-3 pb-3">
          <motion.button
            onClick={handlePrevious}
            className="p-1.5 rounded-md bg-white/10 hover:bg-white/20 border border-white/20 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            disabled={products.length <= 1}
          >
            <ChevronLeft className="w-3.5 h-3.5 text-white" />
          </motion.button>

          <motion.button
            onClick={() => handleSelect(currentProduct)}
            className="flex-1 py-1.5 px-3 rounded-md bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white text-xs font-semibold transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Select Product
          </motion.button>

          <motion.button
            onClick={handleNext}
            className="p-1.5 rounded-md bg-white/10 hover:bg-white/20 border border-white/20 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            disabled={products.length <= 1}
          >
            <ChevronRight className="w-3.5 h-3.5 text-white" />
          </motion.button>
        </div>
      </motion.div>

      {/* Product Counter */}
      <div className="text-center mt-2">
        <span className="text-xs text-white/50">
          {currentIndex + 1} of {products.length}
        </span>
      </div>
    </div>
  );
};

export default ItemCarouselMini;

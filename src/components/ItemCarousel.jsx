import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ItemCarousel = ({ products, onSelectProduct }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  const handleSelect = (product) => {
    onSelectProduct(product);
  };

  if (!products || products.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-white/60">
        <p>No products available</p>
      </div>
    );
  }

  const visibleProducts = [
    products[(currentIndex - 1 + products.length) % products.length],
    products[currentIndex],
    products[(currentIndex + 1) % products.length],
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-xl font-bold text-white">Select a Product</h2>
        <p className="text-sm text-white/60 mt-1">Browse and choose from available items</p>
      </div>

      {/* Carousel */}
      <div className="flex-1 flex items-center justify-center px-4 py-6 relative">
        {/* Navigation Buttons */}
        <motion.button
          onClick={handlePrevious}
          className="absolute left-2 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </motion.button>

        {/* Product Cards */}
        <div className="flex items-center gap-3 w-full justify-center">
          {visibleProducts.map((product, idx) => {
            const isCenter = idx === 1;
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: isCenter ? 1 : 0.4,
                  scale: isCenter ? 1 : 0.75,
                  zIndex: isCenter ? 10 : 1,
                }}
                transition={{ duration: 0.3 }}
                className={`flex-shrink-0 ${isCenter ? 'w-48' : 'w-32'}`}
                onClick={() => isCenter && handleSelect(product)}
                style={{ cursor: isCenter ? 'pointer' : 'default' }}
              >
                <div
                  className={`rounded-xl overflow-hidden backdrop-blur-xl border transition-all ${
                    isCenter
                      ? 'bg-white/20 border-purple-400/50 shadow-2xl'
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  <div className="aspect-square bg-white/10 flex items-center justify-center overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23667" width="100" height="100"/%3E%3Ctext x="50" y="50" text-anchor="middle" dominant-baseline="middle" fill="%23fff" font-size="14"%3ENo Image%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </div>
                  {isCenter && (
                    <div className="p-3 relative">
                      {product.isUniqlo && (
                        <div className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-lg">
                          UNIQLO
                        </div>
                      )}
                      <h3 className="text-white font-semibold text-sm truncate">
                        {product.title}
                      </h3>
                      {product.price && (
                        <p className="text-purple-300 text-sm font-bold mt-1">
                          {product.isUniqlo ? 'RM' : '$'}{product.price}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.button
          onClick={handleNext}
          className="absolute right-2 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </motion.button>
      </div>

      {/* Product Info */}
      <div className="px-4 pb-4">
        <motion.button
          onClick={() => handleSelect(products[currentIndex])}
          className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold transition-all shadow-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Select This Product
        </motion.button>
        
        <div className="flex items-center justify-center gap-2 mt-3">
          {products.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all ${
                idx === currentIndex
                  ? 'w-6 bg-purple-400'
                  : 'w-1.5 bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ItemCarousel;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, Info, Loader2, AlertCircle } from 'lucide-react';

const ItemSelection = ({ product, onConfirm, onBack }) => {
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoadingUniqlo, setIsLoadingUniqlo] = useState(false);
  const [uniqloError, setUniqloError] = useState(null);
  const [productData, setProductData] = useState(product);

  // Load Uniqlo data if this is a Uniqlo product
  useEffect(() => {
    if (product.isUniqlo && product.uniqloProductId) {
      loadUniqloData();
    } else {
      setProductData(product);
    }
  }, [product]);

  const loadUniqloData = async () => {
    setIsLoadingUniqlo(true);
    setUniqloError(null);

    try {
      // Dynamically import the scraper
      const { scrapeUniqloProductOptions } = await import('../../utils/scraper/index.js');
      
      const result = await scrapeUniqloProductOptions(product.uniqloProductId);

      if (result.success) {
        // Transform and merge with existing product data
        const updatedProduct = {
          ...product,
          url: result.url,
          colors: result.colors.map(color => ({
            name: color.name,
            value: color.value,
            iconUrl: color.iconUrl,
            hex: getColorHex(color.name)
          })),
          sizes: result.sizes.map(size => ({
            name: size.name,
            value: size.value,
            available: size.available
          }))
        };

        setProductData(updatedProduct);
      } else {
        throw new Error(result.error || 'Failed to fetch Uniqlo data');
      }
    } catch (err) {
      console.error('Error loading Uniqlo data:', err);
      setUniqloError(err.message);
      // Fallback to basic product data
      setProductData(product);
    } finally {
      setIsLoadingUniqlo(false);
    }
  };

  const getColorHex = (colorName) => {
    const colorMap = {
      'WHITE': '#FFFFFF',
      'GRAY': '#9CA3AF',
      'DARK GRAY': '#4B5563',
      'BLACK': '#000000',
      'RED': '#EF4444',
      'ORANGE': '#F97316',
      'GREEN': '#10B981',
      'BLUE': '#3B82F6',
      'NAVY': '#1E40AF',
      'YELLOW': '#FCD34D',
      'PINK': '#EC4899',
      'PURPLE': '#A855F7',
      'BROWN': '#92400E',
    };

    const normalizedName = colorName.toUpperCase();
    for (const [key, value] of Object.entries(colorMap)) {
      if (normalizedName.includes(key)) {
        return value;
      }
    }
    return '#9CA3AF';
  };

  const handleConfirm = () => {
    if (!selectedColor || !selectedSize) {
      alert('Please select both color and size');
      return;
    }

    onConfirm({
      product: productData,
      color: selectedColor,
      size: selectedSize,
      quantity,
    });
  };

  const availableColors = productData.colors || [
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Blue', hex: '#3B82F6' },
    { name: 'Red', hex: '#EF4444' },
  ];

  // Support both string array and object array (with availability) for sizes
  const availableSizes = productData.sizes || ['XS', 'S', 'M', 'L', 'XL'];
  const isObjectSizes = availableSizes.length > 0 && typeof availableSizes[0] === 'object';

  return (
    <div className="flex flex-col h-full relative">
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
            <h2 className="text-lg font-bold text-white">Product Details</h2>
            <p className="text-xs text-white/60">Customize your selection</p>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Product Image & Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl overflow-hidden backdrop-blur-xl bg-white/10 border border-white/20"
        >
          <div className="aspect-video bg-white/5 flex items-center justify-center overflow-hidden">
            <img
              src={productData.image}
              alt={productData.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23667" width="100" height="100"/%3E%3Ctext x="50" y="50" text-anchor="middle" dominant-baseline="middle" fill="%23fff" font-size="14"%3ENo Image%3C/text%3E%3C/svg%3E';
              }}
            />
          </div>
          <div className="p-4">
            <h3 className="text-white font-bold text-lg">{productData.title}</h3>
            <p className="text-purple-300 text-xl font-bold mt-1">
              {productData.isUniqlo ? 'RM' : '$'}{productData.price}
            </p>
            {productData.description && (
              <p className="text-white/70 text-sm mt-2">{productData.description}</p>
            )}
          </div>
        </motion.div>

        {/* Color Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label className="text-white font-semibold text-sm mb-2 block">
            Select Color
          </label>
          <div className="flex flex-wrap gap-2">
            {availableColors.map((color) => (
              <motion.button
                key={color.name}
                onClick={() => setSelectedColor(color)}
                className={`relative rounded-lg p-3 backdrop-blur-xl border-2 transition-all ${
                  selectedColor?.name === color.name
                    ? 'border-purple-400 bg-white/20'
                    : 'border-white/20 bg-white/5 hover:bg-white/10'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center gap-2">
                  {color.iconUrl ? (
                    <img
                      src={color.iconUrl}
                      alt={color.name}
                      className="w-6 h-6 rounded-full border-2 border-white/30 object-cover"
                    />
                  ) : (
                    <div
                      className="w-6 h-6 rounded-full border-2 border-white/30"
                      style={{
                        backgroundColor: color.hex,
                        boxShadow: color.hex === '#FFFFFF' ? 'inset 0 0 0 1px rgba(0,0,0,0.2)' : 'none',
                      }}
                    />
                  )}
                  <span className="text-white text-sm font-medium">
                    {color.name}
                  </span>
                </div>
                {selectedColor?.name === color.name && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-purple-500 rounded-full p-0.5"
                  >
                    <Check className="w-3 h-3 text-white" />
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Size Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label className="text-white font-semibold text-sm mb-2 block">
            Select Size
          </label>
          <div className="flex flex-wrap gap-2">
            {availableSizes.map((size) => {
              const sizeLabel = isObjectSizes ? size.name : size;
              const sizeValue = isObjectSizes ? size.value : size;
              const isAvailable = isObjectSizes ? size.available : true;
              
              return (
                <motion.button
                  key={sizeLabel}
                  onClick={() => isAvailable && setSelectedSize(isObjectSizes ? size : size)}
                  disabled={!isAvailable}
                  className={`px-4 py-2 rounded-lg backdrop-blur-xl border-2 font-semibold transition-all relative ${
                    selectedSize === size || selectedSize?.name === sizeLabel
                      ? 'border-purple-400 bg-purple-500/30 text-white'
                      : !isAvailable
                      ? 'border-white/10 bg-white/5 text-white/30 cursor-not-allowed line-through'
                      : 'border-white/20 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                  whileHover={isAvailable ? { scale: 1.05 } : {}}
                  whileTap={isAvailable ? { scale: 0.95 } : {}}
                >
                  {sizeLabel}
                  {!isAvailable && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] px-1 rounded-full">
                      Out
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Quantity Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label className="text-white font-semibold text-sm mb-2 block">
            Quantity
          </label>
          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              disabled={quantity <= 1}
            >
              −
            </motion.button>
            <div className="flex-1 text-center">
              <span className="text-white text-2xl font-bold">{quantity}</span>
            </div>
            <motion.button
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              +
            </motion.button>
          </div>
        </motion.div>

        {/* Info Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-start gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-400/30"
        >
          <Info className="w-4 h-4 text-blue-300 mt-0.5 flex-shrink-0" />
          <p className="text-blue-200 text-xs">
            Make sure to select the right color and size. Returns may be subject to terms and conditions.
          </p>
        </motion.div>
      </div>

      {/* Footer Actions */}
      <div className="px-4 pb-4 pt-3 border-t border-white/10 bg-black/20">
        <motion.button
          onClick={handleConfirm}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-all shadow-lg ${
            selectedColor && selectedSize
              ? 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white'
              : 'bg-white/10 text-white/40 cursor-not-allowed'
          }`}
          whileHover={selectedColor && selectedSize ? { scale: 1.02 } : {}}
          whileTap={selectedColor && selectedSize ? { scale: 0.98 } : {}}
          disabled={!selectedColor || !selectedSize}
        >
          {selectedColor && selectedSize ? 'Continue to Confirmation' : 'Select Color & Size'}
        </motion.button>
      </div>

      {/* Loading Overlay for Uniqlo */}
      {isLoadingUniqlo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-50"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Loader2 className="w-12 h-12 text-purple-400" />
          </motion.div>
          <h3 className="text-white font-semibold text-lg mt-4">Loading Uniqlo Data...</h3>
          <p className="text-white/60 text-sm mt-2">Fetching colors and sizes</p>
        </motion.div>
      )}

      {/* Error Notification */}
      {uniqloError && !isLoadingUniqlo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-20 left-4 right-4 bg-red-500/20 border border-red-400/50 rounded-lg p-3 flex items-start gap-2 z-40"
        >
          <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-red-300 text-xs font-semibold">Failed to load live data</p>
            <p className="text-red-200/80 text-xs mt-1">{uniqloError}</p>
          </div>
          <button
            onClick={() => setUniqloError(null)}
            className="text-red-300 hover:text-red-200 text-xs"
          >
            ✕
          </button>
        </motion.div>
      )}

      {/* Uniqlo Badge */}
      {productData.isUniqlo && (
        <div className="absolute top-16 right-4 z-10">
          <div className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg">
            UNIQLO LIVE
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemSelection;

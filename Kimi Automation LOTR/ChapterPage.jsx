import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useJourney } from '../context/JourneyContext';
import { 
  ChevronLeft, ChevronRight, ShoppingCart, Lightbulb, 
  Sparkles, Clock, DollarSign, CheckCircle, X 
} from 'lucide-react';

const ChapterPage = () => {
  const { 
    config, 
    cart, 
    selectedChapters, 
    utils, 
    setCurrentPage, 
    addToCart, 
    removeFromCart 
  } = useJourney();
  
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [hoveredInfo, setHoveredInfo] = useState(null);
  const [pageTurning, setPageTurning] = useState(false);

  const currentChapter = config.chapters[currentChapterIndex];
  const isInCart = utils.isChapterSelected(currentChapter.id);
  const isLastChapter = currentChapterIndex === config.chapters.length - 1;

  // Generate AI suggestions (mock implementation)
  const generateSuggestions = () => {
    const mockSuggestions = [
      {
        title: "Enhanced Integration",
        description: "Consider integrating with your existing CRM for maximum impact",
        impact: "+15% efficiency boost"
      },
      {
        title: "Advanced Analytics",
        description: "Add custom dashboards to track ROI in real-time",
        impact: "Better visibility"
      },
      {
        title: "Team Training",
        description: "Include training sessions for smooth adoption",
        impact: "Faster implementation"
      }
    ];
    setSuggestions(mockSuggestions);
    setShowSuggestions(true);
  };

  const handlePrevious = () => {
    setPageTurning(true);
    
    setTimeout(() => {
      if (currentChapterIndex === 0) {
        setCurrentPage('map');
      } else {
        setCurrentChapterIndex(currentChapterIndex - 1);
      }
      setPageTurning(false);
    }, 500);
  };

  const handleNext = () => {
    setPageTurning(true);
    
    setTimeout(() => {
      if (isLastChapter) {
        setCurrentPage('roi');
      } else {
        setCurrentChapterIndex(currentChapterIndex + 1);
      }
      setPageTurning(false);
    }, 500);
  };

  const handleAddToCart = () => {
    if (isInCart) {
      removeFromCart(currentChapter.id);
    } else {
      addToCart(currentChapter.id);
    }
  };

  // Page turn animation variants
  const pageVariants = {
    initial: { rotateY: 0, opacity: 1 },
    turning: { 
      rotateY: -90, 
      opacity: 0.5,
      transition: { duration: 0.5, ease: "easeInOut" }
    },
    exit: { 
      rotateY: -180, 
      opacity: 0,
      transition: { duration: 0.5, ease: "easeInOut" }
    }
  };

  return (
    <motion.div 
      className="book-page parchment-texture"
      variants={pageVariants}
      initial="initial"
      animate={pageTurning ? "turning" : "initial"}
      exit="exit"
    >
      {/* Sticky chapter banner */}
      <motion.div 
        className="sticky top-0 z-20 bg-parchment-dark border-b-2 border-ink px-6 py-4 shadow-lg"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 20 }}
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold ancient-ink">
            {utils.getFormattedTitle(currentChapter.title)}
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-ink-light">
              {currentChapterIndex + 1} of {config.chapters.length}
            </span>
            <div className="flex gap-1">
              {config.chapters.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentChapterIndex 
                      ? 'bg-gold' 
                      : index < currentChapterIndex 
                        ? 'bg-ink-light' 
                        : 'bg-parchment-light'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Chapter content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Workflow diagram */}
          <div className="lg:col-span-2">
            <motion.div 
              className="bg-parchment-light border-2 border-ink rounded-lg p-6 h-96 flex items-center justify-center relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              {/* Placeholder for workflow diagram */}
              <div className="text-center">
                <div className="w-64 h-64 mx-auto mb-4 bg-gradient-to-br from-gold to-gold-light rounded-lg shadow-lg flex items-center justify-center">
                  <Sparkles className="w-24 h-24 text-ink" />
                </div>
                <p className="text-ink-light italic">
                  Interactive workflow diagram would appear here
                </p>
                <p className="text-sm text-ink-light mt-2">
                  Hover over elements for detailed information
                </p>
              </div>

              {/* Hover info tooltips */}
              <AnimatePresence>
                {hoveredInfo && (
                  <motion.div 
                    className="absolute top-4 right-4 bg-parchment-dark border border-ink rounded-lg p-3 max-w-xs"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <p className="text-sm text-ink-light">{hoveredInfo}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Summary */}
            <motion.div 
              className="mt-6 p-6 bg-parchment-light border-l-4 border-gold rounded-r-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-xl font-bold mb-3 ancient-ink">Journey Summary</h3>
              <p className="text-ink-light text-lg leading-relaxed">
                {currentChapter.summaryOneLiner}
              </p>
            </motion.div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            {/* Key Tools */}
            <motion.div 
              className="bg-parchment-light border-2 border-ink rounded-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-xl font-bold mb-4 ancient-ink flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-gold" />
                Key Arsenal
              </h3>
              <div className="space-y-3">
                {currentChapter.tools.map((tool, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-3 p-3 bg-parchment rounded-lg border border-ink-light hover:bg-parchment-dark transition-colors"
                    onMouseEnter={() => setHoveredInfo(`Powerful ${tool} integration`)}
                    onMouseLeave={() => setHoveredInfo(null)}
                  >
                    <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center">
                      <span className="text-ink text-xs font-bold">
                        {tool.split(' ').map(word => word[0]).join('')}
                      </span>
                    </div>
                    <span className="text-ink-light font-medium">{tool}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Pricing & Savings */}
            <motion.div 
              className="bg-parchment-light border-2 border-ink rounded-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-xl font-bold mb-4 ancient-ink">Treasure Metrics</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-parchment rounded-lg">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-gold" />
                    <span className="text-ink-light">Investment</span>
                  </div>
                  <span className="font-bold text-ink">
                    ${currentChapter.pricing.costUSD.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-parchment rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-ember" />
                    <span className="text-ink-light">Implementation</span>
                  </div>
                  <span className="font-bold text-ink">
                    {currentChapter.pricing.implHours}h
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-parchment rounded-lg">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-gold" />
                    <span className="text-ink-light">Weekly Savings</span>
                  </div>
                  <span className="font-bold text-gold">
                    {currentChapter.savings.hoursPerWeek}h
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-parchment rounded-lg border-2 border-gold">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-gold" />
                    <span className="text-ink-light font-bold">Annual ROI</span>
                  </div>
                  <span className="font-bold text-gold text-lg">
                    ${currentChapter.savings.dollarsPerYear.toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Navigation buttons */}
        <motion.div 
          className="flex justify-between items-center pt-8 border-t-2 border-ink-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <button
            onClick={handlePrevious}
            className="fantasy-button-secondary flex items-center gap-2 px-6 py-3"
            disabled={pageTurning}
          >
            <ChevronLeft className="w-5 h-5" />
            {currentChapterIndex === 0 ? 'Return to Map' : 'Previous Chapter'}
          </button>

          <div className="flex gap-4">
            <button
              onClick={generateSuggestions}
              className="fantasy-button flex items-center gap-2 px-6 py-3"
              disabled={pageTurning}
            >
              <Lightbulb className="w-5 h-5" />
              Suggestions
            </button>

            <button
              onClick={handleAddToCart}
              className={`fantasy-button flex items-center gap-2 px-6 py-3 ${
                isInCart ? 'bg-ember hover:bg-ember-glow' : ''
              }`}
              disabled={pageTurning}
            >
              <ShoppingCart className="w-5 h-5" />
              {isInCart ? 'Remove from Quest' : 'Add to Quest'}
              {isInCart && <CheckCircle className="w-5 h-5" />}
            </button>

            <button
              onClick={handleNext}
              className={`fantasy-button flex items-center gap-2 px-6 py-3 ${
                isLastChapter ? 'bg-gold-light animate-glow' : ''
              }`}
              disabled={pageTurning}
            >
              {isLastChapter ? 'View Treasury' : 'Next Chapter'}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Suggestions modal */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-parchment border-4 border-gold rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold ancient-ink flex items-center gap-2">
                    <Lightbulb className="w-6 h-6 text-gold" />
                    AI Suggestions
                  </h3>
                  <button
                    onClick={() => setShowSuggestions(false)}
                    className="text-ink-light hover:text-ink"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  {suggestions.map((suggestion, index) => (
                    <motion.div 
                      key={index} 
                      className="bg-parchment-light border-2 border-ink rounded-lg p-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <h4 className="text-lg font-bold mb-2 ancient-ink">
                        {suggestion.title}
                      </h4>
                      <p className="text-ink-light mb-2">
                        {suggestion.description}
                      </p>
                      <div className="flex items-center gap-2 text-gold font-bold">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-sm">{suggestion.impact}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <div className="mt-6 text-center">
                  <button
                    onClick={() => setShowSuggestions(false)}
                    className="fantasy-button px-6 py-2"
                  >
                    Continue Journey
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ChapterPage;
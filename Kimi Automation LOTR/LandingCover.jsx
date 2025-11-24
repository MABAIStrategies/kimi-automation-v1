import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useJourney } from '../context/JourneyContext';
import { BookOpen, Sparkles, ArrowRight } from 'lucide-react';

const LandingCover = () => {
  const { config, utils, setCurrentPage, setViewerName } = useJourney();
  const [showNameInput, setShowNameInput] = useState(false);
  const [tempName, setTempName] = useState('');
  const [bookOpening, setBookOpening] = useState(false);

  const handleBeginJourney = () => {
    setBookOpening(true);
    
    // Play book opening sound (placeholder)
    const audio = new Audio('/sounds/book-open.mp3');
    audio.volume = 0.3;
    audio.play().catch(() => {});
    
    setTimeout(() => {
      setCurrentPage('map');
    }, 1500);
  };

  const handleNameSubmit = () => {
    if (tempName.trim()) {
      setViewerName(tempName.trim());
      setShowNameInput(false);
    }
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center">
      {/* Ancient book cover background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-900 via-amber-800 to-amber-900">
        <div className="absolute inset-0 opacity-30">
          <div className="w-full h-full" style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(139, 69, 19, 0.4) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(160, 82, 45, 0.4) 0%, transparent 50%),
              repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(139, 69, 19, 0.1) 2px, rgba(139, 69, 19, 0.1) 4px)
            `
          }} />
        </div>
      </div>

      {/* Company banner */}
      <motion.div 
        className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <div className="bg-gradient-to-r from-gold to-gold-light px-8 py-3 rounded-lg shadow-2xl transform rotate-1">
          <p className="text-ink font-bold text-lg">
            This adventure is brought to you by {config.brand.companyName}
          </p>
        </div>
      </motion.div>

      {/* Main content */}
      <motion.div 
        className="relative z-10 text-center max-w-4xl mx-auto px-8"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        {/* Book icon */}
        <motion.div 
          className="mb-8 flex justify-center"
          animate={{ 
            rotateY: bookOpening ? -180 : 0,
            scale: bookOpening ? 1.2 : 1
          }}
          transition={{ duration: 1.5, type: "spring" }}
        >
          <BookOpen className="w-24 h-24 text-gold" />
        </motion.div>

        {/* Main title */}
        <h1 className="text-6xl md:text-7xl font-bold mb-6 ancient-ink">
          <span className="gold-glow">{utils.getFormattedTitle(config.viewer.firstNamePlaceholder)}</span>
        </h1>
        
        <h2 className="text-3xl md:text-4xl mb-8 ancient-ink opacity-90">
          your AI automation journey starts here
        </h2>

        <p className="text-xl md:text-2xl mb-12 ancient-ink opacity-80 max-w-2xl mx-auto leading-relaxed">
          Make haste, the competition is catching up! Embark on an epic quest through 
          the realms of artificial intelligence and discover treasures of efficiency 
          and growth for your enterprise.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <motion.button
            onClick={handleBeginJourney}
            disabled={bookOpening}
            className="fantasy-button text-xl px-8 py-4 flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Sparkles className="w-6 h-6" />
            Begin Your Adventure
            <ArrowRight className="w-6 h-6" />
          </motion.button>

          <motion.button
            onClick={() => setShowNameInput(true)}
            className="fantasy-button-secondary text-lg px-6 py-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Customize Name
          </motion.button>
        </div>
      </motion.div>

      {/* Name input modal */}
      <AnimatePresence>
        {showNameInput && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-parchment p-8 rounded-lg shadow-2xl max-w-md w-full mx-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h3 className="text-2xl font-bold mb-4 ancient-ink">Enter Your Name</h3>
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="Your name here..."
                className="w-full p-3 border-2 border-ink rounded-lg mb-4 text-ink bg-parchment-light"
                onKeyPress={(e) => e.key === 'Enter' && handleNameSubmit()}
              />
              <div className="flex gap-3">
                <button
                  onClick={handleNameSubmit}
                  className="fantasy-button flex-1"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowNameInput(false)}
                  className="fantasy-button-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative elements */}
      <motion.div 
        className="absolute bottom-8 left-8 text-gold opacity-60"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <Sparkles className="w-8 h-8" />
      </motion.div>

      <motion.div 
        className="absolute bottom-8 right-8 text-gold opacity-60"
        animate={{ rotate: [360, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      >
        <Sparkles className="w-8 h-8" />
      </motion.div>
    </div>
  );
};

export default LandingCover;
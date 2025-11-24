import React, { useState, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float, Sphere, MeshDistortMaterial } from '@react-three/drei';
import { useJourney } from '../context/JourneyContext';
import { MapPin, Sparkles, Flame, HelpCircle } from 'lucide-react';

// 3D Map Location Component
function MapLocation({ position, chapter, onClick, isSelected, isHovered }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group position={position}>
        {/* Main sphere */}
        <Sphere ref={meshRef} args={[0.3, 32, 32]} onClick={onClick}>
          <MeshDistortMaterial
            color={isSelected ? '#d4af37' : isHovered ? '#ff6b35' : '#2c1810'}
            attach="material"
            distort={0.2}
            speed={2}
            roughness={0.1}
            metalness={0.8}
          />
        </Sphere>
        
        {/* Chapter title */}
        <Text
          position={[0, 0.8, 0]}
          fontSize={0.15}
          color="#2c1810"
          anchorX="center"
          anchorY="middle"
          font="/fonts/cinzel.woff"
        >
          {chapter.title.split(':')[0]}
        </Text>
        
        {/* Glowing ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.4, 0.45, 32]} />
          <meshBasicMaterial 
            color={isSelected ? '#d4af37' : '#ff6b35'} 
            transparent 
            opacity={isHovered || isSelected ? 0.8 : 0.3} 
          />
        </mesh>
        
        {/* Sparkle effect */}
        {(isHovered || isSelected) && (
          <Sparkles
            count={5}
            scale={[1, 1, 1]}
            size={3}
            speed={0.4}
            position={[0, 0, 0]}
          />
        )}
      </group>
    </Float>
  );
}

// 3D Map Scene
function MapScene({ chapters, selectedChapter, hoveredChapter, onLocationClick }) {
  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#d4af37" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff6b35" />
      
      {/* Map locations */}
      {chapters.map((chapter, index) => {
        const angle = (index / chapters.length) * Math.PI * 2;
        const radius = 2.5;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        return (
          <MapLocation
            key={chapter.id}
            position={[x, 0, z]}
            chapter={chapter}
            onClick={() => onLocationClick(chapter)}
            isSelected={selectedChapter?.id === chapter.id}
            isHovered={hoveredChapter?.id === chapter.id}
          />
        );
      })}
      
      {/* Central magical orb */}
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <Sphere args={[0.2, 32, 32]} position={[0, 0, 0]}>
          <MeshDistortMaterial
            color="#d4af37"
            attach="material"
            distort={0.3}
            speed={3}
            roughness={0}
            metalness={1}
            emissive="#d4af37"
            emissiveIntensity={0.2}
          />
        </Sphere>
      </Float>
    </>
  );
}

const TitleMap = () => {
  const { config, utils, setCurrentPage, addToCart } = useJourney();
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [hoveredChapter, setHoveredChapter] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [mapBurning, setMapBurning] = useState(false);

  const handleLocationClick = (chapter) => {
    setSelectedChapter(chapter);
    setShowConfirmModal(true);
  };

  const handleConfirmJourney = () => {
    setMapBurning(true);
    
    // Play map burn sound
    const audio = new Audio('/sounds/map-burn.mp3');
    audio.volume = 0.4;
    audio.play().catch(() => {});
    
    // Add chapter to cart
    if (selectedChapter) {
      addToCart(selectedChapter.id);
    }
    
    setTimeout(() => {
      setCurrentPage('chapter');
    }, 2000);
  };

  return (
    <div className="relative w-full h-screen">
      {/* Parchment background with fire glow */}
      <div className={`absolute inset-0 bg-gradient-to-br from-parchment to-parchment-dark transition-all duration-2000 ${
        mapBurning ? 'animate-map-burn' : ''
      }`}>
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: `
              radial-gradient(circle at 50% 50%, rgba(255, 107, 53, 0.3) 0%, transparent 70%),
              radial-gradient(circle at 20% 80%, rgba(255, 140, 66, 0.2) 0%, transparent 50%)
            `
          }} />
        </div>
      </div>

      {/* Ambient ember crackle audio */}
      <audio autoPlay loop volume={0.2}>
        <source src="/sounds/ember-crackle.mp3" type="audio/mpeg" />
      </audio>

      {/* Chapter info panel */}
      <AnimatePresence>
        {hoveredChapter && (
          <motion.div 
            className="absolute top-8 left-8 bg-parchment-dark border-2 border-ink rounded-lg p-4 max-w-sm z-20"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h3 className="text-xl font-bold mb-2 ancient-ink">{hoveredChapter.title}</h3>
            <p className="text-ink-light mb-3">{hoveredChapter.summaryOneLiner}</p>
            <div className="space-y-2">
              {hoveredChapter.hoverInfo.map((info, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <Sparkles className="w-4 h-4 text-gold" />
                  <span className="text-ink-light">{info}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-ink-light">
              <p className="text-sm font-bold text-gold">
                Investment: ${hoveredChapter.pricing.costUSD.toLocaleString()}
              </p>
              <p className="text-sm text-ink-light">
                Annual Savings: ${hoveredChapter.savings.dollarsPerYear.toLocaleString()}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions */}
      <motion.div 
        className="absolute top-8 right-8 bg-parchment-dark border-2 border-ink rounded-lg p-4 max-w-xs z-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <HelpCircle className="w-5 h-5 text-gold" />
          <h4 className="font-bold ancient-ink">How to Navigate</h4>
        </div>
        <ul className="text-sm text-ink-light space-y-1">
          <li>• Hover over locations to preview</li>
          <li>• Click to begin your journey</li>
          <li>• Each chapter unlocks new powers</li>
        </ul>
      </motion.div>

      {/* 3D Map */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 2, 8], fov: 60 }}
          style={{ background: 'transparent' }}
        >
          <Suspense fallback={null}>
            <MapScene
              chapters={config.chapters}
              selectedChapter={selectedChapter}
              hoveredChapter={hoveredChapter}
              onLocationClick={handleLocationClick}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Map title */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold ancient-ink mb-2">
          The <span className="gold-glow">Automation</span> Realm
        </h1>
        <p className="text-lg text-ink-light">
          Choose your path wisely, {utils.getFormattedTitle(config.viewer.firstNamePlaceholder)}
        </p>
      </motion.div>

      {/* Confirmation modal */}
      <AnimatePresence>
        {showConfirmModal && selectedChapter && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-parchment border-4 border-gold rounded-lg p-8 max-w-md mx-4 text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <Flame className="w-16 h-16 text-ember mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4 ancient-ink">
                Begin {selectedChapter.title}?
              </h3>
              <p className="text-ink-light mb-6">
                {selectedChapter.summaryOneLiner}
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="fantasy-button-secondary flex-1 py-3"
                >
                  Not Yet
                </button>
                <button
                  onClick={handleConfirmJourney}
                  className="fantasy-button flex-1 py-3"
                >
                  Begin Adventure
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TitleMap;
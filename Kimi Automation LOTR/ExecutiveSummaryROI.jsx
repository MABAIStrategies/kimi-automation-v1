import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useJourney } from '../context/JourneyContext';
import { 
  ChevronLeft, Lightbulb, DollarSign, Clock, TrendingUp, 
  Package, Sparkles, CheckCircle, X, Calculator, Info 
} from 'lucide-react';

const ExecutiveSummaryROI = () => {
  const { 
    config, 
    roiInputs, 
    selectedPackage, 
    cart, 
    utils, 
    setCurrentPage, 
    updateRoiInputs, 
    selectPackage 
  } = useJourney();
  
  const [showTreasureAnimation, setShowTreasureAnimation] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showAssumptions, setShowAssumptions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const roiData = utils.calculateROI();

  // Generate AI value suggestions
  const generateValueSuggestions = () => {
    const mockSuggestions = [
      {
        title: "Scale Your Team",
        description: "Consider expanding automation to additional departments",
        value: "+$25,000 annual savings potential"
      },
      {
        title: "Advanced Analytics",
        description: "Implement predictive analytics for proactive optimization",
        value: "15% efficiency improvement"
      },
      {
        title: "Integration Expansion",
        description: "Connect with more tools in your tech stack",
        value: "Streamlined workflows"
      }
    ];
    setSuggestions(mockSuggestions);
    setShowSuggestions(true);
  };

  const handleProceedToCheckout = () => {
    setShowTreasureAnimation(true);
    
    // Play treasure sound
    const audio = new Audio('/sounds/treasure-erupt.mp3');
    audio.volume = 0.5;
    audio.play().catch(() => {});
    
    setTimeout(() => {
      setCurrentPage('checkout');
    }, 3000);
  };

  // ROI Tile Component
  const ROITile = ({ icon: Icon, title, value, subtitle, color, delay }) => (
    <motion.div 
      className={`bg-parchment-light border-2 border-ink rounded-lg p-6 text-center relative overflow-hidden ${
        color === 'gold' ? 'border-gold' : color === 'ember' ? 'border-ember' : ''
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <div className="flex justify-center mb-3">
        <Icon className={`w-8 h-8 ${color === 'gold' ? 'text-gold' : color === 'ember' ? 'text-ember' : 'text-ink'}`} />
      </div>
      <h3 className="text-lg font-bold mb-2 ancient-ink">{title}</h3>
      <p className={`text-2xl font-bold mb-1 ${
        color === 'gold' ? 'text-gold' : color === 'ember' ? 'text-ember' : 'text-ink'
      }`}>
        {value}
      </p>
      <p className="text-sm text-ink-light">{subtitle}</p>
      
      {/* Decorative sparkles */}
      <Sparkles className="absolute top-2 right-2 w-4 h-4 text-gold opacity-50" />
    </motion.div>
  );

  return (
    <div className="book-page parchment-texture overflow-y-auto">
      {/* Treasure eruption animation */}
      <AnimatePresence>
        {showTreasureAnimation && (
          <motion.div 
            className="fixed inset-0 z-50 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gold via-ember to-gold opacity-30" />
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-4 h-4 bg-gold rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  scale: [0, 1.5, 0],
                  opacity: [0, 1, 0],
                  y: [-100, -200],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.1,
                  ease: "easeOut",
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="gold-glow">Treasury</span> <span className="ancient-ink">Report</span>
          </h1>
          <p className="text-xl text-ink-light max-w-2xl mx-auto">
            Behold, {utils.getFormattedTitle(config.viewer.firstNamePlaceholder)}! Your automation quest yields magnificent treasures.
          </p>
        </motion.div>

        {/* ROI Tiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <ROITile
            icon={Clock}
            title="Time Saved"
            value={`${roiData.totalHoursSaved}h/week`}
            subtitle="Across all automations"
            color="ember"
            delay={0.1}
          />
          <ROITile
            icon={DollarSign}
            title="Annual ROI"
            value={`$${roiData.totalAnnualSavings.toLocaleString()}`}
            subtitle="Projected savings"
            color="gold"
            delay={0.2}
          />
          <ROITile
            icon={TrendingUp}
            title="Payback Period"
            value={`${roiData.paybackPeriod} months`}
            subtitle="Time to break even"
            color="ink"
            delay={0.3}
          />
          <ROITile
            icon={Package}
            title="Implementation"
            value={`${roiData.implementationTime}h`}
            subtitle="Total setup time"
            color="ember"
            delay={0.4}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ROI Calculator */}
          <div className="lg:col-span-2 space-y-8">
            {/* Interactive Calculator */}
            <motion.div 
              className="bg-parchment-light border-2 border-ink rounded-lg p-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Calculator className="w-6 h-6 text-gold" />
                <h2 className="text-2xl font-bold ancient-ink">ROI Calculator</h2>
              </div>
              
              <div className="space-y-6">
                {config.roi.sliders.map((slider) => (
                  <div key={slider.id}>
                    <div className="flex justify-between items-center mb-2">
                      <label className="font-medium ancient-ink">{slider.label}</label>
                      <span className="font-bold text-gold">
                        {slider.id === 'avgHourlyCost' ? '$' : ''}
                        {roiInputs[slider.id]}
                        {slider.id === 'hoursSavedPerWeek' ? 'h/week' : ''}
                        {slider.id === 'teamSize' ? ' people' : ''}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={slider.min}
                      max={slider.max}
                      step={slider.step}
                      value={roiInputs[slider.id]}
                      onChange={(e) => updateRoiInputs({ [slider.id]: parseInt(e.target.value) })}
                      className="w-full h-2 bg-parchment-dark rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-sm text-ink-light mt-1">
                      <span>{slider.min}{slider.id === 'avgHourlyCost' ? '$' : ''}</span>
                      <span>{slider.max}{slider.id === 'avgHourlyCost' ? '$' : ''}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Key Benefits */}
            <motion.div 
              className="bg-parchment-light border-2 border-ink rounded-lg p-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h3 className="text-xl font-bold mb-4 ancient-ink flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-gold" />
                Key Benefits
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "85% reduction in manual errors",
                  "24/7 automated processing",
                  "Scalable without overhead",
                  "Improved data accuracy",
                  "Enhanced team productivity",
                  "Real-time insights & analytics"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-gold" />
                    <span className="text-ink-light">{benefit}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* ROI Projection Table */}
            <motion.div 
              className="bg-parchment-light border-2 border-ink rounded-lg p-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <h3 className="text-xl font-bold mb-4 ancient-ink">3-Year Projection</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-ink-light">
                      <th className="text-left py-2 ancient-ink">Year</th>
                      <th className="text-right py-2 ancient-ink">Investment</th>
                      <th className="text-right py-2 ancient-ink">Savings</th>
                      <th className="text-right py-2 ancient-ink">Net ROI</th>
                      <th className="text-right py-2 ancient-ink">Cumulative</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3].map((year) => {
                      const yearlySavings = roiData.totalAnnualSavings;
                      const maintenance = roiData.totalImplementationCost * 0.1;
                      const netSavings = yearlySavings - (year === 1 ? roiData.totalImplementationCost : maintenance);
                      const cumulative = yearlySavings * year - roiData.totalImplementationCost - (maintenance * (year - 1));
                      
                      return (
                        <tr key={year} className="border-b border-ink-light">
                          <td className="py-2 font-medium">Year {year}</td>
                          <td className="text-right py-2">
                            ${(year === 1 ? roiData.totalImplementationCost : maintenance).toLocaleString()}
                          </td>
                          <td className="text-right py-2 text-gold font-bold">
                            ${yearlySavings.toLocaleString()}
                          </td>
                          <td className="text-right py-2 text-ember font-bold">
                            ${netSavings.toLocaleString()}
                          </td>
                          <td className="text-right py-2 font-bold">
                            ${cumulative.toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            {/* Package Selection */}
            <motion.div 
              className="bg-parchment-light border-2 border-ink rounded-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h3 className="text-xl font-bold mb-4 ancient-ink">Choose Your Package</h3>
              <div className="space-y-4">
                {config.packages.map((pkg) => (
                  <div
                    key={pkg.tier}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedPackage?.tier === pkg.tier
                        ? 'border-gold bg-gold bg-opacity-10'
                        : 'border-ink-light hover:border-gold'
                    }`}
                    onClick={() => selectPackage(pkg)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-lg ancient-ink">{pkg.tier}</h4>
                      <span className="text-xl font-bold text-gold">
                        ${pkg.priceUSD.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-ink-light mb-3">{pkg.description}</p>
                    <ul className="text-xs text-ink-light space-y-1">
                      {pkg.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-gold" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div 
              className="bg-parchment-light border-2 border-ink rounded-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <h3 className="text-lg font-bold mb-4 ancient-ink">Quest Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-ink-light">Selected Chapters:</span>
                  <span className="font-bold">{cart.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-light">Total Investment:</span>
                  <span className="font-bold text-gold">
                    ${roiData.totalImplementationCost.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-light">ROI:</span>
                  <span className="font-bold text-ember">
                    {roiData.roiPercentage}%
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Methodology */}
            <motion.div 
              className="bg-parchment-light border-2 border-ink rounded-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <button
                onClick={() => setShowAssumptions(!showAssumptions)}
                className="flex items-center gap-2 w-full text-left"
              >
                <Info className="w-5 h-5 text-gold" />
                <span className="font-bold ancient-ink">Methodology</span>
              </button>
              
              <AnimatePresence>
                {showAssumptions && (
                  <motion.div 
                    className="mt-4 text-sm text-ink-light space-y-2"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                  >
                    <p>• 48 working weeks per year</p>
                    <p>• 20% implementation buffer</p>
                    <p>• 10% annual maintenance</p>
                    <p>• Conservative efficiency gains</p>
                    <p>• Market-standard hourly rates</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        {/* Action buttons */}
        <motion.div 
          className="flex justify-between items-center mt-12 pt-8 border-t-2 border-ink-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <button
            onClick={() => setCurrentPage('chapter')}
            className="fantasy-button-secondary flex items-center gap-2 px-6 py-3"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Journey
          </button>

          <div className="flex gap-4">
            <button
              onClick={generateValueSuggestions}
              className="fantasy-button flex items-center gap-2 px-6 py-3"
            >
              <Lightbulb className="w-5 h-5" />
              Value Suggestions
            </button>

            <button
              onClick={handleProceedToCheckout}
              disabled={!selectedPackage && cart.length === 0}
              className="fantasy-button flex items-center gap-2 px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-5 h-5" />
              Claim Your Treasure
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
                    Value Optimization Suggestions
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
                        <span className="text-sm">{suggestion.value}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <div className="mt-6 text-center">
                  <button
                    onClick={() => setShowSuggestions(false)}
                    className="fantasy-button px-6 py-2"
                  >
                    Continue to Checkout
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExecutiveSummaryROI;
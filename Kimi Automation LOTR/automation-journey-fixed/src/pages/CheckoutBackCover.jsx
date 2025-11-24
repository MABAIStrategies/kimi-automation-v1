import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useJourney } from '../context/JourneyContext';
import { 
  CheckCircle, CreditCard, ShoppingCart, Sparkles, 
  Trophy, Star, ArrowRight, X, Package, DollarSign,
  TrendingUp
} from 'lucide-react';

const CheckoutBackCover = () => {
  const { 
    config, 
    cart, 
    selectedPackage, 
    utils, 
    resetJourney 
  } = useJourney();
  
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showHeroReturn, setShowHeroReturn] = useState(false);

  const roiData = utils.calculateROI();
  const totalCost = selectedPackage ? selectedPackage.priceUSD : roiData.totalImplementationCost;

  const handlePayment = async () => {
    setPaymentProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setPaymentProcessing(false);
    setPaymentSuccess(true);
    
    // Play success sound
    const audio = new Audio('/sounds/success-fanfare.mp3');
    audio.volume = 0.6;
    audio.play().catch(() => {});
    
    setTimeout(() => {
      setShowHeroReturn(true);
    }, 2000);
  };

  const handleRestartJourney = () => {
    resetJourney();
  };

  // Hero return animation variants
  const heroVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring",
        damping: 15,
        stiffness: 200
      }
    }
  };

  const starVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        type: "spring",
        damping: 10
      }
    })
  };

  if (showHeroReturn) {
    return (
      <motion.div 
        className="relative w-full h-screen flex items-center justify-center bg-gradient-to-br from-gold via-ember to-gold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="absolute inset-0 opacity-30">
          <div className="w-full h-full" style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.2) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.2) 0%, transparent 50%)
            `
          }} />
        </div>

        {/* Floating stars */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-white"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={starVariants}
          >
            <Star className="w-6 h-6" />
          </motion.div>
        ))}

        <motion.div 
          className="text-center z-10 max-w-4xl mx-auto px-8"
          variants={heroVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="mb-8 flex justify-center"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Trophy className="w-32 h-32 text-white" />
          </motion.div>

          <h1 className="text-6xl md:text-8xl font-bold mb-6 text-white text-shadow-lg">
            HERO'S <span className="gold-glow">RETURN</span>
          </h1>
          
          <p className="text-2xl md:text-3xl mb-8 text-white opacity-90">
            Congratulations, {utils.getFormattedTitle(config.viewer.firstNamePlaceholder)}!
          </p>

          <p className="text-xl mb-12 text-white opacity-80 max-w-2xl mx-auto">
            You have successfully claimed your automation treasures and are ready to transform your enterprise. 
            Your journey to efficiency and growth begins now!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-2xl font-bold mb-2 text-white">Investment Secured</h3>
              <p className="text-3xl font-bold text-gold">
                ${totalCost.toLocaleString()}
              </p>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-2xl font-bold mb-2 text-white">Annual Savings</h3>
              <p className="text-3xl font-bold text-gold">
                ${roiData.totalAnnualSavings.toLocaleString()}
              </p>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-2xl font-bold mb-2 text-white">ROI</h3>
              <p className="text-3xl font-bold text-gold">
                {roiData.roiPercentage}%
              </p>
            </div>
          </div>

          <motion.button
            onClick={handleRestartJourney}
            className="fantasy-button text-xl px-8 py-4 flex items-center gap-3 mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Begin New Adventure
            <ArrowRight className="w-6 h-6" />
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="book-page parchment-texture overflow-y-auto">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gold-glow">Claim</span> <span className="ancient-ink">Your Treasure</span>
          </h1>
          <p className="text-lg text-ink-light">
            Finalize your automation quest and secure your enterprise transformation
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Selected Items */}
            <motion.div 
              className="bg-parchment-light border-2 border-ink rounded-lg p-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <ShoppingCart className="w-6 h-6 text-gold" />
                <h2 className="text-2xl font-bold ancient-ink">Quest Summary</h2>
              </div>

              {selectedPackage ? (
                <div className="bg-gradient-to-r from-gold to-gold-light border-2 border-gold-dark rounded-lg p-6 mb-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-ink mb-2">
                        {selectedPackage.tier} Package
                      </h3>
                      <p className="text-ink-light text-sm mb-3">
                        {selectedPackage.description}
                      </p>
                      <ul className="text-xs text-ink space-y-1">
                        {selectedPackage.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <span className="text-2xl font-bold text-ink">
                      ${selectedPackage.priceUSD.toLocaleString()}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-parchment rounded-lg border border-ink-light">
                      <div>
                        <h4 className="font-bold ancient-ink">{item.title}</h4>
                        <p className="text-sm text-ink-light">
                          Annual Savings: ${item.savings.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gold">
                          ${item.price.toLocaleString()}
                        </p>
                        <p className="text-sm text-ink-light">
                          {item.hoursSaved}h/week saved
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* ROI Summary */}
            <motion.div 
              className="bg-parchment-light border-2 border-ink rounded-lg p-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-6 h-6 text-ember" />
                <h3 className="text-xl font-bold ancient-ink">Expected Rewards</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-parchment rounded-lg">
                  <DollarSign className="w-8 h-8 text-gold mx-auto mb-2" />
                  <p className="text-sm text-ink-light">Annual Savings</p>
                  <p className="text-xl font-bold text-gold">
                    ${roiData.totalAnnualSavings.toLocaleString()}
                  </p>
                </div>
                <div className="text-center p-4 bg-parchment rounded-lg">
                  <TrendingUp className="w-8 h-8 text-ember mx-auto mb-2" />
                  <p className="text-sm text-ink-light">ROI</p>
                  <p className="text-xl font-bold text-ember">
                    {roiData.roiPercentage}%
                  </p>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-gradient-to-r from-gold to-gold-light rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-ink">Payback Period:</span>
                  <span className="text-xl font-bold text-ink">
                    {roiData.paybackPeriod} months
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Payment Form */}
            <motion.div 
              className="bg-parchment-light border-2 border-ink rounded-lg p-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="w-6 h-6 text-gold" />
                <h3 className="text-xl font-bold ancient-ink">Payment Details</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 ancient-ink">Card Number</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full p-3 border-2 border-ink-light rounded-lg bg-parchment focus:border-gold focus:outline-none"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 ancient-ink">Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full p-3 border-2 border-ink-light rounded-lg bg-parchment focus:border-gold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 ancient-ink">CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full p-3 border-2 border-ink-light rounded-lg bg-parchment focus:border-gold focus:outline-none"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 ancient-ink">Cardholder Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full p-3 border-2 border-ink-light rounded-lg bg-parchment focus:border-gold focus:outline-none"
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            {/* Order Total */}
            <motion.div 
              className="bg-parchment-light border-2 border-ink rounded-lg p-6 sticky top-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-xl font-bold mb-4 ancient-ink">Order Total</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-ink-light">Subtotal:</span>
                  <span className="font-medium">
                    ${totalCost.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-light">Implementation:</span>
                  <span className="font-medium text-gold">Included</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-light">Support:</span>
                  <span className="font-medium text-gold">12 months</span>
                </div>
                <div className="border-t border-ink-light pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold ancient-ink">Total:</span>
                    <span className="text-2xl font-bold text-gold">
                      ${totalCost.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={paymentProcessing}
                className="w-full fantasy-button text-lg py-4 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {paymentProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-ink"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Secure Your Quest
                  </>
                )}
              </button>

              <div className="mt-4 text-center">
                <div className="flex items-center justify-center gap-2 text-sm text-ink-light">
                  <CheckCircle className="w-4 h-4 text-gold" />
                  <span>SSL Encrypted Payment</span>
                </div>
              </div>
            </motion.div>

            {/* Guarantee */}
            <motion.div 
              className="bg-parchment-light border-2 border-ink rounded-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="text-center">
                <Package className="w-12 h-12 text-gold mx-auto mb-3" />
                <h4 className="font-bold ancient-ink mb-2">Satisfaction Guarantee</h4>
                <p className="text-sm text-ink-light">
                  30-day money-back guarantee if you're not completely satisfied with your automation journey.
                </p>
              </div>
            </motion.div>

            {/* Support */}
            <motion.div 
              className="bg-parchment-light border-2 border-ink rounded-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="text-center">
                <Sparkles className="w-12 h-12 text-ember mx-auto mb-3" />
                <h4 className="font-bold ancient-ink mb-2">Premium Support</h4>
                <p className="text-sm text-ink-light">
                  Dedicated implementation team and 24/7 technical support included with your quest.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Payment Processing Modal */}
      <AnimatePresence>
        {paymentProcessing && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-parchment border-4 border-gold rounded-lg p-8 text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-gold mx-auto mb-4"></div>
              <h3 className="text-2xl font-bold mb-2 ancient-ink">Processing Payment</h3>
              <p className="text-ink-light">Securing your automation treasure...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CheckoutBackCover;
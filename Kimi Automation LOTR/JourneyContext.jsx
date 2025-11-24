import React, { createContext, useContext, useReducer, useEffect } from 'react';
import config from '../data/automationJourneyConfig.json';

// Action types
const ActionTypes = {
  SET_VIEWER_NAME: 'SET_VIEWER_NAME',
  ADD_TO_CART: 'ADD_TO_CART',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  UPDATE_ROI_INPUTS: 'UPDATE_ROI_INPUTS',
  SELECT_PACKAGE: 'SELECT_PACKAGE',
  SET_CURRENT_PAGE: 'SET_CURRENT_PAGE',
  SET_SELECTED_CHAPTERS: 'SET_SELECTED_CHAPTERS',
  RESET_JOURNEY: 'RESET_JOURNEY'
};

// Initial state
const initialState = {
  config,
  viewerName: localStorage.getItem('viewerName') || 'Traveler',
  cart: JSON.parse(localStorage.getItem('cart')) || [],
  selectedChapters: JSON.parse(localStorage.getItem('selectedChapters')) || [],
  selectedPackage: JSON.parse(localStorage.getItem('selectedPackage')) || null,
  currentPage: localStorage.getItem('currentPage') || 'landing',
  roiInputs: JSON.parse(localStorage.getItem('roiInputs')) || {
    avgHourlyCost: config.roi.sliders.find(s => s.id === 'avgHourlyCost')?.default || 65,
    hoursSavedPerWeek: config.roi.sliders.find(s => s.id === 'hoursSavedPerWeek')?.default || 15,
    teamSize: config.roi.sliders.find(s => s.id === 'teamSize')?.default || 5
  },
  isLoading: false
};

// Reducer
function journeyReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_VIEWER_NAME:
      return {
        ...state,
        viewerName: action.payload
      };
    
    case ActionTypes.ADD_TO_CART:
      const chapterToAdd = state.config.chapters.find(ch => ch.id === action.payload);
      if (!chapterToAdd) return state;
      
      const newCart = [...state.cart];
      const existingIndex = newCart.findIndex(item => item.id === action.payload);
      
      if (existingIndex === -1) {
        newCart.push({
          id: chapterToAdd.id,
          title: chapterToAdd.title,
          price: chapterToAdd.pricing.costUSD,
          savings: chapterToAdd.savings.dollarsPerYear,
          hoursSaved: chapterToAdd.savings.hoursPerWeek
        });
      }
      
      return {
        ...state,
        cart: newCart
      };
    
    case ActionTypes.REMOVE_FROM_CART:
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload)
      };
    
    case ActionTypes.UPDATE_ROI_INPUTS:
      return {
        ...state,
        roiInputs: {
          ...state.roiInputs,
          ...action.payload
        }
      };
    
    case ActionTypes.SELECT_PACKAGE:
      return {
        ...state,
        selectedPackage: action.payload
      };
    
    case ActionTypes.SET_CURRENT_PAGE:
      return {
        ...state,
        currentPage: action.payload
      };
    
    case ActionTypes.SET_SELECTED_CHAPTERS:
      return {
        ...state,
        selectedChapters: action.payload
      };
    
    case ActionTypes.RESET_JOURNEY:
      return {
        ...initialState,
        viewerName: state.viewerName,
        cart: [],
        selectedChapters: [],
        selectedPackage: null,
        currentPage: 'landing'
      };
    
    default:
      return state;
  }
}

// Context
const JourneyContext = createContext();

// Provider
export function JourneyProvider({ children }) {
  const [state, dispatch] = useReducer(journeyReducer, initialState);
  
  // Persist state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('viewerName', state.viewerName);
    localStorage.setItem('cart', JSON.stringify(state.cart));
    localStorage.setItem('selectedChapters', JSON.stringify(state.selectedChapters));
    localStorage.setItem('selectedPackage', JSON.stringify(state.selectedPackage));
    localStorage.setItem('currentPage', state.currentPage);
    localStorage.setItem('roiInputs', JSON.stringify(state.roiInputs));
  }, [state]);
  
  // Actions
  const actions = {
    setViewerName: (name) => dispatch({ type: ActionTypes.SET_VIEWER_NAME, payload: name }),
    addToCart: (chapterId) => dispatch({ type: ActionTypes.ADD_TO_CART, payload: chapterId }),
    removeFromCart: (chapterId) => dispatch({ type: ActionTypes.REMOVE_FROM_CART, payload: chapterId }),
    updateRoiInputs: (inputs) => dispatch({ type: ActionTypes.UPDATE_ROI_INPUTS, payload: inputs }),
    selectPackage: (packageData) => dispatch({ type: ActionTypes.SELECT_PACKAGE, payload: packageData }),
    setCurrentPage: (page) => dispatch({ type: ActionTypes.SET_CURRENT_PAGE, payload: page }),
    setSelectedChapters: (chapters) => dispatch({ type: ActionTypes.SET_SELECTED_CHAPTERS, payload: chapters }),
    resetJourney: () => dispatch({ type: ActionTypes.RESET_JOURNEY })
  };
  
  // Utility functions
  const utils = {
    // Calculate ROI based on current state
    calculateROI: () => {
      const { roiInputs, cart, selectedPackage, config } = state;
      const { workingWeeksPerYear } = config.roi.assumptions;
      
      // Calculate savings from individual chapters
      const chapterSavings = cart.reduce((total, item) => total + item.savings, 0);
      const chapterHours = cart.reduce((total, item) => total + item.hoursSaved, 0);
      
      // Calculate total annual savings
      const baseSavings = roiInputs.hoursSavedPerWeek * workingWeeksPerYear * roiInputs.avgHourlyCost * roiInputs.teamSize;
      const totalAnnualSavings = baseSavings + chapterSavings;
      
      // Calculate implementation costs
      const individualChapterCosts = cart.reduce((total, item) => total + item.price, 0);
      const packageCost = selectedPackage ? selectedPackage.priceUSD : 0;
      const totalImplementationCost = Math.max(individualChapterCosts, packageCost);
      
      // Calculate metrics
      const paybackPeriod = totalAnnualSavings > 0 ? (totalImplementationCost / (totalAnnualSavings / 12)) : Infinity;
      const roiPercentage = totalImplementationCost > 0 ? ((totalAnnualSavings - totalImplementationCost) / totalImplementationCost) * 100 : 0;
      
      return {
        totalAnnualSavings,
        totalImplementationCost,
        paybackPeriod: Math.round(paybackPeriod * 10) / 10,
        roiPercentage: Math.round(roiPercentage * 10) / 10,
        totalHoursSaved: roiInputs.hoursSavedPerWeek + chapterHours,
        implementationTime: selectedPackage ? 
          Math.max(...selectedPackage.includedChapterIds.map(id => {
            const chapter = config.chapters.find(ch => ch.id === id);
            return chapter ? chapter.pricing.implHours : 0;
          })) : 
          cart.reduce((total, item) => total + (config.chapters.find(ch => ch.id === item.id)?.pricing.implHours || 0), 0)
      };
    },
    
    // Get formatted chapter title with viewer name
    getFormattedTitle: (title) => {
      return title.replace(state.config.viewer.firstNamePlaceholder, state.viewerName);
    },
    
    // Check if chapter is in cart
    isChapterSelected: (chapterId) => {
      return state.cart.some(item => item.id === chapterId);
    },
    
    // Get total cart value
    getCartTotal: () => {
      return state.cart.reduce((total, item) => total + item.price, 0);
    }
  };
  
  return (
    <JourneyContext.Provider value={{ ...state, ...actions, utils }}>
      {children}
    </JourneyContext.Provider>
  );
}

// Hook
export function useJourney() {
  const context = useContext(JourneyContext);
  if (!context) {
    throw new Error('useJourney must be used within a JourneyProvider');
  }
  return context;
}
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { JourneyProvider } from './context/JourneyContext';
import ErrorBoundary from './components/ErrorBoundary';
import AudioManager from './components/AudioManager';
import PageTransition from './components/PageTransition';

const LandingCover = lazy(() => import('./pages/LandingCover'));
const TitleMap = lazy(() => import('./pages/TitleMap'));
const ChapterPage = lazy(() => import('./pages/ChapterPage'));
const ExecutiveSummaryROI = lazy(() => import('./pages/ExecutiveSummaryROI'));
const CheckoutBackCover = lazy(() => import('./pages/CheckoutBackCover'));

// WebGL Support Check
const checkWebGLSupport = () => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return Boolean(gl);
  } catch (e) {
    return false;
  }
};

function App() {
  const [direction, setDirection] = useState(1);
  const [webGLSupported, setWebGLSupported] = useState(true);

  useEffect(() => {
    setWebGLSupported(checkWebGLSupport());
  }, []);

  if (!webGLSupported) {
    return (
      <div className="min-h-screen bg-parchment flex items-center justify-center p-8">
        <div className="ancient-border parchment-texture p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-ink mb-4">Browser Not Supported</h2>
          <p className="text-ink-light">
            Please use a modern browser with WebGL support for the best experience.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <JourneyProvider>
        <AudioManager />
        <Suspense fallback={
          <div className="min-h-screen bg-parchment flex items-center justify-center">
            <div className="loader"></div>
          </div>
        }>
          <PageWrapper direction={direction} />
        </Suspense>
      </JourneyProvider>
    </ErrorBoundary>
  );
}

function PageWrapper({ direction }) {
  return (
    <PageTransition direction={direction}>
      <MainContent />
    </PageTransition>
  );
}

function MainContent() {
  const [currentPage, setCurrentPage] = useState('landing');

  // Listen to custom events from JourneyContext
  useEffect(() => {
    const handlePageChange = (e) => {
      setCurrentPage(e.detail.page);
    };
    window.addEventListener('pagechange', handlePageChange);
    return () => window.removeEventListener('pagechange', handlePageChange);
  }, []);

  switch (currentPage) {
    case 'landing':
      return <LandingCover />;
    case 'map':
      return <TitleMap />;
    case 'chapter':
      return <ChapterPage />;
    case 'roi':
      return <ExecutiveSummaryROI />;
    case 'checkout':
      return <CheckoutBackCover />;
    default:
      return <LandingCover />;
  }
}

export default App;

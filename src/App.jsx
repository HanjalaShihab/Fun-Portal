// src/App.jsx
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import { UserProvider } from './contexts/UserContext';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/common/LoadingSpinner';
import './index.css'; // Changed from ./styles/globals.css

// Lazy load components for better performance
const Dashboard = lazy(() => import('./components/Dashboard/Dashboard'));
const MemeGenerator = lazy(() => import('./components/MemeGenerator/MemeGenerator'));
const MusicVisualizer = lazy(() => import('./components/MusicVisualizer/MusicVisualizer'));
const EmojiChat = lazy(() => import('./components/EmojiChat/EmojiChat'));
const PuzzleRoom = lazy(() => import('./components/PuzzleRoom/PuzzleRoom'));
const PhysicsSandbox = lazy(() => import('./components/PhysicsSandbox/PhysicsSandbox'));
const RandomFunGenerator = lazy(() => import('./components/RandomFunGenerator/RandomFunGenerator'));
const SpaceExplorer = lazy(() => import('./components/SpaceExplorer/SpaceExplorer'));

function App() {
  return (
    <Router>
      <ThemeProvider>
        <UserProvider>
          <Layout>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/meme-generator" element={<MemeGenerator />} />
                <Route path="/music-visualizer" element={<MusicVisualizer />} />
                <Route path="/emoji-chat" element={<EmojiChat />} />
                <Route path="/puzzle-room" element={<PuzzleRoom />} />
                <Route path="/physics-sandbox" element={<PhysicsSandbox />} />
                <Route path="/random-fun" element={<RandomFunGenerator />} />
                <Route path="/space-explorer" element={<SpaceExplorer />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
            <Toaster 
              position="bottom-right"
              toastOptions={{
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
          </Layout>
        </UserProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
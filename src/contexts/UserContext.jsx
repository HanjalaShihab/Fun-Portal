// src/contexts/UserContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: 'Fun Portal User',
    avatar: '😊',
    points: 0,
    badges: [],
  });

  const [stats, setStats] = useState({
    memesCreated: 0,
    puzzlesSolved: 0,
    chatMessages: 0,
    contentViewed: 0,
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('funPortalUser');
    const savedStats = localStorage.getItem('funPortalStats');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('funPortalUser', JSON.stringify(user));
    localStorage.setItem('funPortalStats', JSON.stringify(stats));
  }, [user, stats]);

  const updateUser = (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const updateStats = (updates) => {
    setStats(prev => ({ ...prev, ...updates }));
  };

  const addPoints = (points) => {
    setUser(prev => ({
      ...prev,
      points: prev.points + points,
    }));
  };

  const addBadge = (badge) => {
    if (!user.badges.includes(badge)) {
      setUser(prev => ({
        ...prev,
        badges: [...prev.badges, badge],
      }));
    }
  };

  return (
    <UserContext.Provider value={{
      user,
      stats,
      updateUser,
      updateStats,
      addPoints,
      addBadge,
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};
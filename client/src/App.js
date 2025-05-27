import React, { Fragment } from 'react';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';

// components
import ListModels from './components/ListModels';
// Login component will be triggered from within ListModels, so not directly rendered here

function App() {
  return (
    <AuthProvider> {/* AuthProvider still wraps everything */}
      <div className='container'>
        {/* ListModels is now the main content, always visible */}
        {/* It will handle showing Login or Admin controls based on auth state */}
        <ListModels />
      </div>
    </AuthProvider>
  );
}

export default App;

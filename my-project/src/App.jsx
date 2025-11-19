import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import your page components
import PythonSandbox from './SandBox';
import {Admin} from './AdminDashboard';

function App() {
  return (
    <Router>

      <Routes>
        {/* Define individual routes */}
        <Route path="/" element={<PythonSandbox />} />
        <Route path="/admin" element={<Admin />} />
        

        {/* Catch-all route for 404 pages */}
        
      </Routes>

      
    </Router>
  );
}

export default App;
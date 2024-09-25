import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';
import QueryHome from './pages/QueryHome';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Family from './images/front_image.png'; // Make sure this path is correct
// import './frontpage.css'; // Import the CSS file
import './index.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </div>
  );
}

function AppContent() {
  const { user } = useAuthContext();
  const location = useLocation();

  return (
    <>
      <Navbar />
      <div className="pages">
        {location.pathname === '/' ? (
          <LandingPage />
        ) : (
          <Routes>
            <Route
              path="/home"
              element={user ? <QueryHome /> : <Navigate to="/login" />}
            />
            <Route
              path="/login"
              element={!user ? <Login /> : <Navigate to="/home" />}
            />
            <Route
              path="/signup"
              element={!user ? <Signup /> : <Navigate to="/home" />}
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        )}
      </div>
    </>
  );
}

function LandingPage() {
  return (
    <section className="landing">
      <div className="circle"></div>
      <div className="content">
        <div className="textBox">
          <h2><span>ParentAId</span><br />Bridging Curiosity with Clarity</h2>
          <p>
            Parenting comes with countless questions - ParentAId provides thoughtful, easy-to-understand answers 
            to help guide you through every stage. From everyday curiosities to the most challenging questions, 
            we're here to support you with clarity and confidence.
          </p>
        </div>
        <div className="imgBox">
          <img src={Family} alt="Front" className="starbucks" />
        </div>
      </div>
    </section>
  );
}

export default App;
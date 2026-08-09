import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Import all 15 pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ArticleGenerator from './pages/ArticleGenerator';
import BlogTitleGenerator from './pages/BlogTitleGenerator';
import ImageGenerator from './pages/ImageGenerator';
import BackgroundRemover from './pages/BackgroundRemover';
import ResumeEditor from './pages/ResumeEditor';
import ATSChecker from './pages/ATSChecker';
import CoverLetterGenerator from './pages/CoverLetterGenerator';
import Community from './pages/Community';
import MyProfile from './pages/MyProfile';
import Plans from './pages/Plans';
import HelpSupport from './pages/HelpSupport';
import AboutUs from './pages/AboutUs';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />


          {/* Protected Portal Routes under Layout layout */}
          <Route 
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/article-generator" element={<ArticleGenerator />} />
            <Route path="/blog-title-generator" element={<BlogTitleGenerator />} />
            <Route path="/image-generator" element={<ImageGenerator />} />
            <Route path="/background-remover" element={<BackgroundRemover />} />
            <Route path="/resume-builder" element={<ResumeEditor />} />
            <Route path="/ats" element={<ATSChecker />} />
            <Route path="/cover-letter" element={<CoverLetterGenerator />} />
            <Route path="/community" element={<Community />} />
            <Route path="/profile" element={<MyProfile />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/help" element={<HelpSupport />} />
            <Route path="/about" element={<AboutUs />} />
          </Route>

          {/* Redirect fallbacks */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

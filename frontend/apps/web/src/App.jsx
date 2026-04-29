import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import ScrollToTop from '@/components/ScrollToTop.jsx';
import { AuthProvider } from '@/contexts/AuthContext.jsx';
import ProtectedRoute from '@/components/ProtectedRoute.jsx';
import Header from '@/components/Header.jsx';

import HomePage from '@/pages/HomePage.jsx';
import LoginPage from '@/pages/LoginPage.jsx';
import SignupPage from '@/pages/SignupPage.jsx';
import DramaDetailsPage from '@/pages/DramaDetailsPage.jsx';
import VideoPlayerPage from '@/pages/VideoPlayerPage.jsx';
import UserProfilePage from '@/pages/UserProfilePage.jsx';
import SearchPage from '@/pages/SearchPage.jsx';

function App() {
    return (
        <AuthProvider>
            <Router>
                <ScrollToTop />
                <div className="min-h-screen flex flex-col bg-background text-foreground">
                    <Header />
                    <main className="flex-1">
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/search" element={<SearchPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/signup" element={<SignupPage />} />
                            <Route path="/drama/:id" element={<DramaDetailsPage />} />
                            <Route path="/watch/:id" element={<VideoPlayerPage />} />
                            <Route
                                path="/profile"
                                element={
                                    <ProtectedRoute>
                                        <UserProfilePage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route path="*" element={
                                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                                    <h1 className="text-4xl font-bold mb-4">404</h1>
                                    <p className="text-muted-foreground mb-6">Page not found</p>
                                    <a href="/" className="text-primary hover:underline">Back to home</a>
                                </div>
                            } />
                        </Routes>
                    </main>
                </div>
                <Toaster theme="dark" />
            </Router>
        </AuthProvider>
    );
}

export default App;
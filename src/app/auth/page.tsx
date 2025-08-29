'use client';

import { useState } from 'react';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import Image from 'next/image'; 
import { useAuth } from '@/contexts/useAuth';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const { login, isAuthenticating, error } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login();
    console.log('Login attempt:', formData);

    // TODO: Implement login logic here

    // If login is successful, redirect to the dashboard
    router.push('/');

    // If login fails, set error message
    // setError('Invalid username or password');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--color-light-blue)' }}>
      {/* Top border */}
      <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: 'var(--color-light-blue-border)' }}></div>
      
      {/* Main content container */}
      <div className="w-full max-w-md">
        {/* Logo and branding */}
        <div className="text-center mb-8">
          {/* FHP Logo */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg mb-4">
            <Image src="/logo.png" alt="FHP Logo" width={64} height={64} />
          </div>
          
          {/* Main title */}
          <h1 className="font-bold text-3xl mb-2" style={{ color: 'var(--color-dark-gray)' }}>
            FHP Quality Assurance
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg" style={{ color: 'var(--color-medium-gray)' }}>
            AI-Driven TTD Report Review Platform
          </p>
        </div>

        {/* Login form card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Form header */}
          <div className="text-center mb-6">
            <h2 className="font-bold text-2xl mb-2" style={{ color: 'var(--color-dark-gray)' }}>
              Sign In
            </h2>
            <p style={{ color: 'var(--color-medium-gray)' }}>
              Access your field engineer portal
            </p>
          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username field */}
            <div>
              <label htmlFor="username" className="block font-medium mb-2" style={{ color: 'var(--color-dark-gray)' }}>
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5" style={{ color: 'var(--color-light-gray)' }} />
                </div>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all"
                  style={{ 
                    borderColor: 'var(--color-tertiary)',
                    backgroundColor: 'var(--color-input-bg)',
                    color: 'var(--color-dark-gray)'
                  }}
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="password" className="block font-medium mb-2" style={{ color: 'var(--color-dark-gray)' }}>
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5" style={{ color: 'var(--color-light-gray)' }} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all"
                  style={{ 
                    borderColor: 'var(--color-tertiary)',
                    backgroundColor: 'var(--color-input-bg)',
                    color: 'var(--color-dark-gray)'
                  }}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" style={{ color: 'var(--color-light-gray)' }} />
                  ) : (
                    <Eye className="h-5 w-5" style={{ color: 'var(--color-light-gray)' }} />
                  )}
                </button>
              </div>
            </div>

            {/* Remember me checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded focus:ring-2"
                style={{ 
                  color: 'var(--color-dark-blue)',
                  borderColor: 'var(--color-tertiary)'
                }}
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm" style={{ color: 'var(--color-medium-gray)' }}>
                Remember me
              </label>
            </div>

            {/* Sign In button */}
            <button
              type="submit"
              className="w-full py-3 px-4 text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              style={{ 
                background: 'linear-gradient(to right, var(--color-button-gradient-from), var(--color-button-gradient-to))'
              }}
            >
              Sign In
            </button>
          </form>
        </div>

        {/* Copyright */}
        <div className="text-center mt-8">
          <p className="text-sm" style={{ color: 'var(--color-light-gray)' }}>
            © 2024 FHP Engineering. All rights reserved.
          </p>
        </div>
      </div>

      {/* Bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: 'var(--color-light-blue-border)' }}></div>
    </div>
  );
}

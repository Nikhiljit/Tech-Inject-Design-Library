/**
 * Tech Inject Design Library
 * Root Application Router: Public Catalogue & Admin Dashboard
 */

import React, { useState, useEffect } from 'react';
import PublicCatalogue from './components/catalogue/PublicCatalogue';
import AdminDashboard from './components/admin/AdminDashboard';
import { UserAccount } from './types/registry';

export default function App() {
  const [currentApp, setCurrentApp] = useState<'catalogue' | 'admin'>('catalogue');
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [adminToken, setAdminToken] = useState<string>('admin-secret-token-key-2026');

  // Verify auth session on load
  const verifySession = async () => {
    const savedToken = localStorage.getItem('tech_inject_token');
    if (!savedToken) {
      setCurrentUser(null);
      return;
    }

    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${savedToken}` },
      });
      const data = await res.json();
      if (data.user) {
        setCurrentUser(data.user);
      } else {
        localStorage.removeItem('tech_inject_token');
        setCurrentUser(null);
      }
    } catch (e) {
      console.error('Failed to verify session:', e);
    }
  };

  useEffect(() => {
    verifySession();
  }, []);

  // Quick 1-click test login for review convenience
  const handleQuickLogin = async (account: 'free' | 'premium' | 'admin' | 'signout') => {
    if (account === 'signout') {
      localStorage.removeItem('tech_inject_token');
      setCurrentUser(null);
      return;
    }

    const emailMap = {
      free: 'free@customer.com',
      premium: 'premium@customer.com',
      admin: 'admin@techinject.internal',
    };

    const passwordMap = {
      free: 'free123',
      premium: 'premium123',
      admin: 'admin123',
    };

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailMap[account], password: passwordMap[account] }),
      });

      const data = await res.json();
      if (data.user && data.token) {
        localStorage.setItem('tech_inject_token', data.token);
        setCurrentUser(data.user);
        if (data.user.role === 'admin') {
          setAdminToken(data.token);
        }
      }
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="w-full min-h-screen">
      {currentApp === 'catalogue' ? (
        <PublicCatalogue
          currentUser={currentUser}
          onNavigateToAdmin={() => setCurrentApp('admin')}
          onQuickLogin={handleQuickLogin}
        />
      ) : (
        <AdminDashboard
          onBackToCatalogue={() => {
            setCurrentApp('catalogue');
            verifySession();
          }}
          adminToken={adminToken}
          onUpdateAdminToken={setAdminToken}
        />
      )}
    </div>
  );
}

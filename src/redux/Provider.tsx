'use client';

import { Provider, useDispatch } from 'react-redux';
import { store } from './store';
import React, { useEffect, useState } from 'react';
import { setCredentials } from './features/authSlice';

function AuthHydration({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user');
    const role = localStorage.getItem('role');

    if (token && role) {
      try {
        const user = userJson ? JSON.parse(userJson) : null;
        dispatch(setCredentials({ token, user, role: role as 'admin' | 'partner' }));
      } catch (e) {
        console.error('Failed to parse user from localStorage', e);
      }
    }
    setIsHydrated(true);
  }, [dispatch]);

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthHydration>{children}</AuthHydration>
    </Provider>
  );
}

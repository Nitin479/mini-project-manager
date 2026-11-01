'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
      }
    }
  }, [isAuthenticated, router]);

  if (typeof window !== 'undefined' && !localStorage.getItem('token')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return children;
}

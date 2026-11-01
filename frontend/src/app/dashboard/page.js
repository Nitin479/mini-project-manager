'use client';

import dynamic from 'next/dynamic';

const DashboardContent = dynamic(() => import('@/components/DashboardContent'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="text-gray-500 mt-4">Loading dashboard...</p>
      </div>
    </div>
  ),
});

export default function DashboardPage() {
  return <DashboardContent />;
}

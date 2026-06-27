'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import EditPostsClient from './EditPostsClient';

const SESSION_KEY = 'admin_jwt';

export default function AdminPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const jwt = localStorage.getItem(SESSION_KEY);
    if (!jwt) {
      router.replace('/admin/login');
    } else {
      setToken(jwt);
    }
    setChecking(false);
  }, [router]);

  if (checking || !token) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted text-sm animate-pulse">Checking session...</div>
      </div>
    );
  }

  // Pass JWT token to EditPostsClient as the authHash
  return <EditPostsClient jwtToken={token} />;
}

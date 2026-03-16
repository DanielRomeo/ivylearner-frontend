// app/auth/callback/page.tsx
// This page handles the redirect from Google OAuth.
// The backend redirects here with ?token=xxx after successful Google login.
// The auth-context useEffect picks up the token from the URL automatically.

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/auth-context';

export default function AuthCallbackPage() {
    const router = useRouter();
    const { user } = useAuth();

    useEffect(() => {
        // auth-context already handles grabbing the token from the URL.
        // Once user is set, redirect to dashboard.
        // Small delay to let the context settle.
        const timeout = setTimeout(() => {
            if (user) {
                router.push('/dashboard');
            } else {
                // Token was invalid or missing
                router.push('/signin?error=google_failed');
            }
        }, 500);

        return () => clearTimeout(timeout);
    }, [user, router]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <p>Signing you in...</p>
        </div>
    );
}
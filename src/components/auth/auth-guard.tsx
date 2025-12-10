'use client';

// ===========================================
// Auth Guard Component
// ===========================================
// Protects routes that require authentication

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { USE_MOCKS } from '@/lib/api';

interface AuthGuardProps {
	children: React.ReactNode;
	fallback?: React.ReactNode;
}

export default function AuthGuard({ children, fallback }: AuthGuardProps) {
	const { isAuthenticated, isLoading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		// In mock mode, always allow access
		if (USE_MOCKS) return;

		// Redirect to login if not authenticated
		if (!isLoading && !isAuthenticated) {
			router.push('/login');
		}
	}, [isAuthenticated, isLoading, router]);

	// Show loading state
	if (isLoading) {
		return (
			fallback || (
				<div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
					<div className="flex flex-col items-center gap-4">
						<div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-900" />
						<p className="text-sm text-zinc-600">Loading...</p>
					</div>
				</div>
			)
		);
	}

	// In mock mode, always show content
	if (USE_MOCKS) {
		return <>{children}</>;
	}

	// In real mode, only show content if authenticated
	if (!isAuthenticated) {
		return fallback || null;
	}

	return <>{children}</>;
}

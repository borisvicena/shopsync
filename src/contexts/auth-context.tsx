'use client';

// ===========================================
// Auth Context
// ===========================================
// Provides authentication state and methods throughout the app

import React, { createContext, useContext, useEffect, useState, useCallback, useLayoutEffect } from 'react';
import { useRouter } from 'next/navigation';
import { login as apiLogin, register as apiRegister, logout as apiLogout, getCurrentUser, getAuthToken, setAuthToken, USE_MOCKS } from '@/lib/api';
import { User, LoginCredentials, RegisterData } from '@/lib/types';
import { MOCK_CURRENT_USER } from '@/lib/mock-data';

// ===========================================
// Types
// ===========================================

interface AuthContextType {
	user: User | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	login: (credentials: LoginCredentials) => Promise<void>;
	register: (data: RegisterData) => Promise<void>;
	logout: () => Promise<void>;
	refreshUser: () => Promise<void>;
}

// ===========================================
// Context
// ===========================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ===========================================
// Helper to safely use useLayoutEffect (SSR safe)
// ===========================================
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

// ===========================================
// Provider
// ===========================================

interface AuthProviderProps {
	children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isInitialized, setIsInitialized] = useState(false);
	const router = useRouter();

	// Initialize auth state on mount - use layout effect to run before paint
	useIsomorphicLayoutEffect(() => {
		const initAuth = () => {
			try {
				// First, try to get token from localStorage synchronously
				const token = getAuthToken();

				if (USE_MOCKS) {
					// In mock mode, always set demo user (simulates always logged in)
					setUser({
						id: String(MOCK_CURRENT_USER.id),
						name: MOCK_CURRENT_USER.name,
						email: MOCK_CURRENT_USER.email,
					});
				} else if (token) {
					// Real API mode - we have a token, try to restore session
					// For now, decode basic info from token or set placeholder
					// In production, you'd validate the token with the server

					// Try to get cached user from localStorage
					const cachedUser = localStorage.getItem('auth_user');
					if (cachedUser) {
						try {
							const parsed = JSON.parse(cachedUser);
							setUser(parsed);
						} catch {
							// Invalid cached user, will need to re-login
							setUser(null);
						}
					} else {
						// We have token but no cached user - fetch from API
						getCurrentUser()
							.then((fetchedUser) => {
								if (fetchedUser) {
									setUser(fetchedUser);
									localStorage.setItem('auth_user', JSON.stringify(fetchedUser));
								}
							})
							.catch(() => {
								// Token might be invalid
								setUser(null);
							});
					}
				} else {
					// No token - not authenticated
					setUser(null);
				}
			} catch (error) {
				console.error('Error initializing auth:', error);
				setUser(null);
			} finally {
				setIsInitialized(true);
				setIsLoading(false);
			}
		};

		initAuth();
	}, []);

	// Login handler
	const login = useCallback(
		async (credentials: LoginCredentials) => {
			setIsLoading(true);
			try {
				const authUser = await apiLogin(credentials);
				const userData: User = {
					id: String(authUser.id),
					name: authUser.name,
					email: authUser.email,
				};
				setUser(userData);

				// Cache user data for faster reload
				if (typeof window !== 'undefined') {
					localStorage.setItem('auth_user', JSON.stringify(userData));
				}

				router.push('/');
			} catch (error) {
				setIsLoading(false);
				throw error;
			}
			setIsLoading(false);
		},
		[router]
	);

	// Register handler
	const register = useCallback(
		async (data: RegisterData) => {
			setIsLoading(true);
			try {
				const authUser = await apiRegister(data);
				const userData: User = {
					id: String(authUser.id),
					name: authUser.name,
					email: authUser.email,
				};
				setUser(userData);

				// Cache user data
				if (typeof window !== 'undefined') {
					localStorage.setItem('auth_user', JSON.stringify(userData));
				}

				router.push('/');
			} catch (error) {
				setIsLoading(false);
				throw error;
			}
			setIsLoading(false);
		},
		[router]
	);

	// Logout handler
	const logout = useCallback(async () => {
		await apiLogout();
		setUser(null);

		// Clear cached user
		if (typeof window !== 'undefined') {
			localStorage.removeItem('auth_user');
		}

		router.push('/login');
	}, [router]);

	// Refresh user data
	const refreshUser = useCallback(async () => {
		try {
			if (USE_MOCKS) {
				setUser({
					id: String(MOCK_CURRENT_USER.id),
					name: MOCK_CURRENT_USER.name,
					email: MOCK_CURRENT_USER.email,
				});
			} else {
				const currentUser = await getCurrentUser();
				setUser(currentUser);
			}
		} catch (error) {
			console.error('Error refreshing user:', error);
		}
	}, []);

	const value: AuthContextType = {
		user,
		isLoading,
		isAuthenticated: !!user,
		login,
		register,
		logout,
		refreshUser,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ===========================================
// Hook
// ===========================================

export function useAuth(): AuthContextType {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
}

// ===========================================
// Auth Guard Component
// ===========================================

interface AuthGuardProps {
	children: React.ReactNode;
	fallback?: React.ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
	const { isAuthenticated, isLoading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!isLoading && !isAuthenticated && !USE_MOCKS) {
			router.push('/login');
		}
	}, [isAuthenticated, isLoading, router]);

	if (isLoading) {
		return fallback || <div>Loading...</div>;
	}

	// In mock mode, always show content
	if (USE_MOCKS) {
		return <>{children}</>;
	}

	if (!isAuthenticated) {
		return fallback || null;
	}

	return <>{children}</>;
}

export default AuthContext;

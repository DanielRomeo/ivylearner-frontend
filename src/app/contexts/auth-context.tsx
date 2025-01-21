// app/contexts/auth-context.tsx
'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface User {
	id: number;
	email: string;
	// Add other user properties
}

interface AuthContextType {
	user: User | null;
	isAuthenticated: boolean;
	getToken: () => Promise<string | null>;
	login: (email: string, password: string) => Promise<void>;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();

	// Helper function to fetch user data
	const fetchUserData = async (token: string): Promise<User | null> => {
		try {
			const response = await axios.get('/api/auth/me', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.status === 200 && response.data) {
				// Ensure we're getting a properly structured user object
				const userData: User = {
					id: response.data.id,
					email: response.data.email,
					// Add other user properties as needed
				};
				return userData;
			}
			return null;
		} catch (error) {
			console.error('Error fetching user data:', error);
			return null;
		}
	};

	// Initial auth check
	useEffect(() => {
		const initializeAuth = async () => {
			setIsLoading(true);
			const token = localStorage.getItem('access_token');

			if (token) {
				const userData = await fetchUserData(token);
				if (userData) {
					setUser(userData);
				} else {
					localStorage.removeItem('access_token');
				}
			}

			setIsLoading(false);
		};

		initializeAuth();
	}, []);

	// Axios interceptor
	useEffect(() => {
		const interceptor = axios.interceptors.request.use(
			(config) => {
				const token = localStorage.getItem('access_token');
				if (token) {
					config.headers.Authorization = `Bearer ${token}`;
				}
				return config;
			},
			(error) => Promise.reject(error)
		);

		return () => {
			axios.interceptors.request.eject(interceptor);
		};
	}, []);

	const getToken = async () => {
		return localStorage.getItem('access_token');
	};

	const login = async (email: string, password: string) => {
		try {
			const response = await axios.post(
				'/api/auth/login',
				{ email, password },
				{ headers: { 'Content-Type': 'application/json' } }
			);

			const accessToken = response.data.data.access_token;
			if (!accessToken) {
				throw new Error('No access token received from server');
			}

			// Save token first
			localStorage.setItem('access_token', accessToken);

			// Fetch user data with new token
			const userData = await fetchUserData(accessToken);
			if (!userData) {
				throw new Error('Failed to fetch user data after login');
			}

			// Set user state
			setUser(userData);

			// Navigate to dashboard
			router.push('/dashboard');
		} catch (error) {
			console.error('Login error:', error);
			localStorage.removeItem('access_token');

			if (axios.isAxiosError(error)) {
				if (!error.response) {
					throw new Error('Network error - No server response');
				}

				const errorMessages: Record<number, string> = {
					401: 'Invalid email or password',
					404: 'Login service not found',
					422: 'Invalid input - Please check your email and password',
					500: 'Server error - Please try again later',
				};

				throw new Error(
					errorMessages[error.response.status] ||
						error.response.data?.message ||
						'Login failed'
				);
			}

			throw new Error('An unexpected error occurred during login');
		}
	};

	const logout = () => {
		localStorage.removeItem('access_token');
		setUser(null);
		router.push('/signin');
	};

	if (isLoading) {
		return null; // Or a loading spinner
	}

	return (
		<AuthContext.Provider
			value={{
				user,
				isAuthenticated: !!user,
				getToken,
				login,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};

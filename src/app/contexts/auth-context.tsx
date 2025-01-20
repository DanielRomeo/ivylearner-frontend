// app/contexts/auth-context.tsx
'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

// Define the User interface based on your API response
interface User {
	id: number;
	email: string;
	// Add other user properties that your API returns
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
	const router = useRouter();

	useEffect(() => {
		checkAuth();
	}, []);

	// Set up axios interceptor for token
	useEffect(() => {
		const interceptor = axios.interceptors.request.use(
			(config) => {
				const token = localStorage.getItem('access_token');
				if (token) {
					config.headers.Authorization = `Bearer ${token}`;
				}
				return config;
			},
			(error) => {
				return Promise.reject(error);
			}
		);

		return () => {
			axios.interceptors.request.eject(interceptor);
		};
	}, []);

	const checkAuth = async () => {
		const token = localStorage.getItem('access_token');
		if (token) {
			try {
				// Get the user ID first or from the token payload
				// Then use it to fetch instructor data
				const response = await axios.get(`/api/auth/me`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
	
				if (response.status === 200) {
					const userData = response.data;
					console.log('userData from checkAuth is :'+userData)
					setUser(userData);
				} else {
					localStorage.removeItem('access_token');
					setUser(null);
				}
			} catch (error) {
				console.error('Auth check failed:', error);
				localStorage.removeItem('access_token');
				setUser(null);
			}
		}
	};

	const getToken = async () => {
		return localStorage.getItem('access_token');
	};

	const login = async (email: string, password: string) => {
		try {
			// First, ensure we have the correct base URL for axios
			const response = await axios.post('/api/auth/login', {
				email,
				password,
			}, {
				headers: {
					'Content-Type': 'application/json'
				}
			});
			// console.log('Login response:', response.data);
			let accessToken = response.data.data.access_token;
			// console.log('my token ins :'+ accessToken)
			if (!accessToken) {
				throw new Error('No access token received from server');
			}
	
			localStorage.setItem('access_token', accessToken);
			if (user) {
				console.log('the user is :' +user)
				setUser(user);
			} else {
				const userResponse = await axios.get('/api/auth/me', {
					headers: {
						'Authorization': `Bearer ${accessToken}`
					}
				});
				console.log('user Response is :'+ JSON.stringify(userResponse.data))
				setUser(userResponse.data.id);
				console.log(userResponse.data.id)
			}
	
			// Navigate to dashboard
			router.push('/dashboard');
	
		} catch (error) {
			console.error('Login error details:', error);
	
			if (axios.isAxiosError(error)) {
				// Handle specific error cases
				if (!error.response) {
					throw new Error('Network error - No server response');
				}
	
				switch (error.response.status) {
					case 401:
						throw new Error('Invalid email or password');
					case 404:
						throw new Error('Login service not found');
					case 422:
						throw new Error('Invalid input - Please check your email and password');
					case 500:
						throw new Error('Server error - Please try again later');
					default:
						throw new Error(error.response.data?.message || 'Login failed');
				}
			}
	
			// Handle non-axios errors
			throw new Error('An unexpected error occurred during login');
		}
	};

	const logout = () => {
		localStorage.removeItem('access_token');
		setUser(null);
		router.push('/signin');
	};

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

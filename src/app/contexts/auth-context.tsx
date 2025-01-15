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

// Configure axios defaults
axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.headers.common['Content-Type'] = 'application/json';

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
		if (!token) {
			setUser(null);
			return;
		}

		try {
			const response = await axios.get('/auth/me');
			setUser(response.data);
		} catch (error) {
			console.error('Auth check failed:', error);
			localStorage.removeItem('access_token');
			setUser(null);
		}
	};

	const getToken = async () => {
		return localStorage.getItem('access_token');
	};

	const login = async (email: string, password: string) => {
		try {
			const response = await axios.post('/instructors/login', {
				email,
				password,
			});
			console.log(response)

			const { access_token, user: userData } = response.data;

			if (!access_token || !userData) {
				throw new Error('Invalid response from server');
			}

			localStorage.setItem('access_token', access_token);
			setUser(userData);
			router.push('/dashboard');
		} catch (error) {
			if (axios.isAxiosError(error)) {
				if (error.response?.status === 401) {
					throw new Error('Invalid email or password');
				}
				throw new Error(error.response?.data?.message || 'Login failed');
			}
			throw new Error('Network error');
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

import './globals.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Montserrat } from 'next/font/google';
import { AuthProvider } from './contexts/auth-context';

const montserrat = Montserrat({
	subsets: ['latin'],
	weight: ['300'], // Light weight
});

export const metadata = {
	title: 'Pirple',
	description: 'Continuing education for Software Engineers',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className={montserrat.className}>
				<AuthProvider>{children}</AuthProvider>
			</body>
		</html>
	);
}

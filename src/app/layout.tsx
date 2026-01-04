import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/navbar';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/contexts/auth-context';
import { ThemeProvider } from '@/providers/theme-provider';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Shopsync - Shopping List App',
	description: 'Manage and collaborate on shopping lists',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<ThemeProvider>
					<AuthProvider>
						<Navbar />
						{children}
						<Toaster position="top-center" />
					</AuthProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}

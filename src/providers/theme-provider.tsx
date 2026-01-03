'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ReactNode } from 'react';

interface ThemeProviderProps {
	children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
	return (
		<NextThemesProvider
			attribute="class"
			defaultTheme="light"
			enableSystem
			storageKey="shopsync-theme"
			themes={['light', 'dark']}
			disableTransitionOnChange={false}
		>
			{children}
		</NextThemesProvider>
	);
}

'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
	const [mounted, setMounted] = useState(false);
	const { theme, setTheme } = useTheme();

	// Hydration safety - only render after mount
	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<Button
				variant="ghost"
				size="icon"
				className="h-9 w-9"
				disabled
				aria-label="Loading theme toggle"
			/>
		);
	}

	const toggleTheme = () => {
		setTheme(theme === 'dark' ? 'light' : 'dark');
	};

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="h-9 w-9"
					onClick={toggleTheme}
					aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
				>
					{theme === 'dark' ? (
						<Sun className="h-4 w-4" />
					) : (
						<Moon className="h-4 w-4" />
					)}
				</Button>
			</TooltipTrigger>
			<TooltipContent side="bottom">
				{theme === 'dark' ? 'Light mode' : 'Dark mode'}
			</TooltipContent>
		</Tooltip>
	);
}

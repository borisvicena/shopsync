'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import '@/lib/i18n';

export function LanguageSelector() {
	const { i18n } = useTranslation();
	const [mounted, setMounted] = useState(false);

	// Hydration safety - only render after mount
	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<Select disabled>
				<SelectTrigger className="w-[70px]">
					<SelectValue />
				</SelectTrigger>
			</Select>
		);
	}

	const handleLanguageChange = (lang: string) => {
		i18n.changeLanguage(lang);
	};

	return (
		<Select value={i18n.language} onValueChange={handleLanguageChange}>
			<SelectTrigger className="w-[70px]">
				<SelectValue />
			</SelectTrigger>
			<SelectContent align="end">
				<SelectItem value="en">English</SelectItem>
				<SelectItem value="sk">Slovenčina</SelectItem>
			</SelectContent>
		</Select>
	);
}

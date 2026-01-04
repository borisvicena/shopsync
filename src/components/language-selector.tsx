'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Languages, Check } from 'lucide-react';
import '@/lib/i18n';

const languages = {
	en: { name: 'English', flag: '🇬🇧' },
	sk: { name: 'Slovenčina', flag: '🇸🇰' },
};

export function LanguageSelector() {
	const { i18n } = useTranslation();
	const [mounted, setMounted] = useState(false);

	// Hydration safety - only render after mount
	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<Button variant="ghost" size="icon" disabled className="h-10 w-10">
				<Languages className="h-5 w-5" />
			</Button>
		);
	}

	const currentLanguage = languages[i18n.language as keyof typeof languages] || languages.en;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="sm" className="gap-2 h-10 px-3">
					<Languages className="h-4 w-4" />
					<span className="hidden sm:inline">{currentLanguage.name}</span>
					<span className="sm:hidden">{currentLanguage.flag}</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{Object.entries(languages).map(([code, lang]) => (
					<DropdownMenuItem
						key={code}
						onClick={() => i18n.changeLanguage(code)}
						className="cursor-pointer gap-2"
					>
						<span className="text-lg">{lang.flag}</span>
						<span>{lang.name}</span>
						{i18n.language === code && <Check className="ml-auto h-4 w-4" />}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

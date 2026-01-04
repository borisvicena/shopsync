'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '@/lib/i18n';
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Settings, LogOut, ShoppingCart, Database } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { USE_MOCKS } from '@/lib/api';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageSelector } from '@/components/language-selector';

export default function Navbar() {
	const { t } = useTranslation();
	const { user, logout, isAuthenticated } = useAuth();
	const [showLogoutDialog, setShowLogoutDialog] = useState(false);

	const handleLogout = async () => {
		setShowLogoutDialog(false);
		await logout();
	};

	const getInitials = (name: string) => {
		return name
			.split(' ')
			.map((n) => n[0])
			.join('')
			.toUpperCase()
			.slice(0, 2);
	};

	return (
		<>
			<nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/60">
				<div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
					{/* Logo */}
					<Link
						href="/"
						className="flex items-center gap-2 text-xl font-bold tracking-tight text-foreground transition-colors hover:text-foreground/80"
					>
						<div className="flex h-8 w-8 items-center justify-center">
							<img src="/icon.svg" />
						</div>
						<span className="hidden sm:inline text-primary tracking-tight">
							Shop<span className="text-foreground">sync</span>
						</span>
					</Link>

					{/* Right side */}
					<div className="flex items-center gap-2">
						{/* Mock Mode Indicator */}
						{USE_MOCKS && (
							<Badge variant="secondary" className="gap-1 hidden sm:flex">
								<Database className="h-3 w-3" />
								{t('navbar.mockMode')}
							</Badge>
						)}

						{/* Language Selector */}
						<LanguageSelector />

						{/* Theme Toggle */}
						<ThemeToggle />

						{isAuthenticated && user ? (
							/* User Menu */
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" size="sm" className="relative h-10 gap-2 rounded-full pl-2 pr-3">
										<Avatar className="h-7 w-7">
											<AvatarImage src={undefined} alt={user.name} />
											<AvatarFallback className="bg-primary text-xs text-primary-foreground">{getInitials(user.name)}</AvatarFallback>
										</Avatar>
										<span className="hidden text-sm font-medium sm:inline">{user.name.split(' ')[0]}</span>
									</Button>
								</DropdownMenuTrigger>

								<DropdownMenuContent align="end" className="w-56">
									<DropdownMenuLabel>
										<div className="flex flex-col space-y-1">
											<p className="text-sm font-medium">{user.name}</p>
											<p className="text-xs text-muted-foreground">{user.email}</p>
										</div>
									</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuItem asChild>
										<Link href="/profile" className="cursor-pointer">
											<User className="mr-2 h-4 w-4" />
											{t('navbar.myProfile')}
										</Link>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										onClick={() => setShowLogoutDialog(true)}
										className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
									>
										<LogOut className="mr-2 h-4 w-4" />
										{t('navbar.logOut')}
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						) : (
							/* Login/Signup Buttons */
							<div className="flex items-center gap-2">
								<Button variant="ghost" asChild>
									<Link href="/login">{t('navbar.signIn')}</Link>
								</Button>
								<Button asChild>
									<Link href="/signup">{t('navbar.signUp')}</Link>
								</Button>
							</div>
						)}
					</div>
				</div>
			</nav>

			{/* Logout Confirmation */}
			<AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>{t('navbar.logoutDialog.title')}</AlertDialogTitle>
						<AlertDialogDescription>
							{t('navbar.logoutDialog.description')}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>{t('navbar.logoutDialog.cancel')}</AlertDialogCancel>
						<AlertDialogAction onClick={handleLogout}>{t('navbar.logoutDialog.confirm')}</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}

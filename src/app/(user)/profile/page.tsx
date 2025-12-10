'use client';

import { useState } from 'react';
import AuthGuard from '@/components/auth/auth-guard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Camera, Loader2, User, Mail, Calendar, Clock, ShoppingBag, Package, Users, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { MOCK_USER } from '@/lib/static-data';
import { cn } from '@/lib/utils';

function getInitials(name: string, fallback: string = 'U'): string {
	if (!name) return fallback.charAt(0).toUpperCase();
	return name
		.split(' ')
		.map((n) => n[0])
		.join('')
		.toUpperCase()
		.slice(0, 2);
}

function StatCard({
	icon: Icon,
	value,
	label,
	color = 'default',
}: {
	icon: React.ElementType;
	value: number | string;
	label: string;
	color?: 'default' | 'primary' | 'success';
}) {
	return (
		<div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
			<div
				className={cn(
					'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
					color === 'primary' && 'bg-primary/10 text-primary',
					color === 'success' && 'bg-green-500/10 text-green-600',
					color === 'default' && 'bg-muted text-muted-foreground'
				)}
			>
				<Icon className="h-5 w-5" />
			</div>
			<div>
				<p className="text-2xl font-semibold text-foreground">{value}</p>
				<p className="text-sm text-muted-foreground">{label}</p>
			</div>
		</div>
	);
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
	return (
		<div className="flex items-center gap-3 py-2">
			<Icon className="h-4 w-4 text-muted-foreground shrink-0" />
			<div className="flex-1 min-w-0">
				<p className="text-xs text-muted-foreground">{label}</p>
				<p className="text-sm text-foreground truncate">{value}</p>
			</div>
		</div>
	);
}

export default function ProfilePage() {
	const [saving, setSaving] = useState(false);
	const [fullName, setFullName] = useState(MOCK_USER.name);
	const [avatarUrl, setAvatarUrl] = useState(MOCK_USER.avatarUrl || '');

	const user = MOCK_USER;

	const handleSave = async () => {
		if (!fullName.trim()) {
			toast.error('Name cannot be empty');
			return;
		}

		try {
			setSaving(true);
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 800));
			toast.success('Profile updated');
		} catch (error) {
			console.error('Error updating profile:', error);
			toast.error('Failed to update profile');
		} finally {
			setSaving(false);
		}
	};

	const hasChanges = fullName !== MOCK_USER.name || avatarUrl !== (MOCK_USER.avatarUrl || '');

	return (
		<AuthGuard>
			<div className="min-h-[calc(100vh-4rem)] bg-background">
				<div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
					<div className="space-y-6">
						{/* Header */}
						<header>
							<h1 className="text-2xl font-semibold tracking-tight text-foreground">Profile</h1>
							<p className="text-sm text-muted-foreground">Manage your account settings</p>
						</header>

						{/* Profile Card */}
						<Card>
							<CardContent className="pt-6">
								<div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left gap-6">
									{/* Avatar */}
									<div className="relative group">
										<Avatar className="h-24 w-24 border-4 border-background shadow-lg">
											<AvatarImage src={avatarUrl} alt={fullName} />
											<AvatarFallback className="bg-primary text-primary-foreground text-2xl font-medium">
												{getInitials(fullName, user.email)}
											</AvatarFallback>
										</Avatar>
										<button
											className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
											onClick={() => document.getElementById('avatar-input')?.focus()}
											aria-label="Change avatar"
										>
											<Camera className="h-6 w-6 text-white" />
										</button>
									</div>

									{/* Info */}
									<div className="flex-1 space-y-1">
										<h2 className="text-xl font-semibold text-foreground">{fullName}</h2>
										<p className="text-sm text-muted-foreground">{user.email}</p>
										<div className="flex items-center justify-center sm:justify-start gap-2 pt-2">
											<span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
												<CheckCircle2 className="h-3 w-3" />
												Active
											</span>
											<span className="text-xs text-muted-foreground">Member since Jan 2024</span>
										</div>
									</div>
								</div>

								<Separator className="my-6" />

								{/* Account Info */}
								<div className="grid gap-1 sm:grid-cols-2">
									<InfoRow icon={Mail} label="Email" value={user.email} />
									<InfoRow icon={Calendar} label="Joined" value="January 1, 2024" />
									<InfoRow
										icon={Clock}
										label="Last active"
										value={new Date().toLocaleDateString('en-US', {
											month: 'short',
											day: 'numeric',
											hour: 'numeric',
											minute: '2-digit',
										})}
									/>
									<InfoRow icon={User} label="Account type" value="Standard" />
								</div>
							</CardContent>
						</Card>

						{/* Edit Profile */}
						<Card>
							<CardHeader className="pb-4">
								<CardTitle className="text-base">Edit Profile</CardTitle>
								<CardDescription>Update your personal information</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="fullName">Display name</Label>
									<Input id="fullName" placeholder="Your name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
								</div>

								<div className="space-y-2">
									<Label htmlFor="avatar-input">Avatar URL</Label>
									<Input
										id="avatar-input"
										type="url"
										placeholder="https://example.com/avatar.jpg"
										value={avatarUrl}
										onChange={(e) => setAvatarUrl(e.target.value)}
									/>
									<p className="text-xs text-muted-foreground">Paste a link to an image to use as your avatar</p>
								</div>

								<div className="space-y-2">
									<Label htmlFor="email">Email</Label>
									<Input id="email" type="email" value={user.email} disabled className="bg-muted text-muted-foreground" />
									<p className="text-xs text-muted-foreground">Contact support to change your email</p>
								</div>

								<div className="flex justify-end pt-2">
									<Button onClick={handleSave} disabled={saving || !hasChanges}>
										{saving ? (
											<>
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
												Saving...
											</>
										) : (
											'Save changes'
										)}
									</Button>
								</div>
							</CardContent>
						</Card>

						{/* Statistics */}
						<Card>
							<CardHeader className="pb-4">
								<CardTitle className="text-base">Activity</CardTitle>
								<CardDescription>Your shopping list statistics</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="grid gap-3 sm:grid-cols-3">
									<StatCard icon={ShoppingBag} value={3} label="Lists created" color="primary" />
									<StatCard icon={Package} value={12} label="Items added" color="default" />
									<StatCard icon={Users} value={2} label="Collaborators" color="success" />
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</AuthGuard>
	);
}

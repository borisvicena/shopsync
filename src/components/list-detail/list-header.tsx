'use client';

import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { Badge } from '../ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { useTranslation } from 'react-i18next';
import '@/lib/i18n';

type ListHeaderProps = {
	name: string;
	isOwner: boolean;
	isArchived: boolean;
	createdAt: Date;
	updatedAt: Date;
	onUpdate: () => void;
};

export function ListHeader({ name, isOwner, isArchived, createdAt, updatedAt, onUpdate }: ListHeaderProps) {
	const { t } = useTranslation();
	return (
		<div className="space-y-3">
			<div className="flex flex-row items-center justify-between">
				<div className="flex items-center gap-3">
					<h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{name}</h1>
					{isArchived && <Badge variant="secondary">{t('listDetail.archived')}</Badge>}
				</div>

				{isOwner && (
					<Button variant="outline" size="sm" onClick={onUpdate} className="gap-2">
						<Pencil className="h-4 w-4" />
						<span className="hidden sm:inline">{t('listDetail.editListName')}</span>
					</Button>
				)}
			</div>

			<p className="text-sm text-muted-foreground">
				{t('listDetail.created')} {formatDistanceToNow(createdAt, { addSuffix: true })} • {t('listDetail.updated')}{' '}
				{formatDistanceToNow(updatedAt, { addSuffix: true })}
			</p>
		</div>
	);
}

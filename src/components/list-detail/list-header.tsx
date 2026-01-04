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
			<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
				<div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 min-w-0">
					<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground break-words">{name}</h1>
					{isArchived && <Badge variant="secondary" className="w-fit">{t('listDetail.archived')}</Badge>}
				</div>

				{isOwner && (
					<Button variant="outline" size="sm" onClick={onUpdate} className="gap-2 w-full sm:w-auto shrink-0">
						<Pencil className="h-4 w-4" />
						<span className="sm:hidden">{t('common.edit')}</span>
						<span className="hidden sm:inline">{t('listDetail.editListName')}</span>
					</Button>
				)}
			</div>

			<p className="text-xs sm:text-sm text-muted-foreground">
				{t('listDetail.created')} {formatDistanceToNow(createdAt, { addSuffix: true })} • {t('listDetail.updated')}{' '}
				{formatDistanceToNow(updatedAt, { addSuffix: true })}
			</p>
		</div>
	);
}

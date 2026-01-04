import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ListChecks, ShoppingCart, CheckCircle2, TrendingUp } from 'lucide-react';
import { ShoppingListSummary } from '@/lib/types';

interface StatsCardsProps {
	lists: ShoppingListSummary[];
}

export function StatsCards({ lists }: StatsCardsProps) {
	// Calculate stats
	const totalLists = lists.length;
	const totalItems = lists.reduce((sum, list) => sum + list.itemStats.total, 0);
	const completedItems = lists.reduce((sum, list) => sum + list.itemStats.resolved, 0);
	const completionRate = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

	const stats = [
		{
			title: 'Total Lists',
			value: totalLists,
			description: totalLists === 1 ? 'active list' : 'active lists',
			icon: ListChecks,
			iconColor: 'text-primary',
		},
		{
			title: 'Total Items',
			value: totalItems,
			description: totalItems === 1 ? 'item to track' : 'items to track',
			icon: ShoppingCart,
			iconColor: 'text-blue-600',
		},
		{
			title: 'Items Completed',
			value: completedItems,
			description: `${completedItems} of ${totalItems} done`,
			icon: CheckCircle2,
			iconColor: 'text-green-600',
		},
		{
			title: 'Completion Rate',
			value: `${completionRate}%`,
			description: 'overall progress',
			icon: TrendingUp,
			iconColor: 'text-emerald-600',
			showProgress: true,
			progressValue: completionRate,
		},
	];

	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{stats.map((stat) => (
				<Card key={stat.title}>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
						<stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stat.value}</div>
						<p className="text-xs text-muted-foreground">{stat.description}</p>
						{stat.showProgress && (
							<Progress value={stat.progressValue} className="mt-2" />
						)}
					</CardContent>
				</Card>
			))}
		</div>
	);
}

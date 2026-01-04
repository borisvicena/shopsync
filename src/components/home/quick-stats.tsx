import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingListSummary } from '@/lib/types';
import { AlertCircle, Sparkles, Target } from 'lucide-react';

interface QuickStatsProps {
	lists: ShoppingListSummary[];
}

export function QuickStats({ lists }: QuickStatsProps) {
	// Most active list (list with most total items)
	const mostActiveList = lists.reduce((max, list) =>
		list.itemStats.total > (max?.itemStats.total || 0) ? list : max,
		lists[0]
	);

	// Nearly complete lists (>80% completion)
	const nearlyCompleteLists = lists.filter((list) => {
		if (list.itemStats.total === 0) return false;
		const completionRate = (list.itemStats.resolved / list.itemStats.total) * 100;
		return completionRate >= 80 && completionRate < 100;
	});

	// Lists needing attention (0% completion with items)
	const needsAttentionLists = lists.filter(
		(list) => list.itemStats.total > 0 && list.itemStats.resolved === 0
	);

	return (
		<Card className="lg:col-span-5">
			<CardHeader>
				<CardTitle>Quick Insights</CardTitle>
				<CardDescription>Key stats at a glance</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Most Active List */}
				<div className="flex items-start gap-3">
					<div className="rounded-full bg-primary/10 p-2">
						<Sparkles className="h-4 w-4 text-primary" />
					</div>
					<div className="flex-1 space-y-1">
						<p className="text-sm font-medium">Most Active List</p>
						{mostActiveList ? (
							<>
								<p className="text-sm text-muted-foreground">{mostActiveList.name}</p>
								<Badge variant="secondary" className="text-xs">
									{mostActiveList.itemStats.total} items
								</Badge>
							</>
						) : (
							<p className="text-sm text-muted-foreground">No lists yet</p>
						)}
					</div>
				</div>

				{/* Nearly Complete */}
				<div className="flex items-start gap-3">
					<div className="rounded-full bg-green-100 dark:bg-green-900/20 p-2">
						<Target className="h-4 w-4 text-green-600 dark:text-green-400" />
					</div>
					<div className="flex-1 space-y-1">
						<p className="text-sm font-medium">Nearly Complete</p>
						<p className="text-sm text-muted-foreground">
							{nearlyCompleteLists.length === 0
								? 'No lists close to completion'
								: nearlyCompleteLists.length === 1
								? '1 list is almost done'
								: `${nearlyCompleteLists.length} lists almost done`}
						</p>
						{nearlyCompleteLists.length > 0 && (
							<Badge variant="secondary" className="text-xs">
								{'>'} 80% complete
							</Badge>
						)}
					</div>
				</div>

				{/* Needs Attention */}
				<div className="flex items-start gap-3">
					<div className="rounded-full bg-amber-100 dark:bg-amber-900/20 p-2">
						<AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
					</div>
					<div className="flex-1 space-y-1">
						<p className="text-sm font-medium">Needs Attention</p>
						<p className="text-sm text-muted-foreground">
							{needsAttentionLists.length === 0
								? 'All lists have progress'
								: needsAttentionLists.length === 1
								? '1 list not started'
								: `${needsAttentionLists.length} lists not started`}
						</p>
						{needsAttentionLists.length > 0 && (
							<Badge variant="secondary" className="text-xs">
								0% complete
							</Badge>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

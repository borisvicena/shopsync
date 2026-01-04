'use client';

import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ShoppingListSummary } from '@/lib/types';
import { calculateListsByCompletionStatus } from '@/lib/chart-utils';

interface DashboardListSummaryChartProps {
	lists: ShoppingListSummary[];
}

export function DashboardListSummaryChart({ lists }: DashboardListSummaryChartProps) {
	const chartData = useMemo(() => calculateListsByCompletionStatus(lists), [lists]) as any;

	if (chartData.length === 0) {
		return (
			<div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
				No data to display
			</div>
		);
	}

	const totalLists = chartData.reduce((sum: number, item: any) => sum + item.value, 0);

	return (
		<div className="w-full h-[220px] sm:h-[240px] lg:h-[260px]">
			<ResponsiveContainer width="100%" height="100%">
				<PieChart>
					<Pie
						data={chartData}
						cx="50%"
						cy="50%"
						labelLine={false}
						label={({ name, value, percent }) => {
							const percentage = ((percent || 0) * 100).toFixed(0);
							return `${name}: ${value} (${percentage}%)`;
						}}
						outerRadius="60%"
						fill="#8884d8"
						dataKey="value"
					>
						{chartData.map((entry: any, index: number) => (
							<Cell key={`cell-${index}`} fill={entry.color} />
						))}
					</Pie>
					<Tooltip
						content={({ active, payload }) => {
							if (active && payload && payload.length) {
								const data = payload[0];
								const percentage = ((data.value as number / totalLists) * 100).toFixed(1);
								return (
									<div className="rounded-lg border bg-background p-2 shadow-sm">
										<div className="flex flex-col gap-1">
											<span className="text-sm font-medium">{data.name}</span>
											<span className="text-sm text-muted-foreground">
												{data.value} lists ({percentage}%)
											</span>
										</div>
									</div>
								);
							}
							return null;
						}}
					/>
					<Legend
						verticalAlign="bottom"
						height={36}
						content={({ payload }) => (
							<div className="flex flex-wrap justify-center gap-4 pt-4">
								{payload?.map((entry, index) => (
									<div key={`legend-${index}`} className="flex items-center gap-2">
										<div
											className="h-3 w-3 rounded-sm"
											style={{ backgroundColor: entry.color }}
										/>
										<span className="text-sm text-muted-foreground">
											{entry.value}: {chartData[index]?.value || 0}
										</span>
									</div>
								))}
							</div>
						)}
					/>
				</PieChart>
			</ResponsiveContainer>
		</div>
	);
}

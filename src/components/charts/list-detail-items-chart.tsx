'use client';

import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ListItem } from '@/lib/types';
import { calculateItemCompletion, getChartColors } from '@/lib/chart-utils';
import { useTranslation } from 'react-i18next';
import '@/lib/i18n';

interface ListDetailItemsChartProps {
	items: ListItem[];
}

export function ListDetailItemsChart({ items }: ListDetailItemsChartProps) {
	const { t } = useTranslation();
	const stats = useMemo(() => calculateItemCompletion(items), [items]);
	const colors = useMemo(() => getChartColors(), []);

	const chartData = useMemo(
		() => [
			{ name: 'Completed', value: stats.completed, color: colors[0] }, // chart-1 (green)
			{ name: 'Pending', value: stats.pending, color: colors[3] }, // chart-4 (amber)
		].filter((item) => item.value > 0),
		[stats, colors]
	);

	if (items.length === 0) {
		return (
			<div className="flex h-[240px] sm:h-[260px] lg:h-[280px] items-center justify-center text-sm text-muted-foreground">
				{t('listDetail.chart.noItems')}
			</div>
		);
	}

	return (
		<div className="w-full h-[240px] sm:h-[260px] lg:h-[280px]">
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
						outerRadius="55%"
						fill="#8884d8"
						dataKey="value"
					>
						{chartData.map((entry, index) => (
							<Cell key={`cell-${index}`} fill={entry.color} />
						))}
					</Pie>
					<Tooltip
						content={({ active, payload }) => {
							if (active && payload && payload.length) {
								const data = payload[0];
								const percentage = ((data.value as number / stats.total) * 100).toFixed(1);
								return (
									<div className="rounded-lg border bg-background p-2 shadow-sm">
										<div className="flex flex-col gap-1">
											<span className="text-sm font-medium">{data.name}</span>
											<span className="text-sm text-muted-foreground">
												{data.value} items ({percentage}%)
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

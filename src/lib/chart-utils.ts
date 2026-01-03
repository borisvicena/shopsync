import { ShoppingListSummary, ListItem } from './types';

export type ListStatus = 'Complete' | 'In Progress' | 'Not Started' | 'Empty';

export interface ChartDataPoint {
	name: ListStatus;
	value: number;
	color: string;
}

export interface ItemCompletionStats {
	completed: number;
	pending: number;
	total: number;
}

/**
 * Get chart colors from CSS variables
 * Returns array of colors for charts
 */
export const getChartColors = (): string[] => {
	if (typeof window === 'undefined') {
		// SSR fallback - return default colors
		return [
			'oklch(0.55 0.18 160)', // chart-1
			'oklch(0.6 0.15 200)', // chart-2
			'oklch(0.65 0.12 260)', // chart-3
			'oklch(0.7 0.15 85)', // chart-4
			'oklch(0.55 0.18 25)', // chart-5
		];
	}

	const styles = getComputedStyle(document.documentElement);
	return [1, 2, 3, 4, 5].map((i) => {
		return styles.getPropertyValue(`--chart-${i}`).trim();
	});
};

/**
 * Calculate distribution of lists by completion status
 */
export const calculateListsByCompletionStatus = (lists: ShoppingListSummary[]): ChartDataPoint[] => {
	const colors = getChartColors();

	const statusCounts = {
		complete: 0,
		inProgress: 0,
		notStarted: 0,
		empty: 0,
	};

	lists.forEach((list) => {
		const { total, resolved } = list.itemStats;

		if (total === 0) {
			statusCounts.empty++;
		} else if (resolved === total) {
			statusCounts.complete++;
		} else if (resolved === 0) {
			statusCounts.notStarted++;
		} else {
			statusCounts.inProgress++;
		}
	});

	return [
		{ name: 'Complete', value: statusCounts.complete, color: colors[0] }, // chart-1 (green)
		{ name: 'In Progress', value: statusCounts.inProgress, color: colors[3] }, // chart-4 (amber)
		{ name: 'Not Started', value: statusCounts.notStarted, color: colors[4] }, // chart-5 (coral)
		{ name: 'Empty', value: statusCounts.empty, color: colors[1] }, // chart-2 (teal)
	].filter((item) => item.value > 0); // Only return categories with values
};

/**
 * Calculate item completion statistics
 */
export const calculateItemCompletion = (items: ListItem[]): ItemCompletionStats => {
	const completed = items.filter((item) => item.completed).length;
	const pending = items.filter((item) => !item.completed).length;
	const total = items.length;

	return { completed, pending, total };
};

import { ShoppingListSummary } from '@/lib/types';
import { startTransition, useActionState } from 'react';
import { Button } from '../ui/button';
import { Spinner } from '../ui/spinner';
import { createList } from '@/lib/api';

type ListGridProps = {
	lists: ShoppingListSummary[];
};

export default async function ListGrid() {
	// const res = await fetch(String(process.env.NEXT_PUBLIC_API_URL + '/shopping-lists'));
	// console.log(res);
	// return (
	// 	<ul>
	// 		{/* {lists.map((list: any) => (
	// 			<li key={list.id}>{list.id}</li>
	// 		))} */}
	// 	</ul>
	// );
}

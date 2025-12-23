import { useMemo } from "react";

export default function useFilteredMenuItems(menuItems, searchTerm, selectedCategoryId) {
	return useMemo(() => {
		const term = searchTerm.trim().toLowerCase();

		const matchesSearch = (item) => {
			if (!term) return true;

			const itemName = (item.item_name || "").toLowerCase();
			const name = (item.name || "").toLowerCase();

			return itemName.includes(term) || name.includes(term);
		};

		const initialFilteredItems = menuItems.filter((item) => {
			const matchesCategory =
				!selectedCategoryId ||
				selectedCategoryId === "all" ||
				item.item_group === selectedCategoryId;

			return matchesCategory && matchesSearch(item);
		});

		// fallback: ignore category if nothing found
		if (initialFilteredItems.length === 0) {
			return menuItems.filter(matchesSearch);
		}

		return initialFilteredItems;
	}, [menuItems, searchTerm, selectedCategoryId]);
}

import { useMemo } from "react";

export function useFilteredMenuItems(menuItems, searchTerm, selectedCategoryId) {
	return useMemo(() => {
		const term = searchTerm.trim().toLowerCase();

		return menuItems.filter((item) => {
			const matchesCategory =
				!selectedCategoryId ||
				selectedCategoryId === "all" ||
				item.custom_menu_category === selectedCategoryId;

			const label = (item.item_name || item.name || "").toLowerCase();
			const matchesSearch = !term || label.includes(term);

			return matchesCategory && matchesSearch;
		});
	}, [menuItems, searchTerm, selectedCategoryId]);
}

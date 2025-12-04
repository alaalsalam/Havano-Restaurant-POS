import { useMemo } from "react";

export default function useFilteredMenuItems(menuItems, searchTerm, selectedCategoryId) {
	return useMemo(() => {
		const term = searchTerm.trim().toLowerCase();

		const initialfilteredItems = [...menuItems].filter((item) => {
			const matchesCategory =
				!selectedCategoryId ||
				selectedCategoryId === "all" ||
				item.custom_menu_category === selectedCategoryId;

			const label = (item.item_name || item.name || "").toLowerCase();
			const matchesSearch = !term || label.includes(term);

			return matchesCategory && matchesSearch;
		});

		if (initialfilteredItems.length === 0) {
			const filteredItems = menuItems.filter((item) => {
					const label = (item.item_name || item.name || "").toLowerCase();
					const matchesSearch = !term || label.includes(term);

					return matchesSearch;
				});

			return filteredItems;
		}


		return initialfilteredItems;
	}, [menuItems, searchTerm, selectedCategoryId]);
}

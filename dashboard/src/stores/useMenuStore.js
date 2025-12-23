import { create } from "zustand";

import { db } from "@/lib/frappeClient";
export const useMenuStore = create((set) => ({
  menuItems: [],
  menuCategories: [],
  productBundles: [],
  loading: false,
  error: null,

  // Fetch all menu items
  fetchMenuItems: async () => {
    set({ loading: true, error: null });
    try {
      const data = await db.getDocList("Item", {
			fields: ["name", "standard_rate", "item_name", "custom_menu_category", "item_group"],
			filters:  [
						["custom_do_not_show_in_pos", "=", 0],
						["disabled", "=", 0],
				  ],
			limit: 0,
		});
      set({ menuItems: data, loading: false });
    } catch (err) {
      console.error("Fetch error:", err);
      set({ error: err.message, loading: false });
    }
  },

  fetchProductBundles: async () => {
    set({ loading: true, error: null });
    try {
      const data = await db.getDocList("Product Bundle", {
        fields: ["name", "new_item_code"],
        limit: 0,
      });
      set({ productBundles: data, loading: false });
    } catch (err) {
      console.error("Fetch error:", err);
      set({ error: err.message, loading: false });
    }
  },

  fetchMenuCategories: async () => {
    set({ loading: true, error: null });
    try {
      const item_groups = await db.getDocList("Item Group", {
        fields: ["name", "item_group_name"],
      });
      const data = item_groups.map((group) => ({
        name: group.name,
        category_name: group.item_group_name,
      }));
      set({ menuCategories: data, loading: false });
    } catch (err) {
      console.error("Fetch error:", err);
      set({ error: err.message, loading: false });
    }
  },
}));

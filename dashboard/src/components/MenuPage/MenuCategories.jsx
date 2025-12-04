import { useMenuContext } from "@/contexts/MenuContext";

const MenuCategories = () => {
  const {
    selectedCategory,
    categoryColors,
    categoryCounts,
    visibleCategories,
    setSelectedCategory,
  } = useMenuContext();

  return (

        <div className="overflow-y-auto scrollbar-hide">
          <p className="text-xl text-black mb-2">Categories</p>
          <div className="grid grid-cols-1 gap-4">
            {visibleCategories.map((category) => (
              <div
                key={category.name}
                style={{ backgroundColor: categoryColors[category.name] }}
                className={`h-18 flex flex-col justify-between py-2 px-4 rounded-lg cursor-pointer ${
                  selectedCategory?.id === category.name
                    ? "ring-2 ring-white"
                    : ""
                }`}
                onClick={() =>
                  setSelectedCategory({
                    id: category.name,
                    name: category.category_name,
                  })
                }
              >
                <div className="flex justify-between items-center gap-2">
                  <h1 className="text-sm text-white font-bold">
                    {category.category_name}
                  </h1>

                  {selectedCategory?.id === category.name && (
                    <div className="border-2 border-white p-1 rounded-full">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>

                <p className="text-sm text-gray-200">
                  {categoryCounts[category.name] ?? 0}{" "}
                  {categoryCounts[category.name] === 1 ? "item" : "items"}
                </p>
              </div>
            ))}
          </div>
        </div>
  );
};

export default MenuCategories;

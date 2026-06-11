import React from "react";

export default function CategoryPills({
  categories = [],
  selectedCategory = "",
  onSelectCategory,
}) {
  return (
    <div className="relative border-t border-slate-100 pt-3 flex items-center select-none shrink-0">
      <div className="flex-grow overflow-x-auto no-scrollbar py-1 flex items-center gap-2">
        {categories.map((cat) => {
          const isAll = cat === "All";
          const isActive = isAll ? !selectedCategory : selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold tracking-wide shrink-0 transition-all duration-200 border cursor-pointer focus-indicator`}
              style={
                isActive
                  ? {
                      background: "#b91c1c",
                      color: "#faf9f6",
                      borderColor: "#b91c1c",
                      boxShadow: "0 4px 12px rgba(185, 28, 28, 0.15)",
                    }
                  : {
                      background: "#ffffff",
                      color: "#475569",
                      borderColor: "#e2e8f0",
                    }
              }
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}

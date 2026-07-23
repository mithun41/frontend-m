"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "@/lib/api/categoryService";
import { PriceRangeSlider } from "./PriceRangeSlider";

export function FilterSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category");

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const { data: rawCategories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryService.getAll,
  });

  const handleCategoryClick = (category: string | null) => {
    router.push(pathname + "?" + createQueryString("category", category || ""));
  };

  const isValueMatch = (targetVal: string | null, categoryVal: string | null) => {
    if (!targetVal && !categoryVal) return true;
    if (!targetVal || !categoryVal) return false;
    return targetVal.toLowerCase() === categoryVal.toLowerCase();
  };

  type SidebarCategory = {
    label: string;
    value: string | null;
    subcategories?: { label: string; value: string }[];
  };

  const categories: SidebarCategory[] = [
    { label: "All Categories", value: null },
    ...(rawCategories || []).map(cat => ({
      label: cat.name,
      value: cat.slug || cat.name,
      subcategories: cat.subcategories?.map(sub => ({
        label: sub.name,
        value: sub.slug || sub.name,
      })) || []
    }))
  ];

  return (
    <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-8 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 h-fit shadow-sm">
      <div>
        <h3 className="font-bold mb-4 uppercase tracking-wider text-xs text-neutral-500">Categories</h3>
        {isLoading ? (
          <div className="flex justify-center py-4 text-sm text-neutral-500">Loading...</div>
        ) : (
          <div className="flex flex-col gap-2.5 text-sm font-medium">
            {categories.map((cat) => {
              const isActive = isValueMatch(currentCategory, cat.value);
              const isSubActive = cat.subcategories?.some((sub) => isValueMatch(currentCategory, sub.value)) ?? false;
              const isExpandedOnMobile = isActive || isSubActive;

              return (
                <div key={cat.label} className="group relative flex flex-col gap-1.5">
                  <span
                    onClick={() => handleCategoryClick(cat.value)}
                    className={`cursor-pointer transition-colors hover:text-primary-500 py-1 ${
                      isActive || isSubActive ? "text-primary-500 font-bold" : "text-neutral-700 dark:text-neutral-300"
                    }`}
                  >
                    {cat.label}
                  </span>
                  
                  {cat.subcategories && cat.subcategories.length > 0 && (
                    <>
                      {/* Desktop Hover Flyout */}
                      <div className="hidden lg:group-hover:flex absolute left-full top-0 ml-6 flex-col gap-2.5 w-56 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-xl z-50 before:content-[''] before:absolute before:-left-6 before:top-0 before:bottom-0 before:w-6">
                        <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">{cat.label}</h4>
                        {cat.subcategories.map((sub) => {
                          const isSubItemActive = isValueMatch(currentCategory, sub.value);
                          return (
                            <span
                              key={sub.label + sub.value}
                              onClick={() => handleCategoryClick(sub.value)}
                              className={`cursor-pointer text-sm transition-colors hover:text-primary-500 ${
                                isSubItemActive ? "text-primary-500 font-bold" : "text-neutral-600 dark:text-neutral-400"
                              }`}
                            >
                              {sub.label}
                            </span>
                          );
                        })}
                      </div>

                      {/* Mobile Accordion Fallback */}
                      <div className={`lg:hidden flex-col gap-2 ml-3 border-l-2 border-neutral-100 dark:border-neutral-800 pl-3 mt-1 ${isExpandedOnMobile ? "flex" : "hidden"}`}>
                        {cat.subcategories.map((sub) => {
                          const isSubItemActive = isValueMatch(currentCategory, sub.value);
                          return (
                            <span
                              key={sub.label + sub.value}
                              onClick={() => handleCategoryClick(sub.value)}
                              className={`cursor-pointer text-xs transition-colors hover:text-primary-500 ${
                                isSubItemActive ? "text-primary-500 font-semibold" : "text-neutral-500 dark:text-neutral-400"
                              }`}
                            >
                              {sub.label}
                            </span>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <hr className="border-neutral-200 dark:border-neutral-800" />

      <div>
        <h3 className="font-bold mb-4 uppercase tracking-wider text-xs text-neutral-500">Price Range</h3>
        <PriceRangeSlider minLimit={0} maxLimit={10000} />
      </div>
    </aside>
  );
}

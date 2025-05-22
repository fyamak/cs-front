"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";
import AddProductModal from "@/components/add-product-modal";
import UseFetchProducts from "@/hooks/use-fetch-products";
import UseFetchCategories from "@/hooks/use-fetch-categories";

import { List, AutoSizer } from "react-virtualized";
import "react-virtualized/styles.css"; // optional default styles
import { useDebounce } from "use-debounce";

export default function ProductPage() {
  const [search, setSearch] = useState("");
  const [searchDebounce] = useDebounce(search, 300);
  const [category, setCategory] = useState(0);
  const [isModalOpen, setModalOpen] = useState(false);

  const { products, fetchProducts } = UseFetchProducts();
  const { categories, categoryMap, fetchCategories } = UseFetchCategories();


  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const filteredProducts = products.filter((product) => {
    const lowerSearch = searchDebounce.toLowerCase();
    const matchesSearch =
      product.name.toLowerCase().includes(lowerSearch) ||
      product.sku.toLowerCase().includes(lowerSearch);
    const matchesCategory = category === 0 || product.categoryId === category;
    return matchesSearch && matchesCategory;
  });

  const getStockBadge = (quantity: number) => {
    const isInStock = quantity > 0;
    const styles = isInStock
      ? "bg-green-200 text-green-800"
      : "bg-red-200 text-red-800";

    const label = isInStock ? "In Stock" : "Insufficient Stock";
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${styles}`}>
        {" "}
        {label}{" "}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Inventory</h1>
        <button
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition"
          onClick={() => setModalOpen(true)}
        >
          New Product
        </button>
      </div>

      <div className="flex space-x-4">
        <input
          type="text"
          placeholder="Search products..."
          className="flex-1 px-3 py-2 border rounded-md text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <VirtualizedCategoryDropdown
          selectedId={category}
          onChange={(id) => setCategory(id)}
          options={[{ id: 0, name: "All Categories" }, ...categories]}
        />
      </div>

      <div className="overflow-x-auto border rounded-md">
        <AutoSizer disableHeight>
          {({ width }) => (
            <List
              width={width}
              height={600}
              rowCount={filteredProducts.length}
              rowHeight={60}
              rowRenderer={({ index, key, style }) => {
                const product = filteredProducts[index];
                return (
                  <div
                    key={key}
                    style={style}
                    className="flex border-b px-4 py-2 items-center text-sm"
                  >
                    <div className="w-1/5">
                      <Link
                        href={`/product/${product.id}`}
                        className="font-semibold hover:underline"
                      >
                        {product.name}
                      </Link>
                    </div>
                    <div className="w-1/5">{product.sku}</div>
                    <div className="w-1/5">
                      {categoryMap.get(product.categoryId) ??
                        "Unknown Category"}
                    </div>
                    <div className="w-1/5">{product.totalQuantity}</div>
                    <div className="w-1/5">
                      {getStockBadge(product.totalQuantity)}
                    </div>
                  </div>
                );
              }}
            />
          )}
        </AutoSizer>
      </div>
      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={fetchProducts}
      />
    </div>
  );
}







function VirtualizedCategoryDropdown({
  selectedId,
  onChange,
  options,
}: {
  selectedId: number;
  onChange: (id: number) => void;
  options: { id: number; name: string }[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selected = options.find((opt) => opt.id === selectedId);

  const rowRenderer = ({ index, key, style }: any) => {
    const option = options[index];
    return (
      <div
        key={key}
        style={style}
        className="px-3 py-2 hover:bg-gray-200 cursor-pointer"
        onClick={() => {
          onChange(option.id);
          setIsOpen(false);
        }}
      >
        {option.name}
      </div>
    );
  };

  return (
    <div className="relative w-[200px]" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border rounded-md text-sm bg-white text-left"
      >
        {selected?.name || "All Categories"}
      </button>
      {isOpen && (
        <div className="absolute z-10 w-full max-h-[300px] border mt-1 bg-white overflow-auto shadow-lg">
          <AutoSizer disableHeight>
            {({ width }) => (
              <List
                width={width}
                height={300}
                rowCount={options.length}
                rowHeight={35}
                rowRenderer={rowRenderer}
              />
            )}
          </AutoSizer>
        </div>
      )}
    </div>
  );
}

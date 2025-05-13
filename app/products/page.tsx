"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AddProductModal from "@/components/add-product-modal";
import UseFetchProducts from "@/hooks/use-fetch-products";
import UseFetchCategories from "@/hooks/use-fetch-categories";
import { Input, Select } from "@mantine/core";
import { Pagination, Text } from "@mantine/core";

const ITEMS_PER_PAGE = 100;

export default function TryPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>("");
  const [isModalOpen, setModalOpen] = useState(false);

  const { products, fetchProducts } = UseFetchProducts();
  const { categories, categoryMap, fetchCategories } = UseFetchCategories();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);


  const categoryOptions = categories.map((c) => ({
    value: c.id.toString(), // convert ID to string for Select
    label: c.name,
  }));

  const filteredProducts = products.filter((product) => {
    const category = Number(selectedCategory);
    const lowerSearch = search.toLowerCase();
    const matchesSearch =
      product.name.toLowerCase().includes(lowerSearch) ||
      product.sku.toLowerCase().includes(lowerSearch);
    const matchesCategory = category === 0 || product.categoryId === category;
    return matchesSearch && matchesCategory;
  });


  //pagination
  const [activePage, setPage] = useState(1);
  const message = `Showing ${ITEMS_PER_PAGE * (activePage - 1) + 1} – ${Math.min(filteredProducts.length, ITEMS_PER_PAGE * activePage)} of ${filteredProducts.length}`;
  const data = chunk(filteredProducts, ITEMS_PER_PAGE);
  const items =
    data.length > 0 ? (
      data[activePage - 1].map((item) => (
        <tr key={item.id} className="hover:bg-gray-50">
          <td className="px-4 py-2 font-medium">
            <Link
              href={`/product/${item.id}`}
              className="font-semibold hover:underline"
            >
              {item.name}
            </Link>
          </td>
          <td className="px-4 py-2">{item.sku}</td>
          <td className="px-4 py-2">{categoryMap.get(item.categoryId)?? "Unknown Category"}</td>
          <td className="px-4 py-2">{item.totalQuantity}</td>
          <td className="px-4 py-2">
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                item.totalQuantity > 0
                  ? "bg-green-200 text-green-800"
                  : "bg-red-200 text-red-800"
              }`}
            >
              {item.totalQuantity > 0 ? "In Stock" : "Insufficient Stock"}
            </span>
          </td>
        </tr>
      ))
    ) : (
      <></>
    );



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
        <Input
          className="flex-1"
          placeholder="Search products..."
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
          rightSection={
            search !== "" ? (
              <Input.ClearButton onClick={() => setSearch("")} />
            ) : undefined
          }
          rightSectionPointerEvents="auto"
          size="md"
        />

        <Select
          placeholder="Select Category"
          limit={50}
          data={categoryOptions}
          value={selectedCategory}
          onChange={setSelectedCategory}
          searchable
          clearable
          size="md"
        />
      </div>

      <div className="overflow-x-auto border rounded-md">
        <table className="min-w-full text-l text-left">
          <thead className="bg-gray-100 text-xl uppercase text-gray-600">
            <tr className="font-bold">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">SKU</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">{items}</tbody>
        </table>
      </div>

      <div className="flex flex-col items-center mt-10">
        <Text className="text-gray-500" size="sm">{message}</Text>
        <Pagination
          total={data.length}
          value={activePage}
          onChange={setPage}
          siblings={2}
          mt="md"
          size="lg"
        />
      </div>
      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={fetchProducts}
      />
    </div>
  );
}

function chunk<T>(array: T[], size: number): T[][] {
  if (!array.length) {
    return [];
  }
  const head = array.slice(0, size);
  const tail = array.slice(size);
  return [head, ...chunk(tail, size)];
}

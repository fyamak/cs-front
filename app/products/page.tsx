"use client"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link";
import AddProductModal from "@/components/add-product-modal";
import UseFetchProducts from "@/hooks/use-fetch-products";
import UseFetchCategories from "@/hooks/use-fetch-categories";


export default function ProductPage() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState(0)
  const [isModalOpen, setModalOpen] = useState(false);

  const { products, fetchProducts } = UseFetchProducts();
  const { categories, categoryMap, fetchCategories } = UseFetchCategories();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [])
  
  const filteredProducts = products.filter((product) => {
    const lowerSearch = search.toLowerCase();
    const matchesSearch = product.name.toLowerCase().includes(lowerSearch) || product.sku.toLowerCase().includes(lowerSearch);
    const matchesCategory = category === 0 || product.categoryId === category;
    return matchesSearch && matchesCategory;
  });


  const getStockBadge = (quantity: number) => {
    const isInStock = quantity > 0;
    const styles = isInStock
      ? "bg-green-200 text-green-800"
      : "bg-red-200 text-red-800";
  
    const label = isInStock ? "In Stock" : "Insufficient Stock";
    return <span className={`px-2 py-1 text-xs rounded-full ${styles}`}> {label} </span>
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
        <select
          className="w-[200px] px-3 py-2 border rounded-md text-sm"
          value={category}
          onChange={(e) => setCategory(Number(e.target.value))}
        >
          <option value={0}>All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))

          }
        </select>
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
          <tbody className="divide-y">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium">
                    <Link href={`/product/${product.id}`} className="font-semibold hover:underline">
                      {product.name}
                    </Link>
                    </td>
                <td className="px-4 py-2">{product.sku}</td>
                <td className="px-4 py-2">{categoryMap.get(product.categoryId)?? "Unknown Category"}</td>
                <td className="px-4 py-2">{product.totalQuantity}</td>
                <td className="px-4 py-2">{getStockBadge(product.totalQuantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AddProductModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} onSubmit={fetchProducts} />
    </div>
  )
}

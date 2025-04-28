"use client"

import { useEffect, useState, useMemo } from "react"
import { Plus } from "lucide-react"
import { getData } from "@/utils/api"
import Link from "next/link";
import AddProductModal from "@/components/AddProductModal";

interface Product {
  id: number,
  sku: string,
  name: string,
  totalQuantity: number,
  category: string
}

interface Response {
  status: string
  message: string,
  data: Product[]
}


export default function InventoryPage() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);


  useEffect(() => {
    fetchProducts()
  }, [])
  
  
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const lowerSearch = search.toLowerCase();
      const matchesSearch = product.name.toLowerCase().includes(lowerSearch) || product.sku.toLowerCase().includes(lowerSearch);
      const matchesCategory = category === "all" || product.category.toLowerCase() === category.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);


  const fetchProducts = async () => {
    try {
        const res = await getData("products");
        const response : Response = res.data
        setProducts(response.data || []);
    } catch (error) {
        console.log('Error fetching products:', error);
    }
  }

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
          <Plus className="mr-2 h-4 w-4" />
          Add Product
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
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="furniture">Furniture</option>
          <option value="office">Office Supplies</option>
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
                <td className="px-4 py-2">{product.category}</td>
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

"use client"
import { getData } from '@/utils/api';
import React, { useEffect, useState } from 'react'
import ProductCard from '@/components/ProductCard';
import AddProductModal from '@/components/AddProductModal';

interface Product {
    id: number;
    name: string;
}

interface Response {
  data: Product[]
  message: string,
  status: string
}


const page = () => {
    const [token, setToken] = useState<string | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [isModalOpen, setModalOpen] = useState(false);
    
    const fetchProducts = async () => {
        try {
            const res = await getData("products");
            const response : Response = res.data
            setProducts(response.data || []);

        } catch (error) {
            console.log('Error fetching products:', error);
        }
    };
  
    useEffect(() => {
      if (typeof window !== 'undefined') {
        const storedToken = localStorage.getItem("accessToken");
        setToken(storedToken);
      }
    }, []);
  
    useEffect(() => {
      fetchProducts();
    }, [token]);


  return (
    <>
      <div className='flex flex-wrap gap-4 p-2'>
        <div className='w-full flex justify-start pl-8 mt-8 '>
          <button 
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            onClick={() => setModalOpen(true)}
            >
            Add Product
          </button>
        </div>
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <p>No products found</p>
            )}
        </div>
        <AddProductModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} onSubmit={fetchProducts} />,
    </>
  )
}

export default page

import Link from 'next/link';
import React from 'react';

interface ProductProps {
  product: {
    id: number;
    name: string;
  }
}

const ProductCard = ({ product }: ProductProps) => {
  return (
    <div className="mt-6 ml-6 bg-white shadow-md rounded-2xl overflow-hidden w-72  transition-transform transform hover:scale-105">
        <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-900 truncate  hover:text-indigo-400">
                <Link href={"/products/"+product.id}>
                    {product.name}
                </Link> 
            </h2>
            <p className="text-sm text-gray-500 mt-1">Remaining can be added</p>
            <div className="flex justify-between items-center mt-4">
                <Link href={{ pathname: "/products/" + product.id + "/supplies", query: { name: product.name } }}>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition">
                        Add Supply
                    </button>
                </Link>
                <Link href={{ pathname: "/products/" + product.id + "/sales", query: { name: product.name } }}>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition">
                        Add Sale
                    </button>
                </Link>
            </div>
        </div>
    </div>
  );
};

export default ProductCard;

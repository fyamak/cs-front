import React, { use, useEffect, useState } from 'react'
import { IconX, IconCheck } from '@tabler/icons-react';
import { Notification } from '@mantine/core';
import { getData, postData } from '@/utils/api';


interface Product {
    id: number,
    name: string,
}

interface Organization{
    id: number,
    name: string,
}

const AddOrderModal = ({ isOpen, onClose, onSubmit }: { isOpen: boolean; onClose: () => void; onSubmit: () => void;}) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [organizations, setOrganizations] = useState<Organization[]>([]);

    const [selectedProduct, setSelectedProduct] = useState<number>();
    const [selectedOrganization, setSelectedOrganization] = useState<number>();
    const [quantity, setQuantity] = useState<number>(0);
    const [price, setPrice] = useState("");
    const [date, setDate] = useState<string>("");
    const [orderType, setOrderType] = useState<string | null>(null);

    const [status, setStatus] = useState<"success" | "error" | null>(null);
    const [message, setMessage] = useState<string>("");


    useEffect(() => {
        fetchProducts();
        fetchOrganizations();
    }, [])
    
    const fetchOrganizations = async () => {
        try {
            const res = await getData("api/organization");
            const response = res.data
            setOrganizations(response.data || []);
        } catch (error) {
            console.log('Error fetching products:', error);
        }
    }

    const fetchProducts = async () => {
        try {
            const res = await getData("products");
            const response = res.data
            setProducts(response.data || []);
        } catch (error) {
            console.log('Error fetching products:', error);
        }
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!orderType) {
                setMessage("Please select an order type.");
                setStatus("error");
                setTimeout(() => setStatus(null), 3000);
                return;
            }

            const res = await postData("orders", {
                productId: selectedProduct,
                organizationId : selectedOrganization,
                quantity: quantity,
                price: parseFloat(price),
                date: date + ":00.000Z",
                type: orderType
            });
            const response = res.data


            if (response.status === "Success") {
                setMessage(response.message)
                setStatus("success");
                onSubmit()
            } else {
                setMessage(response.message)
                setStatus("error");
            }
  
        } catch (error) {
            setStatus("error");
            console.log("Error: ", error)        
        }
        setTimeout(() => setStatus(null), 3000);          

    };
    

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-white/80 flex justify-center items-center z-50">
        {status && (
          <div className="fixed top-28 right-5">
            <Notification
              withCloseButton={false}
              icon={
                status === "success" ? (
                  <IconCheck size={20} />
                ) : (
                  <IconX size={20} />
                )
              }
              color={status === "success" ? "teal" : "red"}
              withBorder
              title={status === "success" ? "Success" : "Error"}
            >
              {message}
            </Notification>
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h3 className="text-xl font-bold mb-4">Add New Order</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-900">
                Product
              </label>
              <select
                value={selectedProduct ?? ""}
                onChange={(e) => setSelectedProduct(Number(e.target.value))}
                className="px-4 py-2 border rounded-md shadow-sm w-full"
                required
              >
                <option value="" disabled>
                  -- Select Product --
                </option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-900">
                Organization
              </label>
              <select
                value={selectedOrganization ?? ""}
                onChange={(e) =>
                  setSelectedOrganization(Number(e.target.value))
                }
                className="px-4 py-2 border rounded-md shadow-sm w-full"
                required
              >
                <option value="" disabled>
                  -- Select Organization --
                </option>
                {organizations.map((organization) => (
                  <option key={organization.id} value={organization.id}>
                    {organization.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-900">
                Quantity
              </label>
              <input
                type="number"
                step={1}
                // min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-900">
                Price
              </label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-900">
                Date
              </label>
              <input
                type="datetime-local"
                id="date"
                value={date}
                className="w-full p-2 border border-gray-300 rounded-lg"
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Order Type
              </label>
              <div className="flex gap-2 w-full">
                <button
                  type="button"
                  onClick={() => setOrderType("supply")}
                  className={`w-1/2 px-4 py-2 rounded-lg border ${
                    orderType === "supply"
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-700"
                  }`}
                >
                  Supply
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType("sale")}
                  className={`w-1/2 px-4 py-2 rounded-lg border ${
                    orderType === "sale"
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-700"
                  }`}
                >
                  Sale
                </button>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 active:scale-95 active:opacity-80 transition-transform duration-100"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 active:scale-95 active:opacity-80 transition-transform duration-100"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
};

export default AddOrderModal;

import React, { useEffect, useState } from 'react'
import { IconX, IconCheck } from '@tabler/icons-react';
import { Notification } from '@mantine/core';
import { getData, postData } from '@/utils/api';
import { Select } from '@mantine/core';

interface Response {
    data: object,
    message: string,
    status: string
}

interface Category{
  id: number,
  name: string
}

const AddProductModal = ({ isOpen, onClose, onSubmit }: { isOpen: boolean; onClose: () => void; onSubmit: () => void;}) => {
  const [sku, setSku] = useState("");
  const [productName, setProductName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchValue, setSearchValue] = useState('');

  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const [message, setMessage] = useState<string>("");

  const categoryOptions = categories.map((c) => ({
    value: c.id.toString(), // convert ID to string for Select
    label: c.name,
  }));

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await getData("api/category");
      const response = res.data;
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await postData(`products`, {
        sku: sku,
        name: productName,
        categoryId: Number(selectedCategory),
      });
      const response: Response = res.data;

      if (response.status === "Success") {
        setMessage(response.message);
        setStatus("success");
        onSubmit();
      } else {
        setMessage(response.message);
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
      console.log("Error: ", error);
    }
    setTimeout(() => setStatus(null), 3000);
  };

  const handleCreateCategory = async (name: string) => {
    console.log("selectedCategory: ", selectedCategory)
    console.log("name: ", name)

    try {
      const res = await postData('api/category', { name });
      const response = res.data;
      const newCategory = response.data
      setSelectedCategory(newCategory.id);
      fetchCategories()
    } catch (error) {
      console.error("Failed to create category:", error);
    }
  }

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
        <h3 className="text-xl font-bold mb-4">Add New Product</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-900">
              SKU
            </label>
            <input
              type="text"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-900">
              Name
            </label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-900">
              Category
            </label>
            <Select
              placeholder="Pick value"
              data={categoryOptions}
              value={selectedCategory}
              onChange={setSelectedCategory}
              onSearchChange={setSearchValue}
              nothingFoundMessage={
                <div className="text-blue-600 cursor-pointer" onClick={() => handleCreateCategory(searchValue)}>
                  Create "{searchValue}" 
                </div>
              }
              searchable
              clearable
              required
            />
          </div>

          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg transition transform active:scale-95 duration-100"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg transition transform active:scale-95 duration-100"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;

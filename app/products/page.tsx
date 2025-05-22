"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AddProductModal from "@/components/add-product-modal";
import UseFetchProducts from "@/hooks/use-fetch-products";
import UseFetchCategories from "@/hooks/use-fetch-categories";
import { Box, Button, Input, LoadingOverlay, Select } from "@mantine/core";
import { Pagination, Text } from "@mantine/core";
import { postData } from "@/utils/api";
import { IAddProductForm } from "@/types/product-types";
import { IResponse } from "@/types/api-response-types";
import { IconX, IconCheck } from "@tabler/icons-react";
import { Notification } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import ProductCard from "@/components/product-card";
import { useDebounce } from "use-debounce";

const ITEMS_PER_PAGE = 100;

export default function ProductPage() {
  const isMobile = useMediaQuery("(max-width: 50em)");
  const [search, setSearch] = useState("");
  const [searchDebounce] = useDebounce(search, 500);
  const [selectedCategory, setSelectedCategory] = useState<string | null>("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  const { products, fetchProducts } = UseFetchProducts();
  const { categories, categoryMap, fetchCategories } = UseFetchCategories();

  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    async function fetchData() {
      setVisible(true);
      await Promise.all([fetchProducts(), fetchCategories()]);
      setVisible(false);
    }
    fetchData();
  }, []);

  const categoryOptions = categories.map((c) => ({
    value: c.id.toString(), // convert ID to string for Select
    label: c.name,
  }));

  const filteredProducts = products.filter((product) => {
    const category = Number(selectedCategory);
    const lowerSearch = searchDebounce.toLowerCase();
    const matchesSearch =
      product.name.toLowerCase().includes(lowerSearch) ||
      product.sku.toLowerCase().includes(lowerSearch);
    const matchesCategory = category === 0 || product.categoryId === category;
    return matchesSearch && matchesCategory;
  });

  //pagination
  const [activePage, setPage] = useState(1);
  const paginationMessage = `Showing ${
    ITEMS_PER_PAGE * (activePage - 1) + 1
  } – ${Math.min(filteredProducts.length, ITEMS_PER_PAGE * activePage)} of ${
    filteredProducts.length
  }`;
  const data = chunk(filteredProducts, ITEMS_PER_PAGE);
  const items =
    data.length > 0 ? (
      !isMobile ? (
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
            <td className="px-4 py-2">
              {categoryMap.get(item.categoryId) ?? "Unknown Category"}
            </td>
            <td className="px-4 py-2">{item.totalQuantity}</td>
            <td className="px-4 py-2">
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  item.totalQuantity > 0
                    ? "bg-green-200 text-green-800"
                    : "bg-red-200 text-red-800"
                }`}
              >
                {item.totalQuantity > 0 ? "Stocked" : "Empty"}
              </span>
            </td>
          </tr>
        ))
      ) : (
        data[activePage - 1].map((item) => (
          <ProductCard
            key={item.id}
            name={item.name}
            sku={item.sku}
            totalQuantity={item.totalQuantity}
            categoryName={
              categoryMap.get(item.categoryId) ?? "Unknown Category"
            }
          />
        ))
      )
    ) : (
      <></>
    );

  const handleAddProductModel = async (formData: IAddProductForm) => {
    try {
      const res = await postData(`products`, {
        sku: formData.sku,
        name: formData.productName,
        categoryId: Number(formData.categoryId),
      });
      const response: IResponse = res.data;

      if (response.status === "Success") {
        setMessage(response.message);
        setStatus("success");
        fetchProducts();
        if (formData.isCategoryUpdated) {
          fetchCategories();
        }
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

  return (
    <div className="space-y-6">
      {status && (
        <div className="fixed top-24 right-2 sm:right-5 z-[9999]">
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

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Inventory</h1>
        <Button
          size={isMobile ? "sm" : "md"}
          variant="filled"
          onClick={() => setModalOpen(true)}
        >
          New Product
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
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
          size={isMobile ? "sm" : "md"}
        />

        <Select
          placeholder="Select Category"
          limit={20}
          data={categoryOptions}
          value={selectedCategory}
          onChange={setSelectedCategory}
          searchable
          clearable
          size={isMobile ? "sm" : "md"}
        />
      </div>

      <Box pos="relative">
        <LoadingOverlay
          visible={visible}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />

        {!isMobile ? (
          <div className="overflow-x-auto border rounded-md">
            <table className="min-w-full text-l text-left">
              <thead className="bg-gray-100 text-gray-600 text-base sm:text-xl uppercase">
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
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {items}
          </div>
        )}

        <div className="flex flex-col items-center mt-10">
          <Text className="text-gray-500" size="sm">
            {paginationMessage}
          </Text>
          <Pagination
            total={data.length}
            value={activePage}
            onChange={setPage}
            siblings={isMobile ? 1 : 2}
            mt="md"
            size={isMobile ? "sm" : "lg"}
          />
        </div>

        <AddProductModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleAddProductModel}
          />
        </Box>
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

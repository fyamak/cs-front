"use client";

import { useEffect, useRef, useState } from "react";
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

const PRODUCT_PAGE_SIZE = 100;
const CATEGORY_PAGE_SIZE = 20;

export default function ProductPage() {
  const isMobile = useMediaQuery("(max-width: 50em)");
  const isFirstRender = useRef(true);

  const [productSearch, setProductSearch] = useState("");
  const [productSearchDebounce] = useDebounce(productSearch, 1000);
  const [categorySearch, setCategorySearch] = useState("");
  const [categorySearchDebounce] = useDebounce(categorySearch, 1000);
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<string | null>("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [activePage, setActivePage] = useState(1);
  
  const { pagedProductsResponse, fetchPagedProducts } = UseFetchProducts();
  const { pagedCategories, fetchPagedCategories } = UseFetchCategories();

  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
  const fetchData = async () => {
    setVisible(true);
    await fetchPagedProducts(1, PRODUCT_PAGE_SIZE);
    setVisible(false);
    isFirstRender.current = false;
  }
  fetchData()
}, []);

  useEffect(()=>{
    if (isFirstRender.current) return; // Skip on first render

    const fetchData = async () => {
      setVisible(true);
      await fetchPagedProducts(activePage, PRODUCT_PAGE_SIZE, productSearchDebounce, Number(selectedCategory));
      setVisible(false);
    }
    fetchData()
  }, [activePage])

  useEffect(() => {
    if (isFirstRender.current) return; // Skip on first render

    const fetchData = async () => {
      setVisible(true);
      setActivePage(1);
      await fetchPagedProducts(activePage, PRODUCT_PAGE_SIZE, productSearchDebounce, Number(selectedCategory));
      setVisible(false);
    }
    fetchData()
  }, [productSearchDebounce,selectedCategory]);

  
  useEffect(()=> {
    setIsCategoryLoading(true)
  }, [categorySearch])

  useEffect(()=> {
    fetchPagedCategories(1, CATEGORY_PAGE_SIZE, categorySearchDebounce)
    setIsCategoryLoading(false)
  }, [categorySearchDebounce])



  const categoryOptions = pagedCategories.map((c) => ({
    value: c.id.toString(),
    label: c.name,
  }));

 
  const paginationMessage = `Showing ${
    PRODUCT_PAGE_SIZE * (activePage - 1) + 1
  } – ${Math.min(pagedProductsResponse?.totalCount || 0, PRODUCT_PAGE_SIZE * activePage)} of ${
    pagedProductsResponse?.totalCount
  }`;


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
        setActivePage(1);
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
          value={productSearch}
          onChange={(event) => setProductSearch(event.currentTarget.value)}
          rightSection={
            productSearch !== "" ? (
              <Input.ClearButton onClick={() => setProductSearch("")} />
            ) : undefined
          }
          rightSectionPointerEvents="auto"
          size={isMobile ? "sm" : "md"}
        />

        <Select
          placeholder="Select Category"
          data={categoryOptions}
          value={selectedCategory}
          onChange={setSelectedCategory}
          onSearchChange={setCategorySearch}
          searchable
          clearable
          size={isMobile ? "sm" : "md"}
          nothingFoundMessage={
          isCategoryLoading ? (
            "Loading..."
          ) : (
            "No categories found"
          )
        }
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
              <tbody className="divide-y">
                {pagedProductsResponse?.data.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 font-medium">
                        <Link href={`/product/${product.id}`} className="font-semibold hover:underline">
                          {product.name}
                        </Link>
                        </td>
                    <td className="px-4 py-2">{product.sku}</td>
                    <td className="px-4 py-2">{product.categoryName}</td>
                    <td className="px-4 py-2">{product.totalQuantity}</td>
                    <td className="px-4 py-2">{getStockBadge(product.totalQuantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {pagedProductsResponse?.data.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                sku={product.sku}
                totalQuantity={product.totalQuantity}
                categoryName={product.categoryName}
              />
            ))}
          </div>
        )}

        <div className="flex flex-col items-center mt-10">
          <Text className="text-gray-500" size="sm">
            {paginationMessage}
          </Text>
          <Pagination
            total={Math.ceil((pagedProductsResponse?.totalCount || 0) / PRODUCT_PAGE_SIZE)}
            value={activePage}
            onChange={setActivePage}
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
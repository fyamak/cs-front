import UseFetchCategories from "@/hooks/use-fetch-categories";
import { IAddProductForm } from "@/types/product-types";
import { postData } from "@/utils/api";
import { Modal, TextInput, Button, InputBase, Select } from "@mantine/core";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: IAddProductForm) => void;
};

const CATEGORY_PAGE_SIZE = 20;

export default function AddProductModal({ isOpen, onClose, onSubmit }: Props) {
  const [loading, setLoading] = useState(false);

  const [searchValue, setSearchValue] = useState("");
  const [searchDebounce] = useDebounce(searchValue, 1000);

  const [sku, setSku] = useState("");
  const [productName, setProductName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>("");

  const { pagedCategories, fetchPagedCategories } = UseFetchCategories();

  const categoryOptions = pagedCategories.map((c) => ({
    value: c.id.toString(), // convert ID to string for Select
    label: c.name,
  }));

  useEffect(() => {
    setLoading(true);
  }, [searchValue]);

  useEffect(() => {
    if(isOpen){
      fetchPagedCategories(1,CATEGORY_PAGE_SIZE, searchDebounce).finally(() =>
        setLoading(false)
      );
    }
  }, [isOpen, searchDebounce]);

  const handleSubmit = () => {
    onSubmit({
      sku: sku,
      productName: productName,
      categoryId: selectedCategory,
    });
    onClose();
    setSku("");
    setProductName("");
    setSelectedCategory("");
  };

  const handleCreateCategory = async (name: string) => {
    try {
      const res = await postData("api/category", { name });
      const response = res.data;
      const newCategory = response.data;
      setSelectedCategory(newCategory.id);
    } catch (error) {
      console.error("Failed to create category:", error);
    }
  };

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={<div className="font-bold text-xl">Add Product</div>}
      size={"lg"}
    >
      <TextInput
        value={sku}
        onChange={(event) => setSku(event.currentTarget.value)}
        label="SKU"
        placeholder="SKU"
        role="presentation"
        autoComplete="off"
        required
      />
      <TextInput
        value={productName}
        onChange={(event) => setProductName(event.currentTarget.value)}
        label="Product Name"
        placeholder="Product name"
        mt="md"
        role="presentation"
        autoComplete="off"
        required
      />
      <Select
        value={selectedCategory}
        onChange={setSelectedCategory}
        onSearchChange={setSearchValue}
        data={categoryOptions}
        label="Category"
        placeholder="Select Category"
        limit={20}
        mt="md"
        nothingFoundMessage={
          loading ? (
            "Loading..."
          ) :
          (
            <div
            className="text-blue-600 cursor-pointer"
            onClick={() => handleCreateCategory(searchValue)}
            >
              Create "{searchValue}"
            </div>
          )
        }
        searchable
        clearable
        required
      />

      <div className="text-center">
        <Button onClick={handleSubmit} type="submit" mt="md">
          Submit
        </Button>
      </div>
    </Modal>
  );
}

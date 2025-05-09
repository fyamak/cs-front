import { IResponse } from "@/types/api-response-types";
import { IProduct } from "@/types/product-types";
import { getData } from "@/utils/api";
import { useState, useMemo } from "react";

const UseFetchProducts = () => {
  const [products, setProducts] = useState<IProduct[]>([]);

  const fetchProducts = async () => {
    try {
      const axiosResponse = await getData("products");
      const response : IResponse = axiosResponse.data
      if(response.status === 'Success'){
        setProducts(response.data);
      }
      return response;
    } catch (err) {
      console.error(err);
    }
  };  

  const productMap = new Map<number, string>();
  products.forEach((prod) => productMap.set(prod.id, prod.name));

  

  return { products , productMap, fetchProducts};
};

export default UseFetchProducts;

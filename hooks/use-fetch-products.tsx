import { IResponse } from "@/types/api-response-types";
import { IPagedProductResponse, IProduct, ITransaction, ITransactionResponse } from "@/types/product-types";
import { getData } from "@/utils/api";
import { DateValue } from "@mantine/dates";
import { useState, useMemo } from "react";

const UseFetchProducts = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [pagedProductsResponse, setPagedProductsResponse] = useState<IPagedProductResponse>();
  const [pagedTransactionsResponse, setPagedTransactionsResponse] = useState<ITransactionResponse>();

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


  const fetchPagedProducts = async (pageNumber: number, pageSize: number, search?: string, categoryId?: number) => {
    try{
      var endpoint : string = `Products/Paged?pageNumber=${pageNumber}&pageSize=${pageSize}`
      if(search){
        endpoint += `&search=${search}`
      }
      if(categoryId){
        endpoint += `&categoryId=${categoryId}`
      }
      const { data: response } = await getData(endpoint)
      
      if(response.status === "Success"){
        setPagedProductsResponse(response)
        return;
      }
      return [];
    } catch(err){
      console.error(err)
    }
  }


const fetchPagedTransactions = async (
  pageNumber: number,
  pageSize: number,
  startDate: string | undefined,
  endDate: string | undefined,
  includeFailures: string | null,
  productId?: string | null
): Promise<ITransactionResponse> => {
  try {
    let endpoint = `Paged/Transactions?pageNumber=${pageNumber}&pageSize=${pageSize}&startDate=${startDate}&endDate=${endDate}&includeFailures=${includeFailures}`;
    
    if (productId) {
      endpoint += `&productId=${productId}`;
    }

    const { data: response }: { data: ITransactionResponse } = await getData(endpoint);
    
    setPagedTransactionsResponse(response);
    return response;

  } catch (err) {
    console.error(err);
    return {
        data: [], 
        message: err instanceof Error ? err.message : String(err), 
        pageNumber: 0, 
        pageSize: 0, 
        status: "error", 
        totalCount: 0
    };
  }

};

  

  return { products, pagedProductsResponse, pagedTransactionsResponse , fetchProducts, fetchPagedProducts, fetchPagedTransactions};
};

export default UseFetchProducts;

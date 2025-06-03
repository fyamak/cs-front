import { IResponse } from "@/types/api-response-types";
import { ICategory } from "@/types/category-types";
import { getData } from "@/utils/api";
import { useState } from "react";

const UseFetchCategories = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [pagedCategories, setPagedCategories] = useState<ICategory[]>([]);

  const fetchCategories = async () => {
    try {
      //   const {data: response} : {data: IResponse} = await getData("api/category");
      const axiosResponse = await getData("api/category");
      const response: IResponse = axiosResponse.data;
      if (response.status === "Success"){
        setCategories(response.data);
        return response;
      } 
      return [];
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPagedCategories = async (pageNumber: number, pageSize: number, search?: string) => {
    try {
      var endpoint: string = `api/Category/Paged?pageNumber=${pageNumber}&pageSize=${pageSize}`;
      if (search) {
        endpoint += `&search=${search}`;
      }
      const { data: response } = await getData(endpoint);
      if (response.status === "Success") {
        setPagedCategories(response.data);
        return response;
      }
      return [];
    } catch (err) {
      console.error(err);
    }
  };

  return {
    categories,
    pagedCategories,
    fetchCategories,
    fetchPagedCategories,
  };
};

export default UseFetchCategories;

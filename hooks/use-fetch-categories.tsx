import { IResponse } from "@/types/api-response-types";
import { ICategory } from "@/types/category-types";
import { getData } from "@/utils/api";
import { useState } from "react";

const UseFetchCategories = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);

  const fetchCategories = async () => {
    try {
    //   const {data: response} : {data: IResponse} = await getData("api/category");
      const axiosResponse = await getData("api/category");
      const response: IResponse = axiosResponse.data;
      if (response.status === "Success") setCategories(response.data);
      return response;
    } catch (err) {
      console.error(err);
    }
  };

  const categoryMap = new Map<number, string>()
  categories.forEach((cat) => categoryMap.set(cat.id, cat.name));
  // const categoryMap = categories.map((category) => {
  //   return {
  //     id: category.id,
  //     name: category.name,
  //   };
  // });

  return { categories, categoryMap, fetchCategories };
};

export default UseFetchCategories;

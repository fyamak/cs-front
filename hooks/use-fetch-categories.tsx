import { IResponse } from "@/types/api-response-types";
import { ICategory } from "@/types/product-types";
import { getData } from "@/utils/api";
import { useMemo, useState } from "react"

const UseFetchCategories = () => {
    const [categories, setCategories] = useState<ICategory[]>([]);

    const fetchCategories = async () => {
        try{
            const axiosResponse = await getData("api/category");
            const response : IResponse = axiosResponse.data;
            if(response.status === "Success")
                setCategories(response.data);
            return response;
        } catch(err) {
            console.error(err);
        }
    }

    const categoryMap = new Map<number, string>()
    categories.forEach((cat) => categoryMap.set(cat.id, cat.name))


    return { categories, categoryMap, fetchCategories };
} 

export default UseFetchCategories;
import { IResponse } from "@/types/api-response-types";
import { IOrder, IOrderHistory } from "@/types/order-types";
import { getData } from "@/utils/api";
import { useState } from "react";

const UseFetchOrders = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [orderHistory, setOrderHistory] = useState<IOrderHistory[]>([]);
  const [pagedOrders, setPagedOrders] = useState<IOrderHistory[]>([]);

  const fetchOrders = async () => {
    try {
      const axiosResponse = await getData("orders");
      const response : IResponse = axiosResponse.data
      if(response.status === 'Success'){
        setOrders(response.data);
      }
      return response;
    } catch (err) {
      console.error(err);
    }
  };  

  const fetchOrderHistory = async () => {
    try {
      const axiosResponse = await getData("orders?isDeleted=true");
      const response = axiosResponse.data;
      if(response.status === 'Success'){
        setOrderHistory(response.data);
      }
      return response;
    } catch (err) {
      console.error(err);
    }
  }

  const fetchPagedOrders = async (pageNumber: number, pageSize: number, isDeleted: boolean, search?: string, type?: string | null) => {
    try{
      var endpoint : string = `api/Order/Paged?pageNumber=${pageNumber}&pageSize=${pageSize}&isDeleted=${isDeleted}`
      if(search){
        endpoint += `&search=${search}`
      }
      if(type){
        endpoint += `&type=${type}`
      }

      const { data: response } = await getData(endpoint)
      if(response.status === "Success"){
        const res : IOrderHistory[] = response.data;
        return res;
      }
      
      return [];
    } catch(err){
      console.error(err)
    }
  }

  return { orders, orderHistory, pagedOrders, fetchOrders, fetchOrderHistory, fetchPagedOrders };
};

export default UseFetchOrders;
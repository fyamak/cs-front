import { IResponse } from "@/types/api-response-types";
import { IOrder, IOrderHistory } from "@/types/product-types";
import { getData } from "@/utils/api";
import { useState } from "react";

const UseFetchOrders = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [orderHistory, setOrderHistory] = useState<IOrderHistory[]>([]);

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

  return { orders, orderHistory, fetchOrders, fetchOrderHistory };
};

export default UseFetchOrders;
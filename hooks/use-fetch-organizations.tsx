"use client"
import { IResponse } from "@/types/api-response-types";
import { IOrganization } from "@/types/organization-types";
import { getData } from "@/utils/api";
import { useState } from "react";

const UseFetchOrganizations = () => {
  const [organizations, setOrganizations] = useState<IOrganization[]>([]);
  const [pagedOrganizations, setPagedOrganizations] = useState<IOrganization[]>([]);

  const fetchOrganizations = async () => {
    try {
      const axiosResponse = await getData("api/organization");
      const response : IResponse = axiosResponse.data
      if(response.status === 'Success'){
        setOrganizations(response.data);
      }
      return response;
    } catch (err) {
      console.error(err);
    }
  };  

  const fetchPagedOrganizations = async (pageNumber: number, pageSize: number, search?: string) => {
    try{
      var endpoint : string = `api/Organization/Paged?pageNumber=${pageNumber}&pageSize=${pageSize}`
      if(search){
        endpoint += `&search=${search}`
      }
      const { data: response } = await getData(endpoint)
      if(response.status === "Success"){
        const res : IOrganization[] = response.data;
        setPagedOrganizations(response.data)
        return res;
      }
      return [];
    } catch(err){
      console.error(err)
    }
  }

  const organizationMap = new Map<number, string>()
  organizations.forEach((org) => organizationMap.set(org.id, org.name))

  return { organizations, pagedOrganizations, organizationMap, fetchOrganizations, fetchPagedOrganizations };
};

export default UseFetchOrganizations;
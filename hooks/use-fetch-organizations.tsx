import { IResponse } from "@/types/api-response-types";
import { IOrganization } from "@/types/organization-types";
import { getData } from "@/utils/api";
import { useMemo, useState } from "react";

const UseFetchOrganizations = () => {
  const [organizations, setOrganizations] = useState<IOrganization[]>([]);

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

  const organizationMap = useMemo(() => {
    const map = new Map<number, string>()
    organizations.forEach(org => map.set(org.id, org.name))
    return map
  }, [organizations])

  return { organizations, organizationMap, fetchOrganizations };
};

export default UseFetchOrganizations;
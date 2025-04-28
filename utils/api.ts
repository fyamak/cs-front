import axiosInstance from './axiosInterceptorInstance';

export async function getData(endpoint:string) {
  const response = await axiosInstance.get(`${endpoint}`);
  return response
}

export async function postData(endpoint:string, data: object) {
  const response = await axiosInstance.post(`${endpoint}`, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return response
}

export async function deleteData(endpoint: string) {
  const response = await axiosInstance.delete(`${endpoint}`);
  return response;
}
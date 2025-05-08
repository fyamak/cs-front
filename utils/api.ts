import axiosInstance from './axios-interceptor-instance';

export async function getData(endpoint:string) {
  const response = await axiosInstance.get(`${endpoint}`)
  // .then(function (response) {
  //   console.log(response.data);
  //   console.log(response.status);
  //   console.log(response.statusText);
  //   console.log(response.headers);
  //   console.log(response.config);
  // });
  return response
}

export async function postData(endpoint:string, data: object) {
  const response = await axiosInstance.post(`${endpoint}`, data)
  return response
}

export async function patchData(endpoint:string, data: object) {
  const response = await axiosInstance.patch(`${endpoint}`, data);
  return response
}

export async function deleteData(endpoint: string) {
  const response = await axiosInstance.delete(`${endpoint}`);
  return response;
}
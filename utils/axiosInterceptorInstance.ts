import axios from "axios";

const API_BASE_URL = "http://localhost:5001/"; 

const axiosInstance = axios.create({
    baseURL: API_BASE_URL
})

// Request interceptor  
axiosInstance.interceptors.request.use(
    function (config) {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);


// Response interceptor  
axiosInstance.interceptors.response.use(  
    function (response) {
        return response;
    },
    async function (error) {

        const originalRequest = error.config;

        if (error.response && error.response.status === 401) {

            try {
                const response = await axios.post(`${API_BASE_URL}RefreshToken`, {refreshToken: localStorage.getItem("refreshToken")});
                
                if (response) {
                    localStorage.setItem('accessToken', response.data.data.accessToken);

                    originalRequest.headers['Authorization'] = `Bearer ${response.data.accessToken}`;
                    
                    return axiosInstance(originalRequest);
                }
            } catch (error) {
                console.error(error);
            }
        }

        return Promise.reject(error);
    }
);  

export default axiosInstance;
import axios from "axios";
import Cookies from 'js-cookie';

const API_BASE_URL = "https://localhost:8081/"; 

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
})

// Request interceptor  
axiosInstance.interceptors.request.use(
    function (config) {
        const token = Cookies.get('accessToken');
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

        if (error.response && (error.response.status === 401 || error.response.status === 400)) {
            try {
                const res = await axios.post(`${API_BASE_URL}RefreshToken`, {refreshToken: Cookies.get('refreshToken')});
                const response = res.data
            
                if (response.data) {
                    Cookies.set('accessToken', response.data.accessToken);
                    Cookies.set('refreshToken', response.data.refreshToken);
                    
                    originalRequest.headers['Authorization'] = `Bearer ${response.data.accessToken}`;
                    return axiosInstance(originalRequest);
                }
                else
                {
                    // Cookies.remove("accessToken");
                    // Cookies.remove("refreshToken");
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
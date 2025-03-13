import axios from "axios";
import { BASE_URL } from "./apipath";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const accesstoken = localStorage.getItem("token");
        if (accesstoken) {
            config.headers.Authorization = `Bearer ${accesstoken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if(error.message){
        if (error.response.status === 401) {
            window.location.href = "/login";
        }else if(error.response.status === 500){
            console.log("Server Error Please Try again later");
        }
    }else if(error.message === "ECONNABORTED"){
        console.log("Request Timeout.Please Try again Later");
    }
    return Promise.reject(error);
}
);

export default axiosInstance;
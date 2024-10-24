import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "http://localhost:8000/api/v1/employee",
    headers: {
        "Content-Type": "application/json"
    }
})
import { ApiResponse } from "@/types/auth.type";
import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
// import { ApiResponse } from "./axios-instance";


// Generic HTTP client wrapper
const requestData = async <TRequest, TResponse>(
  axiosInstance: AxiosInstance,
  method: "get" | "post" | "put" | "delete" | "patch",
  url: string,
  values?: TRequest,
  config: AxiosRequestConfig = {}, // Supports both responseType and custom flags like `silent`
): Promise<ApiResponse<TResponse>> => {
  try {
    let response: AxiosResponse<ApiResponse<TResponse>>;

    // Set default responseType to 'json' and ensure credentials (cookies) are sent
   const finalConfig: AxiosRequestConfig = {
  responseType: config.responseType ?? "json",
  ...config,
  withCredentials: true, // ✅ enforce always
};

    switch (method) {
      case "get":
        response = await axiosInstance.get(url, finalConfig);
        break;
      case "post":
        response = await axiosInstance.post(url, values, finalConfig);
        break;
      case "put":
        response = await axiosInstance.put(url, values, finalConfig);
        break;
      case "delete": {
        const deleteConfig = { ...finalConfig };
        if (values !== undefined && values !== null) {
          deleteConfig.data = values;
        }
        response = await axiosInstance.delete(url, deleteConfig);
        break;
      }

      case "patch":
        response = await axiosInstance.patch(url, values, finalConfig);
        break;
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }

    return response.data;
  } catch (error) {
    console.error(`Error in ${method.toUpperCase()} request:`, error);
    return Promise.reject(error);
  }
};

export default requestData;

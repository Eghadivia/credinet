import { createAxiosInstance } from "../createAxiosInstance";


const authApi = createAxiosInstance(process.env.NEXT_PUBLIC_API_URL!);

export default authApi;

import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const post = async (endpoint: string, data: any, token?: string) => {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      console.log("api token", token);
      headers["Authorization"] = `Bearer ${token}`;
    }
    const response = await axios.post(`${API_URL}${endpoint}`, data, {
    headers
    });
    
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Server error" };
  }
};

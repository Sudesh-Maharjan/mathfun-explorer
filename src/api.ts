import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const post = async (endpoint: string, data: any) => {
  try {
    const response = await axios.post(`${API_URL}${endpoint}`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Server error" };
  }
};

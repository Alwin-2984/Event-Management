// Importing required components and modules
import axios from "axios";
import Configuration from "../../Configuration";
// Set the BASE_URL for API requests using the development URL from the 'Configuration' object.

const BASE_URL = Configuration.localUrl;

// Create an axios instance with the default baseURL.

export default axios.create({
  baseURL: BASE_URL,
});

// Create another axios instance named 'instance' with a baseURL and custom headers.

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {},
});

// Add a request interceptor
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    const tockenValue = "Event " + token;
    if (token) {
      config.headers["Authorization"] = tockenValue;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

// Add a response interceptor to the 'instance' axios instance.

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error?.response?.data === "User not Found") {
      localStorage.clear();
      window.location.replace("/");
    } else if (error?.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      const accessToken = await refreshAccessToken();
      axiosPrivate.defaults.headers.common["Authorization"] = accessToken;
      return axiosPrivate(originalRequest);
    } else throw error;
  }
);

export const axiosPrivate = instance;

// Function to refresh the access token.

const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  const data = { token: refreshToken };

  try {
    const response = await axios.post(BASE_URL + "admin/login", data);
    localStorage.setItem("accessToken", response?.data?.accessToken?.value);
    localStorage.setItem("refreshToken", response?.data?.refreshToken?.value);
    localStorage.setItem("email", response?.data?.email);
    localStorage.setItem("selectedItem", "dashboard");
    return response?.data?.token;
  } catch (err) {
    localStorage.clear();
    window.location.replace("/");
  }
};

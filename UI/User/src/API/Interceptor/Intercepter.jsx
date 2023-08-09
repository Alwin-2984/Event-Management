import axios from "axios";

// Set the base URL using the environment variable
const BASE_URL = import.meta.env.VITE_API_URL;

// Function to get a new access token using the refresh token
function getAccessTokenFromRefreshToken() {
  return axios
    .put(
      `${BASE_URL}/login`,
      {
        refreshToken: JSON.parse(localStorage.getItem("Profile")).RefreshToken,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => {
      // Update the access token in localStorage with the new token
      localStorage.setItem("Profile", JSON.stringify(response?.data));
      return response?.data?.token;
    })
    .catch((err) => {
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        // If token refresh fails or access is forbidden, clear localStorage and redirect to the login page
        localStorage.clear();
        window.location.href = "/";
      }
    });
}

// Function to get the local access token from localStorage
function getLocalAccessToken() {
  return localStorage.getItem("accessToken");
}

// Create an Axios instance with baseURL and headers
export const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to set the Authorization header with the access token
instance.interceptors.request.use(
  (config) => {
    const token = getLocalAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Correct format for Authorization header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle expired or forbidden access tokens
instance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;
    if (err.response) {
      // Access Token was expired (401 status)
      if (err.response.status === 401 && !originalConfig._retry) {
        // Redirect to login page and clear localStorage
        window.location.href = "/";
        localStorage.clear();
        return Promise.reject(err.response.data);
      }
      // Access is forbidden (403 status)
      if (err.response.status === 403 && err.response.data) {
        // Redirect to login page and clear localStorage
        window.location.href = "/";
        localStorage.clear();
        return Promise.reject(err.response.data);
      }
    }
    return Promise.reject(err);
  }
);

// Function to refresh the access token periodically using the refresh token
function view_stack() {
  const refreshToken = localStorage.getItem("refreshToken");
  if (refreshToken) {
    alert(refreshToken)
    // Call the function to get a new access token using the refresh token
    getAccessTokenFromRefreshToken();
  } else {
    return;
  }
}

// Call the view_stack function periodically (every 780,000 milliseconds or 13 minutes)
setInterval(view_stack, 780000);

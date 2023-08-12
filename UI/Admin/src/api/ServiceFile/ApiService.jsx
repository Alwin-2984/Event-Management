// Importing required components and modules
import { axiosPrivate } from "../Intercepter/Intercepter";
import Configuration from "../../Configuration";
import axios from "axios";

// Set the BASE_URL for API requests using the development URL from the 'Configuration' object.
const BASE_URL = Configuration.localUrl;

// login API call
export const adminLogin = (data) => {
  return axios.post(BASE_URL + "admin/login", data);
};

// List user API call
export const listUsersAPI = (params) => {
  return axiosPrivate.get(
    BASE_URL +
      `admin/users?page=${params.page}&search=${params.search}&size=${params.size}&sort=${params.sort}&order=${params.order}&status=${params.status}`
  );
};

// Delete , block or unblock user
export const DeleteUsers = (id, body) => {
  return axiosPrivate.put(BASE_URL + "admin/users/" + id + "/" + body);
};

// Add category API call
export const addCategoryAPI = (categoryData) => {
  return axiosPrivate.post(BASE_URL + "admin/categories", categoryData);
};

// Update category API call
export const updateCategoryAPI = (id, categoryData) => {
  return axiosPrivate.put(BASE_URL + `admin/categories/${id}`, categoryData);
};

// List category API call
export const listCategoryAPI = (params) => {
  return axiosPrivate.get(
    BASE_URL +
      `admin/categories?page=${params.page}&search=${params.search}&size=${params.size}&sort=${params.sort}&order=${params.order}`
  );
};

// Get category API call
export const getCategoryAPI = (id) => {
  return axiosPrivate.get(BASE_URL + `admin/categories/${id}`);
};

// Delete category
export const deleteCategoryAPI = (id) => {
  return axiosPrivate.delete(BASE_URL + "admin/categories/" + id);
};

// Active user count
export const ActiveUserCount = () => {
  return axiosPrivate.get(BASE_URL + "admin/activeUserCount");
};

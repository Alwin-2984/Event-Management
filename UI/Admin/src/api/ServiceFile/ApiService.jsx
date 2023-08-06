// Importing required components and modules
import { axiosPrivate } from "../Intercepter/Intercepter";
import Configuration from "../../Configuration";
import axios from "axios";

// Set the BASE_URL for API requests using the development URL from the 'Configuration' object.
const BASE_URL = Configuration.devUrl;

// login API call
export const adminLogin = (data) => {
  console.log("inside this", data);
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

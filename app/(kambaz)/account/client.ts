import axios from "axios";
import {
  clearStoredCurrentUser,
  getStoredCurrentUser,
  setStoredCurrentUser,
} from "./storage";

const axiosWithCredentials = axios.create({ withCredentials: true });
axiosWithCredentials.interceptors.request.use((config) => {
  const currentUser = getStoredCurrentUser();
  if (currentUser?._id) {
    if (config.headers?.set) {
      config.headers.set("x-user-id", currentUser._id);
    } else {
      config.headers = {
        ...(config.headers || {}),
        "x-user-id": currentUser._id,
      } as any;
    }
  }
  return config;
});
export const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
export const USERS_API = `${HTTP_SERVER}/api/users`;
export const signin = async (credentials: any) => {
  const response = await axiosWithCredentials.post(`${USERS_API}/signin`, credentials);
  setStoredCurrentUser(response.data);
  return response.data;
};
export const profile = async () => {
  const response = await axiosWithCredentials.post(`${USERS_API}/profile`, {}, { validateStatus: (status) => status < 500 });
  if (response.status === 401) return getStoredCurrentUser();
  setStoredCurrentUser(response.data);
  return response.data;
};
export const signup = async (user: any) => {
  const response = await axiosWithCredentials.post(`${USERS_API}/signup`, user);
  setStoredCurrentUser(response.data);
  return response.data;
};
export const signout = async () => {
  const response = await axiosWithCredentials.post(`${USERS_API}/signout`);
  clearStoredCurrentUser();
  return response.data;
};
export const updateUser = async (user: any) => {
  const response = await axiosWithCredentials.put(`${USERS_API}/${user._id}`, user);
  setStoredCurrentUser(response.data);
  return response.data;
};
export const findAllUsers = async () => {
  const response = await axiosWithCredentials.get(USERS_API);
  return response.data;
};
export const findUsersByRole = async (role: string) => {
  const response = await axios.get(`${USERS_API}?role=${role}`);
  return response.data;
};
export const findUsersByPartialName = async (name: string) => {
  const response = await axios.get(`${USERS_API}?name=${name}`);
  return response.data;
};
export const findUserById = async (id: string) => {
  const response = await axios.get(`${USERS_API}/${id}`);
  return response.data;
};
export const deleteUser = async (userId: string) => {
  const response = await axios.delete(`${USERS_API}/${userId}`);
  return response.data;
};
export const createUser = async (user: any) => {
  const response = await axios.post(`${USERS_API}`, user);
  return response.data;
};

import axios from "axios";
import { appConfig } from "../../appConfig";
import { demoStore } from "../demoMockStore";

const apiUrl = import.meta.env.VITE_API_URL;
const URL = apiUrl;

export const getProfileAPI = async () => {
  if (appConfig.IS_DEMO_MODE || !URL) {
    await new Promise((r) => setTimeout(r, 150));
    return demoStore.getProfile();
  }

  try {
    const response = await axios.get(`${URL}/Profile/Profile`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response?.data?.success) {
      return response.data;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

export const exitGroupProfileAPI = async () => {
  if (appConfig.IS_DEMO_MODE || !URL) {
    await new Promise((r) => setTimeout(r, 200));
    localStorage.removeItem("code");
    localStorage.removeItem("members");
    return { success: true, message: "Exited group (Demo Mode)" };
  }

  try {
    const response = await axios.get(`${URL}/Profile/exit-group`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.data.success) {
      localStorage.removeItem("code");
      localStorage.removeItem("members");
      return { success: true, data: response.data };
    } else {
      return { success: false, message: response.data.message || "Unknown error" };
    }
  } catch (error) {
    console.error("Error exiting group:", error);
    return { success: false, message: "Error in exiting group from the server" };
  }
};

export const updateProfileAPI = async (updates) => {
  if (appConfig.IS_DEMO_MODE || !URL) {
    await new Promise((r) => setTimeout(r, 150));
    return demoStore.updateProfile(updates);
  }

  try {
    const response = await axios.patch(`${URL}/Profile/update-profile`, updates, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json-patch+json",
      },
    });

    if (response?.data?.success) {
      return response.data;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

export default getProfileAPI;
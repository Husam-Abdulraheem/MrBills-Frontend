import axios from "axios";
import { appConfig } from "../../appConfig";
import { demoStore } from "../demoMockStore";

const apiUrl = import.meta.env.VITE_API_URL;
const url = apiUrl;

const getGroupAPI = async () => {
  if (appConfig.IS_DEMO_MODE || !url) {
    await new Promise((r) => setTimeout(r, 150));
    return demoStore.getGroup();
  }

  try {
    const response = await axios.get(`${url}/Group/getGroup`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response?.data?.success) {
      return response.data;
    } else if (response?.data?.success === false) {
      return response.data;
    }
  } catch (error) {
    return false;
  }
};

export default getGroupAPI;

export const JoinGroupAPI = async (code) => {
  if (appConfig.IS_DEMO_MODE || !url) {
    await new Promise((r) => setTimeout(r, 200));
    return demoStore.joinGroup(code);
  }

  try {
    const response = await axios.post(
      `${url}/Group/join-group`,
      { code: code },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (response?.data?.success) {
      return response.data;
    } else {
      return response.data;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const getSubscriptionAPI = async () => {
  if (appConfig.IS_DEMO_MODE || !url) {
    await new Promise((r) => setTimeout(r, 150));
    return demoStore.getSubscription();
  }

  try {
    const response = await axios.get(`${url}/Group/subscription`, {
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

export const kickMemberAPI = async (memberID) => {
  if (appConfig.IS_DEMO_MODE || !url) {
    await new Promise((r) => setTimeout(r, 200));
    return demoStore.kickMember(memberID);
  }

  try {
    const response = await axios.get(`${url}/Group/kick-group-member`, {
      params: {
        kickedMember: memberID,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response?.data?.success) {
      return response.data;
    } else {
      return { success: false, message: response.data.message || "Unknown error" };
    }
  } catch (err) {
    return false;
  }
};
import axios from "axios";
import { appConfig } from "../../appConfig";
import { demoStore } from "../demoMockStore";

const apiUrl = import.meta.env.VITE_API_URL;
const url = apiUrl;

export const registerAPI = async (fullName, email, password, confirmPassword, IBAN) => {
  if (appConfig.IS_DEMO_MODE || !url) {
    await new Promise((r) => setTimeout(r, 200));
    return demoStore.register(fullName, email, password, confirmPassword, IBAN);
  }

  try {
    const response = await axios.post(
      `${url}/Auth/register`,
      {
        fullName: fullName,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
        iban: IBAN,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response?.data?.success) {
      return response.data;
    } else {
      return response?.data?.message;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const loginAPI = async (email, password) => {
  if (appConfig.IS_DEMO_MODE || !url) {
    await new Promise((r) => setTimeout(r, 200));
    return demoStore.login(email, password);
  }

  try {
    const response = await axios.post(`${url}/Auth/login`, {
      email: email,
      password: password,
    });

    if (response?.data?.success) {
      return response.data;
    } else {
      return response?.data?.message;
    }
  } catch (error) {
    return false;
  }
};

export const forgotPasswordAPI = async (email) => {
  if (appConfig.IS_DEMO_MODE || !url) {
    await new Promise((r) => setTimeout(r, 200));
    return { success: true, message: "Password reset link sent (Demo Mode)" };
  }

  try {
    const response = await axios.post(`${url}/Auth/ForgotPassword`, {
      email: email,
    });
    if (response?.data?.success) {
      return response.data;
    } else {
      throw new Error("Error In User Data");
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const restPasswordAPI = async (id, code, password) => {
  if (appConfig.IS_DEMO_MODE || !url) {
    await new Promise((r) => setTimeout(r, 200));
    return { success: true, message: "Password updated successfully (Demo Mode)" };
  }

  try {
    const response = await axios.post(`${url}/Auth/ResetPassword`, {
      userId: id,
      code: code,
      newPassword: password,
    });
    if (response?.data?.success) {
      return response.data;
    } else {
      throw new Error("Error In User Data");
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const confirmEmailAPI = async (id, code) => {
  if (appConfig.IS_DEMO_MODE || !url) {
    await new Promise((r) => setTimeout(r, 200));
    return { success: true, message: "Email confirmed (Demo Mode)" };
  }

  try {
    const response = await axios.get(`${url}/Auth/confirm-email`, {
      params: {
        userId: id.toString(),
        code: code.toString(),
      },
    });

    if (response?.data?.success) {
      return response.data;
    } else {
      throw new Error("Error In Confirming Email");
    }
  } catch (error) {
    return false;
  }
};
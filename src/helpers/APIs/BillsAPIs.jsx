import axios from "axios";
import { appConfig } from "../../appConfig";
import { demoStore } from "../demoMockStore";

const apiUrl = import.meta.env.VITE_API_URL;
const url = `${apiUrl}/bill`;

export const getBillsAPI = async (id, code) => {
  if (appConfig.IS_DEMO_MODE || !apiUrl) {
    await new Promise((r) => setTimeout(r, 150));
    return demoStore.getBills();
  }

  try {
    const response = await axios.get(`${url}/bills`, {
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

export const createBillAPI = async (formData) => {
  if (appConfig.IS_DEMO_MODE || !apiUrl) {
    await new Promise((r) => setTimeout(r, 200));
    return demoStore.createBill(formData);
  }

  try {
    const response = await axios.post(`${url}/createBill`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response?.data?.success) {
      return response.data;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const payBillAPI = async (formData) => {
  if (appConfig.IS_DEMO_MODE || !apiUrl) {
    await new Promise((r) => setTimeout(r, 200));
    return demoStore.payBill(formData);
  }

  try {
    const response = await axios.post(`${url}/paybill`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response?.data?.success) {
      return response.data;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const myBillsAPI = async (formData) => {
  if (appConfig.IS_DEMO_MODE || !apiUrl) {
    await new Promise((r) => setTimeout(r, 150));
    return demoStore.getMyBills();
  }

  try {
    const response = await axios.get(`${url}/myBills`, {
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
    console.log(error);
    return false;
  }
};

export const settleBillAPI = async (myBillID, otherBillID) => {
  if (appConfig.IS_DEMO_MODE || !apiUrl) {
    await new Promise((r) => setTimeout(r, 200));
    return demoStore.settleBill(myBillID, otherBillID);
  }

  try {
    const response = await axios.post(
      `${url}/settlement`,
      {
        myBillId: myBillID,
        otherBillId: otherBillID,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (response?.data?.success) {
      return response.data;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const deleteBillAPI = async (billID) => {
  if (appConfig.IS_DEMO_MODE || !apiUrl) {
    await new Promise((r) => setTimeout(r, 150));
    return demoStore.deleteBill(billID);
  }

  try {
    const response = await axios.delete(`${url}/deleteBill`, {
      params: {
        billId: billID,
      },
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
    console.log(error);
    return false;
  }
};

export const archivedBillsAPI = async () => {
  if (appConfig.IS_DEMO_MODE || !apiUrl) {
    await new Promise((r) => setTimeout(r, 150));
    return demoStore.getArchivedBills();
  }

  try {
    const response = await axios.get(`${url}/archived`, {
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
    console.log(error);
    return false;
  }
};

export const editBillAPI = async (content) => {
  if (appConfig.IS_DEMO_MODE || !apiUrl) {
    await new Promise((r) => setTimeout(r, 150));
    return demoStore.editBill(content);
  }

  try {
    const response = await axios.patch(`${url}/editBill`, content, {
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
    console.log(error);
    return false;
  }
};
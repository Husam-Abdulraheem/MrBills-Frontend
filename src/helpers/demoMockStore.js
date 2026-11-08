/**
 * Mr. Bills Demo Mock Store
 * Fully simulates backend operations, state persistence (localStorage), and calculations
 * for live portfolio demonstration without requiring an active backend server.
 */

const STORAGE_KEY = "mrbills_demo_state";

const INITIAL_STATE = {
  user: {
    id: "usr_1",
    fullName: "Husam (Demo)",
    email: "demo@mrbills.com",
    iban: "TR330006100511123456789012",
  },
  group: {
    id: 1,
    managerId: "usr_1",
    code: "MB-8921",
    name: "Apartment Roommates 🏠",
    members: [
      { userId: "usr_1", id: "usr_1", fullName: "Husam (You)", email: "demo@mrbills.com", role: "Owner" },
      { userId: "usr_2", id: "usr_2", fullName: "Sarah Miller", email: "sarah@example.com", role: "Member" },
      { userId: "usr_3", id: "usr_3", fullName: "Alex Chen", email: "alex@example.com", role: "Member" },
      { userId: "usr_4", id: "usr_4", fullName: "Zaid Omar", email: "zaid@example.com", role: "Member" },
    ],
    isActive: true,
  },
  subscription: {
    id: 1,
    groupId: 1,
    package: 1,
    type: "Medium_5Users",
    isTrial: false,
    isActive: true,
    isPaid: true,
    expiryDate: "2027-12-31T23:59:59",
  },
  // My Bills (Bills created by the current user: usr_1)
  myBills: [
    {
      billId: 101,
      id: 101,
      description: "High-Speed Fiber Internet 🌐",
      ownerName: "Husam (You)",
      billOwner: "Husam (You)",
      createDate: "2026-11-01T12:00:00",
      date: "2026-11-01T12:00:00",
      total: 480,
      amount: 480,
      isRequired: false,
      invoice: null,
      activityLogs: [
        { id: 1, name: "Sarah Miller", amount: 120, paymentType: "Paid" },
        { id: 2, name: "Bill Created", amount: 480, paymentType: "Created" },
      ],
      claimants: [
        { claimantId: "usr_2", claimantName: "Sarah Miller", amount: 120, isPaid: true, receipt: null },
        { claimantId: "usr_3", claimantName: "Alex Chen", amount: 120, isPaid: false, receipt: null },
        { claimantId: "usr_4", claimantName: "Zaid Omar", amount: 120, isPaid: false, receipt: null },
      ],
    },
    {
      billId: 102,
      id: 102,
      description: "House Cleaning & Maintenance 🧹",
      ownerName: "Husam (You)",
      billOwner: "Husam (You)",
      createDate: "2026-11-05T14:30:00",
      date: "2026-11-05T14:30:00",
      total: 360,
      amount: 360,
      isRequired: true,
      invoice: null,
      activityLogs: [
        { id: 3, name: "Bill Created", amount: 360, paymentType: "Created" },
      ],
      claimants: [
        { claimantId: "usr_2", claimantName: "Sarah Miller", amount: 120, isPaid: false, receipt: null },
        { claimantId: "usr_3", claimantName: "Alex Chen", amount: 120, isPaid: false, receipt: null },
      ],
    },
  ],
  // Archived Bills (Bills that are fully settled or closed)
  archivedBills: [
    {
      billId: 201,
      id: 201,
      description: "Water & Electricity Utilities (October) ⚡",
      ownerName: "Husam (You)",
      billOwner: "Husam (You)",
      createDate: "2026-10-15T09:00:00",
      date: "2026-10-15T09:00:00",
      total: 640,
      amount: 640,
      isRequired: false,
      invoice: null,
      activityLogs: [
        { id: 4, name: "Sarah Miller", amount: 160, paymentType: "Paid" },
        { id: 5, name: "Alex Chen", amount: 160, paymentType: "Paid" },
        { id: 6, name: "Zaid Omar", amount: 160, paymentType: "Settled" },
      ],
      claimants: [
        { claimantId: "usr_2", claimantName: "Sarah Miller", amount: 160, isPaid: true, receipt: null },
        { claimantId: "usr_3", claimantName: "Alex Chen", amount: 160, isPaid: true, receipt: null },
        { claimantId: "usr_4", claimantName: "Zaid Omar", amount: 160, isPaid: true, receipt: null },
      ],
    },
  ],
  // Other Bills in group where current user owes debt (shown on MainPage)
  otherBills: [
    {
      billId: 301,
      id: 301,
      description: "Weekly Grocery & Supplies 🛒",
      billOwner: "Sarah Miller",
      amount: 190,
      total: 760,
      date: "2026-11-04T15:30:00",
      createDate: "2026-11-04T15:30:00",
      iban: "TR440006100511123456789033",
      isRequired: false,
      invoice: null,
      isPaid: false,
    },
    {
      billId: 302,
      id: 302,
      description: "Central Heating & Gas Bill ♨️",
      billOwner: "Alex Chen",
      amount: 220,
      total: 880,
      date: "2026-11-02T10:15:00",
      createDate: "2026-11-02T10:15:00",
      iban: "TR550006100511123456789044",
      isRequired: true,
      invoice: null,
      isPaid: false,
    },
  ],
};

function getState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STATE));
      return JSON.parse(JSON.stringify(INITIAL_STATE));
    }
    const parsed = JSON.parse(raw);
    // Sanity check to make sure myBills and archivedBills exist
    if (!Array.isArray(parsed.myBills) || !Array.isArray(parsed.archivedBills)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STATE));
      return JSON.parse(JSON.stringify(INITIAL_STATE));
    }
    return parsed;
  } catch {
    return JSON.parse(JSON.stringify(INITIAL_STATE));
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error("Failed to persist demo state", err);
  }
}

export const demoStore = {
  resetToDefault() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem("code");
      localStorage.removeItem("members");
      const cleanState = JSON.parse(JSON.stringify(INITIAL_STATE));
      saveState(cleanState);
      return cleanState;
    } catch (err) {
      console.error("Error in resetToDefault:", err);
      return INITIAL_STATE;
    }
  },

  reset() {
    return this.resetToDefault();
  },

  login(email, password) {
    const state = getState();
    const token = "mock-jwt-token-demo-" + Date.now();
    localStorage.setItem("token", token);
    return {
      success: true,
      token,
      group: state.group != null,
      message: "Login successful (Demo Mode)",
    };
  },

  register(fullName, email, password, confirmPassword, iban) {
    const state = getState();
    state.user = {
      id: "usr_" + Date.now(),
      fullName: fullName || "New User",
      email: email || "user@example.com",
      iban: iban || "TR000000000000000000000000",
    };
    saveState(state);
    const token = "mock-jwt-token-demo-" + Date.now();
    localStorage.setItem("token", token);
    return {
      success: true,
      token,
      message: "User registered successfully (Demo Mode)",
    };
  },

  getProfile() {
    const state = getState();
    return {
      success: true,
      data: state.user,
    };
  },

  updateProfile(updates) {
    const state = getState();
    state.user = { ...state.user, ...updates };
    saveState(state);
    return {
      success: true,
      data: state.user,
    };
  },

  getGroup() {
    const state = getState();
    if (!state.group) {
      return { success: false, message: "No group found" };
    }
    return {
      success: true,
      data: state.group,
    };
  },

  joinGroup(code) {
    const state = getState();
    if (!state.group) {
      state.group = JSON.parse(JSON.stringify(INITIAL_STATE.group));
      state.group.code = code || "MB-8921";
    }
    saveState(state);
    return {
      success: true,
      data: state.group,
    };
  },

  kickMember(memberId) {
    const state = getState();
    if (state.group && state.group.members) {
      state.group.members = state.group.members.filter(
        (m) => m.userId !== memberId && m.id !== memberId
      );
      saveState(state);
    }
    return {
      success: true,
      message: "Member removed (Demo Mode)",
    };
  },

  getSubscription() {
    const state = getState();
    return {
      success: true,
      data: state.subscription,
    };
  },

  // Main Page Bills: List of bills where current user owes debt
  getBills() {
    const state = getState();
    const activeDebts = (state.otherBills || []).filter((b) => !b.isPaid);

    // Total debts user owes
    const totalDebtsAmount = activeDebts.reduce(
      (sum, b) => sum + (Number(b.amount) || 0),
      0
    );

    // Receivables: amounts other members owe you across your myBills
    let receivables = 0;
    (state.myBills || []).forEach((bill) => {
      if (Array.isArray(bill.claimants)) {
        bill.claimants.forEach((c) => {
          if (!c.isPaid) {
            receivables += Number(c.amount) || 0;
          }
        });
      }
    });

    return {
      success: true,
      data: {
        bills: activeDebts,
        totalDebtsAmount,
        receivables,
      },
    };
  },

  // Bills Page: My Active Bills
  getMyBills() {
    const state = getState();
    return {
      success: true,
      data: state.myBills || [],
    };
  },

  // Bills Page: Archived Bills
  getArchivedBills() {
    const state = getState();
    return {
      success: true,
      data: state.archivedBills || [],
    };
  },

  // Create Bill
  createBill(formData) {
    const state = getState();
    const currentUserId = state.user?.id || "usr_1";
    const currentUserName = state.user?.fullName || "Husam (You)";

    let description = "New Bill";
    let total = 100;
    let requiredReceipt = false;
    let selectedUserIds = [];

    if (formData instanceof FormData) {
      description = formData.get("Description") || formData.get("description") || description;
      total = Number(formData.get("Total") || formData.get("total")) || total;
      requiredReceipt = formData.get("RequiredReceipt") === "true";

      const allUsers = formData.getAll("BillUsersId");
      if (allUsers && allUsers.length > 0) {
        selectedUserIds = allUsers.map(String);
      }
    } else if (typeof formData === "object" && formData !== null) {
      description = formData.description || description;
      total = Number(formData.total) || total;
      requiredReceipt = Boolean(formData.requiredReceipt);
    }

    const members = state.group?.members || [];
    const targetMembers = selectedUserIds.length > 0
      ? members.filter((m) => selectedUserIds.includes(String(m.userId || m.id)))
      : members.filter((m) => (m.userId || m.id) !== currentUserId);

    const splitCount = targetMembers.length > 0 ? targetMembers.length + 1 : 1;
    const splitAmount = Math.round(total / splitCount);

    const claimants = targetMembers.map((m) => ({
      claimantId: m.userId || m.id,
      claimantName: m.fullName,
      amount: splitAmount,
      isPaid: false,
      receipt: null,
    }));

    const now = new Date().toISOString();
    const newBill = {
      billId: Date.now(),
      id: Date.now(),
      description,
      ownerName: currentUserName,
      billOwner: currentUserName,
      createDate: now,
      date: now,
      total,
      amount: total,
      isRequired: requiredReceipt,
      invoice: null,
      activityLogs: [
        { id: Date.now(), name: "Bill Created", amount: total, paymentType: "Created" },
      ],
      claimants,
    };

    if (!Array.isArray(state.myBills)) state.myBills = [];
    state.myBills.unshift(newBill);
    saveState(state);

    return {
      success: true,
      data: newBill,
      message: "Bill created successfully (Demo Mode)",
    };
  },

  // Pay Bill (Settle a debt user owes)
  payBill(formData) {
    const state = getState();
    let billId = null;

    if (formData instanceof FormData) {
      billId = Number(formData.get("BillId") || formData.get("billId"));
    } else if (typeof formData === "object" && formData !== null) {
      billId = Number(formData.BillId || formData.billId);
    }

    if (billId && Array.isArray(state.otherBills)) {
      const bill = state.otherBills.find((b) => b.billId === billId || b.id === billId);
      if (bill) {
        bill.isPaid = true;
      }
    }
    saveState(state);
    return {
      success: true,
      message: "Payment processed successfully (Demo Mode)",
    };
  },

  // Settlement (Clear mutual debt between two bills)
  settleBill(myBillId, otherBillId) {
    const state = getState();
    const myBill = (state.myBills || []).find(
      (b) => b.billId === Number(myBillId) || b.id === Number(myBillId)
    );
    const otherBill = (state.otherBills || []).find(
      (b) => b.billId === Number(otherBillId) || b.id === Number(otherBillId)
    );

    if (otherBill) {
      otherBill.isPaid = true;
    }

    if (myBill) {
      if (Array.isArray(myBill.claimants)) {
        myBill.claimants.forEach((c) => {
          if (otherBill && c.claimantName === otherBill.billOwner) {
            c.isPaid = true;
          }
        });
      }
      if (!Array.isArray(myBill.activityLogs)) myBill.activityLogs = [];
      myBill.activityLogs.unshift({
        id: Date.now(),
        name: otherBill?.billOwner || "Member",
        amount: otherBill?.amount || 0,
        paymentType: "Settled",
      });
    }

    saveState(state);
    return {
      success: true,
      message: "Settlement completed successfully (Demo Mode)",
    };
  },

  // Delete Bill
  deleteBill(billId) {
    const state = getState();
    const targetId = Number(billId);
    if (Array.isArray(state.myBills)) {
      state.myBills = state.myBills.filter((b) => b.billId !== targetId && b.id !== targetId);
    }
    saveState(state);
    return {
      success: true,
      message: "Bill deleted (Demo Mode)",
    };
  },

  // Edit Bill
  editBill(content) {
    const state = getState();
    const targetId = Number(content?.billId);
    if (Array.isArray(state.myBills)) {
      const bill = state.myBills.find((b) => b.billId === targetId || b.id === targetId);
      if (bill) {
        if (content.description) bill.description = content.description;
        if (content.total != null) {
          bill.total = Number(content.total);
          bill.amount = Number(content.total);
        }
      }
    }
    saveState(state);
    return {
      success: true,
      message: "Bill updated (Demo Mode)",
    };
  },
};

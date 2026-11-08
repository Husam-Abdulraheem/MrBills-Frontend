/**
 * BillMate Demo Mock Store
 * Simulates backend operations, state persistence (localStorage), and calculations
 * for live portfolio demonstration without requiring an active backend server.
 */

const STORAGE_KEY = "billmate_demo_state";

const INITIAL_STATE = {
  user: {
    id: "usr_1",
    fullName: "Husam (Demo)",
    email: "demo@billmate.com",
    iban: "TR330006100511123456789012",
  },
  group: {
    id: 1,
    name: "Apartment Roommates 🏠",
    code: "BM-8921",
    members: [
      { id: "usr_1", fullName: "Husam (You)", email: "demo@billmate.com", iban: "TR330006100511123456789012", role: "Owner" },
      { id: "usr_2", fullName: "Sarah Miller", email: "sarah@example.com", iban: "TR440006100511123456789033", role: "Member" },
      { id: "usr_3", fullName: "Alex Chen", email: "alex@example.com", iban: "TR550006100511123456789044", role: "Member" },
      { id: "usr_4", fullName: "Zaid Omar", email: "zaid@example.com", iban: "TR660006100511123456789055", role: "Member" },
    ],
  },
  subscription: {
    id: 1,
    groupId: 1,
    package: 1,
    type: "Medium_5Users",
    isTrial: false,
    isPaid: true,
    expiryDate: "2027-12-31T23:59:59",
  },
  bills: [
    {
      id: 1,
      description: "High-Speed Fiber Internet 🌐",
      amount: 480,
      date: "2026-11-01T12:00:00",
      billOwner: "Husam (You)",
      ownerId: "usr_1",
      iban: "TR330006100511123456789012",
      isSettlement: false,
      isPayed: false,
      paidAmount: 240,
      remainingAmount: 240,
      debts: [
        { id: 101, fromUserId: "usr_2", fromUserName: "Sarah Miller", toUserId: "usr_1", amount: 120, isPaid: true },
        { id: 102, fromUserId: "usr_3", fromUserName: "Alex Chen", toUserId: "usr_1", amount: 120, isPaid: false },
        { id: 103, fromUserId: "usr_4", fromUserName: "Zaid Omar", toUserId: "usr_1", amount: 120, isPaid: false },
      ],
    },
    {
      id: 2,
      description: "Supermarket & Cooking Supplies 🛒",
      amount: 760,
      date: "2026-11-04T15:30:00",
      billOwner: "Sarah Miller",
      ownerId: "usr_2",
      iban: "TR440006100511123456789033",
      isSettlement: false,
      isPayed: false,
      paidAmount: 380,
      remainingAmount: 380,
      debts: [
        { id: 201, fromUserId: "usr_1", fromUserName: "Husam (You)", toUserId: "usr_2", amount: 190, isPaid: false },
        { id: 202, fromUserId: "usr_3", fromUserName: "Alex Chen", toUserId: "usr_2", amount: 190, isPaid: true },
        { id: 203, fromUserId: "usr_4", fromUserName: "Zaid Omar", toUserId: "usr_2", amount: 190, isPaid: false },
      ],
    },
    {
      id: 3,
      description: "Electricity & Heating Utility ⚡",
      amount: 920,
      date: "2026-10-28T09:15:00",
      billOwner: "Alex Chen",
      ownerId: "usr_3",
      iban: "TR550006100511123456789044",
      isSettlement: false,
      isPayed: true,
      paidAmount: 920,
      remainingAmount: 0,
      debts: [
        { id: 301, fromUserId: "usr_1", fromUserName: "Husam (You)", toUserId: "usr_3", amount: 230, isPaid: true },
        { id: 302, fromUserId: "usr_2", fromUserName: "Sarah Miller", toUserId: "usr_3", amount: 230, isPaid: true },
        { id: 303, fromUserId: "usr_4", fromUserName: "Zaid Omar", toUserId: "usr_3", amount: 230, isPaid: true },
      ],
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
    return JSON.parse(raw);
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
    saveState(INITIAL_STATE);
    return INITIAL_STATE;
  },

  login(email, password) {
    const state = getState();
    const token = "mock-jwt-token-" + Date.now();
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
    const token = "mock-jwt-token-" + Date.now();
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
      state.group.code = code || "BM-8921";
    }
    saveState(state);
    return {
      success: true,
      data: state.group,
    };
  },

  kickMember(memberId) {
    const state = getState();
    if (state.group) {
      state.group.members = state.group.members.filter((m) => m.id !== memberId);
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

  getBills() {
    const state = getState();
    const currentUserId = state.user?.id || "usr_1";

    let totalDebtsAmount = 0;
    let receivables = 0;

    state.bills.forEach((bill) => {
      if (bill.debts) {
        bill.debts.forEach((debt) => {
          if (!debt.isPaid) {
            if (debt.fromUserId === currentUserId) {
              totalDebtsAmount += Number(debt.amount) || 0;
            }
            if (debt.toUserId === currentUserId) {
              receivables += Number(debt.amount) || 0;
            }
          }
        });
      }
    });

    return {
      success: true,
      data: {
        bills: state.bills,
        totalDebtsAmount,
        receivables,
      },
    };
  },

  getMyBills() {
    const state = getState();
    const currentUserId = state.user?.id || "usr_1";
    const myBills = state.bills.filter(
      (b) => b.ownerId === currentUserId && !b.isPayed
    );
    return {
      success: true,
      data: myBills,
    };
  },

  getArchivedBills() {
    const state = getState();
    const archived = state.bills.filter((b) => b.isPayed);
    return {
      success: true,
      data: archived,
    };
  },

  createBill(formData) {
    const state = getState();
    const currentUserId = state.user?.id || "usr_1";

    let description = "New Bill";
    let amount = 100;
    let debtors = [];

    if (formData instanceof FormData) {
      description = formData.get("description") || description;
      amount = Number(formData.get("amount")) || amount;
      const rawDebtors = formData.get("debtors");
      if (rawDebtors) {
        try {
          debtors = typeof rawDebtors === "string" ? JSON.parse(rawDebtors) : rawDebtors;
        } catch {
          debtors = [];
        }
      }
    } else if (typeof formData === "object" && formData !== null) {
      description = formData.description || description;
      amount = Number(formData.amount) || amount;
      debtors = formData.debtors || [];
    }

    const members = state.group?.members || [];
    const splits = [];

    if (debtors.length > 0) {
      debtors.forEach((d, idx) => {
        const mem = members.find((m) => m.id === d.userId) || { fullName: `Member ${idx + 1}` };
        splits.push({
          id: Date.now() + idx,
          fromUserId: d.userId,
          fromUserName: mem.fullName,
          toUserId: currentUserId,
          amount: Number(d.amount) || 0,
          isPaid: false,
        });
      });
    } else {
      // Default split across members
      const splitAmount = Math.round(amount / (members.length || 1));
      members.forEach((m, idx) => {
        if (m.id !== currentUserId) {
          splits.push({
            id: Date.now() + idx,
            fromUserId: m.id,
            fromUserName: m.fullName,
            toUserId: currentUserId,
            amount: splitAmount,
            isPaid: false,
          });
        }
      });
    }

    const newBill = {
      id: Date.now(),
      description,
      amount,
      date: new Date().toISOString(),
      billOwner: state.user?.fullName || "You",
      ownerId: currentUserId,
      iban: state.user?.iban || "TR330006100511123456789012",
      isSettlement: false,
      isPayed: false,
      paidAmount: 0,
      remainingAmount: amount,
      debts: splits,
    };

    state.bills.unshift(newBill);
    saveState(state);

    return {
      success: true,
      data: newBill,
      message: "Bill created successfully (Demo Mode)",
    };
  },

  payBill(formData) {
    const state = getState();
    let billId = null;
    let debtId = null;

    if (formData instanceof FormData) {
      billId = Number(formData.get("billId"));
      debtId = Number(formData.get("debtId"));
    } else if (typeof formData === "object" && formData !== null) {
      billId = Number(formData.billId);
      debtId = Number(formData.debtId);
    }

    const bill = state.bills.find((b) => b.id === billId);
    if (bill && bill.debts) {
      const debt = bill.debts.find((d) => d.id === debtId || d.fromUserId === state.user?.id);
      if (debt) {
        debt.isPaid = true;
        bill.paidAmount = (bill.paidAmount || 0) + debt.amount;
        bill.remainingAmount = Math.max(0, bill.amount - bill.paidAmount);
        if (bill.debts.every((d) => d.isPaid)) {
          bill.isPayed = true;
        }
      }
    }
    saveState(state);
    return {
      success: true,
      message: "Payment processed successfully (Demo Mode)",
    };
  },

  settleBill(myBillId, otherBillId) {
    const state = getState();
    const myBill = state.bills.find((b) => b.id === Number(myBillId));
    const otherBill = state.bills.find((b) => b.id === Number(otherBillId));

    if (myBill) myBill.isPayed = true;
    if (otherBill) otherBill.isPayed = true;

    saveState(state);
    return {
      success: true,
      message: "Settlement completed successfully (Demo Mode)",
    };
  },

  deleteBill(billId) {
    const state = getState();
    state.bills = state.bills.filter((b) => b.id !== Number(billId));
    saveState(state);
    return {
      success: true,
      message: "Bill deleted (Demo Mode)",
    };
  },

  editBill(content) {
    const state = getState();
    const bill = state.bills.find((b) => b.id === Number(content?.billId));
    if (bill && content) {
      if (content.description) bill.description = content.description;
      if (content.amount) bill.amount = Number(content.amount);
    }
    saveState(state);
    return {
      success: true,
      data: bill,
    };
  },
};

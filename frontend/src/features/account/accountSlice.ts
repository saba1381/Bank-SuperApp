import { User, Card } from "./../../models/UserModel";
import {
  createAsyncThunk,
  createSlice,
  isAnyOf,
  PayloadAction,
} from "@reduxjs/toolkit";
import agent from "../../api/agent";
import { toast } from "react-toastify";
import { router } from "../../router/Routes";
import { setLoginStepToOTP } from "../../layout/appSlice";
import { log } from "console";
interface AccountState {
  user: User | null;
  isLoading: boolean;
  cards: Array<any> | [];
  cardInfo: Card | null;
  error: string | null;
  transactions: Array<any> | [];
  userCount: number | null;
  transactionCount: number | null;
  transactionStatus: number | null;
  users: Array<any> | [];
  ads:Array<any> | [];
}

const initialState: AccountState = {
  transactions: [],
  user: null,
  isLoading: false,
  cards: [],
  cardInfo: null,
  error: null,
  userCount: null,
  transactionCount: null,
  transactionStatus: null,
  users: [],
  ads : [],
};

export const verifyOTP = createAsyncThunk(
  "account/verifyOtp",
  async (data: object, thunkAPI) => {
    try {
      const userDto = await agent.UserProfile.verifyOTP(data);
      const { ...user } = userDto;
      localStorage.setItem("user", JSON.stringify(user));
      return user;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

export const registerUser = createAsyncThunk(
  "account/register",
  async (data: object, thunkAPI) => {
    try {
      const userDto = await agent.UserProfile.register(data);
      const { ...user } = userDto;
      localStorage.setItem("user", JSON.stringify(user));
      return user;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

export const refreshTokensAsync = createAsyncThunk(
  "account/refreshTokens",
  async (_, thunkAPI) => {
    const userObject = JSON.parse(localStorage.getItem("user") || "{}");

    try {
      const refreshedToken = await agent.UserProfile.refreshTokens({
        refreshToken: userObject.tokens.refresh.token,
      });

      userObject.tokens = refreshedToken;
      localStorage.setItem("user", JSON.stringify(userObject));
      thunkAPI.dispatch(setUser(userObject));
      localStorage.removeItem("isManualSignOut");
      return userObject;
    } catch (error) {
      const isManualSignOut = localStorage.getItem("isManualSignOut");
      if (!isManualSignOut) {
        thunkAPI.dispatch(signOut());
        localStorage.removeItem("isNewUser");
      }
      return thunkAPI.rejectWithValue({
        error: "دسترسی شما منقضی شده است، دوباره وارد شوید.",
      });
    }
  },
  {
    condition: () => {
      if (!localStorage.getItem("user")) return false;
    },
  }
);

export const signInUser = createAsyncThunk(
  "account/signInUser",
  async (data: object, thunkAPI) => {
    try {
      const userDto = await agent.UserProfile.login(data);
      const { ...user } = userDto;
      localStorage.setItem("user", JSON.stringify(user));
      return user;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);


export const signInSuperUser = createAsyncThunk(
  "account/signInSuperUser",
  async (data: object, thunkAPI) => {
    try {
      const userDto = await agent.UserProfile.loginAdmin(data);
      const { ...user } = userDto;
      localStorage.setItem("user", JSON.stringify(user));
      return user;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  "account/fetchCurrentUser",
  async (_, thunkAPI) => {
    thunkAPI.dispatch(setUser(JSON.parse(localStorage.getItem("user") ?? "")));
  },
  {
    condition: () => {
      if (!localStorage.getItem("user")) return false;
    },
  }
);

export const fetchUserProfile = createAsyncThunk(
  "account/fetchUserProfile",
  async (_, thunkAPI) => {
    try {
      const response = await agent.UserProfile.profileInfo();
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.response?.data });
    }
  }
);


export const userAds = createAsyncThunk(
  "account/userAds",
  async (_, thunkAPI) => {
    try {
      const response = await agent.UserProfile.UserAds();
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.response?.data });
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "account/updateUserProfile",
  async (profileData: object, thunkAPI) => {
    try {
      const response = await agent.UserProfile.updateProfile(profileData);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

export const completeUserProfile = createAsyncThunk(
  "account/updateUserProfile",
  async (profileData: object, thunkAPI) => {
    try {
      const response = await agent.UserProfile.completeInfo(profileData);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

export const changePassword = createAsyncThunk(
  "account/changePassword",
  async (
    data: { current_password: string; new_password: string },
    thunkAPI
  ) => {
    try {
      const response = await agent.UserProfile.passwordRecovery(data);
      //toast.success('رمز عبور با موفقیت تغییر کرد');
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data.detail });
    }
  }
);

export const addCard = createAsyncThunk(
  "account/addCard",
  async (data: object, thunkAPI) => {
    try {
      const response = await agent.Card.AddCard(data);
      return response;
    } catch (error: any) {
      const errorMessage = error.data.detail || "خطا در ثبت کارت";
      return thunkAPI.rejectWithValue({ error: errorMessage });
    }
  }
);

export const fetchCards = createAsyncThunk(
  "account/fetchCards",
  async (_, thunkAPI) => {
    try {
      const response = await agent.Card.CardList();
      return response;
    } catch (error: any) {
      const errorMessage = error.data.detail || "خطا در دریافت کارت‌ها";
      return thunkAPI.rejectWithValue({ error: errorMessage });
    }
  }
);

export const deleteCard = createAsyncThunk(
  "account/deleteCard",
  async (cardNumber: string, thunkAPI) => {
    try {
      const response = await agent.Card.deleteCard({ cardNumber });
      return response;
    } catch (error: any) {
      const errorMessage = error.data.detail || "خطا در حذف کارت";
      return thunkAPI.rejectWithValue({ error: errorMessage });
    }
  }
);

export const fetchCardInfo = createAsyncThunk(
  "card/fetchCardInfo",
  async (cardNumber) => {
    const response = await agent.Card.cardInfo({ cardNumber });
    //console.log(response);
    return response;
  }
);

export const updateCard = createAsyncThunk(
  "account/updateCard",
  async (values: any, thunkAPI) => {
    try {
      console.log(values);
      const response = await agent.Card.updateCard(values.id, values);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error });
    }
  }
);

export const transferCard = createAsyncThunk(
  "account/transferCard",
  async (data: object, thunkAPI) => {
    try {
      const response = await agent.Card.Transfer(data);
      return response;
    } catch (error: any) {
      //console.log(error.data)
      const errorMessage = error.data;
      toast.error(errorMessage, { autoClose: 3000 });
      return thunkAPI.rejectWithValue({ error: errorMessage });
    }
  }
);

export const sendOtp = createAsyncThunk(
  "account/sendOtp",
  async (data: object, thunkAPI) => {
    try {
      const response = await agent.Card.TransferSendOtp(data);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "account/verifyOtp",
  async (data: object, thunkAPI) => {
    try {
      const response = await agent.Card.TransferVerifyOtp(data);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

export const saveDesCard = createAsyncThunk(
  "account/saveDesCard",
  async (data: object, thunkAPI) => {
    try {
      const response = await agent.Card.SaveDesCard(data);
      return response;
    } catch (error: any) {
      const errorMessage = error.data.detail || "خطا در ذخیره کارت مقصد";
      return thunkAPI.rejectWithValue({ error: errorMessage });
    }
  }
);

export const fetchSavedDesCards = createAsyncThunk(
  "account/fetchSavedDesCards",
  async (_, thunkAPI) => {
    try {
      const response = await agent.Card.GetSaveDesCard();
      return response; // Assuming the API returns the data in the 'data' field
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteDesCard = createAsyncThunk(
  "account/deleteCard",
  async (desCard: string, thunkAPI) => {
    try {
      const response = await agent.Card.deleteDesCard({ desCard });
      return response;
    } catch (error: any) {
      const errorMessage = error.data.detail || "خطا در حذف کارت";
      return thunkAPI.rejectWithValue({ error: errorMessage });
    }
  }
);

export const chargeUser = createAsyncThunk(
  "account/chargeUser",
  async (data: object, thunkAPI) => {
    try {
      const response = await agent.Charge.Charging(data);
      //toast.success('شارژ با موفقیت انجام شد');
      return response;
    } catch (error: any) {
      const errorMessage = error.data.detail || "خطا در اطلاعات شارژ";
      //console.log(error.data.detail)
      toast.error(errorMessage, { autoClose: 3000 });
      return thunkAPI.rejectWithValue({ error: errorMessage });
    }
  }
);

export const sendPooyaCharge = createAsyncThunk(
  "account/sendPooyaCharge",
  async (data: object, thunkAPI) => {
    try {
      const response = await agent.Charge.SendOtp(data);
      return response;
    } catch (error: any) {
      console.log(error.data.detail);
      return thunkAPI.rejectWithValue({ error: error.data.detail });
    }
  }
);

export const verifyChargeInfo = createAsyncThunk(
  "account/verifyChargeInfo",
  async (data: object, thunkAPI) => {
    try {
      const response = await agent.Charge.VerifyChargeInfo(data);
      return response;
    } catch (error: any) {
      toast.error(error.data.detail, { autoClose: 3000 });
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

export const fetchTransactionsHistory = createAsyncThunk(
  "account/fetchTransactionsHistory",
  async (limit: number | undefined, thunkAPI) => {
    try {
      const response = await agent.Transactions.TransactionHistory(limit);
      console.log(response.initialCard);
      return response;
    } catch (error: any) {
      const errorMessage = error.data.detail || "خطا در دریافت اطلاعات";
      return thunkAPI.rejectWithValue({ error: errorMessage });
    }
  }
);

export const fetchTransactionsCardToCard = createAsyncThunk(
  "account/fetchTransactionsCardToCard",
  async (limit: number | undefined, thunkAPI) => {
    try {
      const response = await agent.Transactions.TransactionCardToCard(limit);
      return response;
    } catch (error: any) {
      const errorMessage = error.data.detail || "خطا در دریافت اطلاعات";
      return thunkAPI.rejectWithValue({ error: errorMessage });
    }
  }
);

export const fetchTransactionsRecharge = createAsyncThunk(
  "account/fetchTransactionsRecharge",
  async (limit: number | undefined, thunkAPI) => {
    try {
      const response = await agent.Transactions.TransactionRecharge(limit);
      return response;
    } catch (error: any) {
      const errorMessage = error.data.detail || "خطا در دریافت اطلاعات";
      return thunkAPI.rejectWithValue({ error: errorMessage });
    }
  }
);

export const DeleteTransaction = createAsyncThunk(
  "account/DeleteTransaction",
  async (id: number, thunkAPI) => {
    try {
      const response = await agent.Transactions.DeleteTransaction(id);
      toast.success("تراکنش با موفقیت حذف شد", { autoClose: 3000 });
      return response;
    } catch (error: any) {
      const errorMessage = error.data.detail || "خطا در حذف تراکنش";
      toast.error(errorMessage, { autoClose: 3000 });
      return thunkAPI.rejectWithValue({ error: errorMessage });
    }
  }
);

export const CountOfUsers = createAsyncThunk(
  "account/CountOfUsers",
  async (_, thunkAPI) => {
    try {
      const response = await agent.Admin.CountUsers();
      return response;
    } catch (error: any) {
      const errorMessage = error.data.detail || "خطا در دریافت شمارش";
      return thunkAPI.rejectWithValue({ error: errorMessage });
    }
  }
);

export const CountOfTransactions = createAsyncThunk(
  "account/CountOfTransactions",
  async (_, thunkAPI) => {
    try {
      const response = await agent.Admin.CountTransaction();
      return response;
    } catch (error: any) {
      const errorMessage = error.data.detail || "خطا در دریافت شمارش";
      return thunkAPI.rejectWithValue({ error: errorMessage });
    }
  }
);

export const CountOfTransactionsStatus = createAsyncThunk(
  "account/CountOfTransactionsStatus",
  async (_, thunkAPI) => {
    try {
      const response = await agent.Admin.CountStatusTransaction();
      console.log(response);
      return response;
    } catch (error: any) {
      const errorMessage = error.data.detail || "خطا در دریافت شمارش";
      return thunkAPI.rejectWithValue({ error: errorMessage });
    }
  }
);


export const fetchUsers = createAsyncThunk(
  "account/fetchUsers",
  async (params: { limit?: string; gender?: string; last_login?: string }, thunkAPI) => {
    try {
      const response = await agent.Admin.UserList(params);
      return response;
    } catch (error: any) {
      const errorMessage = error.data.detail || "خطا در دریافت اطلاعات کاربران";
      return thunkAPI.rejectWithValue({ error: errorMessage });
    }
  }
);


export const DeleteUser = createAsyncThunk(
  "account/DeleteUser",
  async (id: number, thunkAPI) => {
    try {
      const response = await agent.Admin.DeleteUser(id);
      toast.success("کاربر با موفقیت حذف شد", { autoClose: 3000 });
      return response;
    } catch (error: any) {
      const errorMessage = error.data.detail || "خطا در حذف کاربر";
      toast.error(errorMessage, { autoClose: 3000 });
      return thunkAPI.rejectWithValue({ error: errorMessage });
    }
  }
);

export const fetchAllTransfers = createAsyncThunk(
  "account/fetchAllTransfers",
  async (params: { limit?: string; date_filter?: string }, thunkAPI) => {
    try {
      const response = await agent.Admin.TransfersList(params);
      return response;
    } catch (error: any) {
      const errorMessage = error.data.detail || "خطا در دریافت اطلاعات تراکنش های انتقال وجه";
      return thunkAPI.rejectWithValue({ error: errorMessage });
    }
  }
);


export const fetchAllRecharges = createAsyncThunk(
  "account/fetchAllRecharges",
  async (params: { limit?: string; date_filter?: string }, thunkAPI) => {
    try {
      const response = await agent.Admin.RechargesList(params);
      return response;
    } catch (error: any) {
      const errorMessage = error.data.detail || "خطا در دریافت اطلاعات تراکنش های خرید شارژ";
      return thunkAPI.rejectWithValue({ error: errorMessage });
    }
  }
);


export const changeUserPassword = createAsyncThunk(
  "account/changeUserPassword",
  async (
    data: {id:number, current_password: string; new_password: string },
    thunkAPI
  ) => {
    try {
      const { id, ...passwordData } = data;
      const response = await agent.Admin.UserpasswordRecovery(id , passwordData);
      //toast.success('رمز عبور با موفقیت تغییر کرد');
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data.detail });
    }
  }
);

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    signOut: (state) => {
      state.user = null;
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      localStorage.removeItem("isNewUser");

      localStorage.setItem("isManualSignOut", "true");
      localStorage.setItem("theme", "light");

      const toastId = toast.info("شما با موفقیت خارج شدید", {
        autoClose: false,
      });

      setTimeout(() => {
        toast.dismiss(toastId);
      }, 4000);

      const currentPath = window.location.pathname;
      if (currentPath.startsWith("/admin")) {
        router.navigate("/sign-in-admin");
      } else if (currentPath.startsWith("/cp")) {
        router.navigate("/sign-in");
      } else {
        router.navigate("/sign-in");
      }
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(changePassword.rejected, (state) => {
        state.isLoading = false;
      });
      builder
      .addCase(changeUserPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(changeUserPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(changeUserPassword.rejected, (state) => {
        state.isLoading = false;
      });
    builder.addCase(deleteCard.fulfilled, (state, action) => {
      state.cards = state.cards.filter(
        (card) => card.cardNumber !== action.meta.arg
      ); // حذف کارت از لیست کارت‌ها
    });
    builder.addCase(deleteCard.rejected, (state, action) => {
      toast.error("حذف کارت با مشکل روبه رو شده است");
    });

    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload };
        state.isLoading = false;
      })
      .addCase(updateUserProfile.rejected, (state) => {
        state.isLoading = false;
      });
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state) => {
        state.isLoading = false;
        const currentPath = window.location.pathname;
      });
      builder
      .addCase(userAds.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(userAds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ads = action.payload;
      })
      .addCase(userAds.rejected, (state) => {
        state.isLoading = false;
        const currentPath = window.location.pathname;

      });

    builder.addCase(refreshTokensAsync.rejected, (state) => {
      state.user = null;
      localStorage.removeItem("user");
      const isManualSignOut = localStorage.getItem("isManualSignOut");

      if (!isManualSignOut) {
        toast.error("دسترسی شما قطع شد، لطفاً مجدد وارد شوید");
      }

      localStorage.removeItem("isManualSignOut");
      router.navigate("/sign-in");
    });

    builder.addCase(signInUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(verifyOTP.fulfilled, (state, action) => {
      state.user = action.payload;
    });
    builder.addCase(signInSuperUser.pending, (state) => {
      state.isLoading = true;
    });
    builder
      .addCase(addCard.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addCard.fulfilled, (state, action) => {
        state.isLoading = false; // Loading complete
        // You can add the new card to state here if needed
        // Example: state.cards.push(action.payload);
      })
      .addCase(addCard.rejected, (state, action) => {
        state.isLoading = false;
      });
    builder
      .addCase(fetchCards.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCards.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cards = action.payload;
      })
      .addCase(fetchCards.rejected, (state) => {
        state.isLoading = false;
        //toast.error('خطا در دریافت لیست کارت‌ها');
      });

    builder
      .addCase(fetchCardInfo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCardInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cardInfo = action.payload;
        state.error = null;
      })
      .addCase(fetchCardInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? null;
      });
    builder
      .addCase(updateCard.pending, (state) => {
        state.isLoading = true; // Indicate loading state
      })
      .addCase(updateCard.fulfilled, (state, action) => {
        state.isLoading = false; // Loading complete
        // Optionally, you can update the card info in state if necessary
        // e.g., state.cardInfo = action.payload; if the API returns updated info
        //toast.success('کارت با موفقیت به روز رسانی شد'); // Show success message
      })
      .addCase(updateCard.rejected, (state, action) => {
        state.isLoading = false; // Loading complete
        //toast.error('خطا در به روز رسانی کارت'); // Show error message
      });
    builder
      .addCase(transferCard.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(transferCard.fulfilled, (state, action) => {
        state.isLoading = false;
        //toast.success('انتقال با موفقیت انجام شد');
      })
      .addCase(transferCard.rejected, (state, action) => {
        state.isLoading = false;
      });

    builder
      .addCase(sendOtp.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(sendOtp.fulfilled, (state) => {
        state.isLoading = false;
        toast.success("رمز پویا با موفقیت ارسال شد", {
          autoClose: 3000,
        });
      })
      .addCase(sendOtp.rejected, (state) => {
        state.isLoading = false;
        toast.error("خطا در ارسال رمز پویا");
      });
    builder
      .addCase(saveDesCard.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(saveDesCard.fulfilled, (state, action) => {
        state.isLoading = false;
        const payload = action.payload as any;
        // toast.success('کارت مقصد با موفقیت ذخیره شد', {
        //     autoClose: 3000,
        // });
      })
      .addCase(saveDesCard.rejected, (state, action) => {
        state.isLoading = false;
        const error = (action.payload as { error: string }).error;
        toast.error(error || "خطا در ذخیره کارت مقصد", { autoClose: 3000 });
      });
    builder
      // Fetch saved destination cards
      .addCase(fetchSavedDesCards.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSavedDesCards.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(fetchSavedDesCards.rejected, (state, action) => {
        state.isLoading = false;
      });

    builder
      .addCase(chargeUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(chargeUser.fulfilled, (state) => {
        state.isLoading = false;
        // در صورت نیاز می‌توانید اطلاعات مربوط به شارژ را به state اضافه کنید
      })
      .addCase(chargeUser.rejected, (state, action) => {
        state.isLoading = false;
        //state.error = action.payload?.error || 'خطا در انجام شارژ';
      });

    builder
      .addCase(sendPooyaCharge.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(sendPooyaCharge.fulfilled, (state) => {
        state.isLoading = false;
        toast.success("رمز پویا با موفقیت ارسال شد", {
          autoClose: 3000,
        });
      })
      .addCase(sendPooyaCharge.rejected, (state) => {
        state.isLoading = false;
        toast.error("خطا در ارسال رمز پویا");
      });

    builder
      .addCase(fetchTransactionsHistory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTransactionsHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchTransactionsHistory.rejected, (state) => {
        state.isLoading = false;
        //toast.error('خطا در دریافت لیست کارت‌ها');
      });
    builder
      .addCase(fetchTransactionsRecharge.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTransactionsRecharge.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchTransactionsRecharge.rejected, (state) => {
        state.isLoading = false;
      });
    builder
      .addCase(fetchTransactionsCardToCard.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTransactionsCardToCard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchTransactionsCardToCard.rejected, (state) => {
        state.isLoading = false;
      });
    builder
      .addCase(CountOfUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(CountOfUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userCount = action.payload;
      })
      .addCase(CountOfUsers.rejected, (state, action) => {
        state.isLoading = false;
        //state.error = action.payload?.error || 'خطا در دریافت شمارش کاربران';
      });

    builder
      .addCase(CountOfTransactions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(CountOfTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactionCount = action.payload;
      })
      .addCase(CountOfTransactions.rejected, (state, action) => {
        state.isLoading = false;
        //state.error = action.payload?.error || 'خطا در دریافت شمارش کاربران';
      });

    builder
      .addCase(CountOfTransactionsStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(CountOfTransactionsStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactionStatus = action.payload;
      })
      .addCase(CountOfTransactionsStatus.rejected, (state, action) => {
        state.isLoading = false;
        //state.error = action.payload?.error || 'خطا در دریافت شمارش کاربران';
      });
      builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.isLoading = false;
      });

      builder
      .addCase(fetchAllTransfers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllTransfers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchAllTransfers.rejected, (state) => {
        state.isLoading = false;
      });

      builder
      .addCase(fetchAllRecharges.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllRecharges.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchAllRecharges.rejected, (state) => {
        state.isLoading = false;
      });


    builder.addMatcher(
      isAnyOf(signInUser.rejected, verifyOTP.rejected),
      (state) => {
        state.isLoading = false;
      }
    );
  },
});

export const { signOut, setUser } = accountSlice.actions;
export default accountSlice.reducer;

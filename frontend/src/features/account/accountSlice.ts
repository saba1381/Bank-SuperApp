import { User ,Card } from './../../models/UserModel';
import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import agent from "../../api/agent";
import { toast } from "react-toastify";
import { router } from "../../router/Routes";
import { setLoginStepToOTP } from "../../layout/appSlice";
interface AccountState {
    user: User | null,
    isLoading: boolean,
    cards: Array<any> | [], // اضافه کردن وضعیت کارت‌ها
}

const initialState: AccountState = {
    user: null,
    isLoading: false,
    cards: [], // مقدار اولیه برای کارت‌ها
};

export const verifyOTP = createAsyncThunk(
    'account/verifyOtp',
    async (data: object, thunkAPI) => {
        try {
            const userDto = await agent.UserProfile.verifyOTP(data);
            const { ...user } = userDto;
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.data });
        }
    }
);

export const registerUser = createAsyncThunk(
    'account/register',
    async (data: object, thunkAPI) => {
        try {
            const userDto = await agent.UserProfile.register(data);
            const { ...user } = userDto;
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.data });
        }
    }
);

export const refreshTokensAsync = createAsyncThunk(
    'account/refreshTokens',
    async (_, thunkAPI) => {
        const userObject = JSON.parse(localStorage.getItem('user') || '{}');

        try {
            
            const refreshedToken = await agent.UserProfile.refreshTokens({ refreshToken: userObject.tokens.refresh.token });
            
        
            userObject.tokens = refreshedToken;
            localStorage.setItem('user', JSON.stringify(userObject));
            thunkAPI.dispatch(setUser(userObject));
            localStorage.removeItem('isManualSignOut');
            return userObject;  
        } catch (error) {

            const isManualSignOut = localStorage.getItem('isManualSignOut');
            if (!isManualSignOut) {
                thunkAPI.dispatch(signOut()); 
            }
            return thunkAPI.rejectWithValue({ error: 'Failed to refresh token' });
        }
    },
    {
        condition: () => {
            if (!localStorage.getItem('user')) return false;
        }
    }
);

export const signInUser = createAsyncThunk(
    'account/signInUser',
    async (data: object, thunkAPI) => {
        try {
            const userDto = await agent.UserProfile.login(data);
            const { ...user } = userDto;
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.data });
        }
    }
);

export const fetchCurrentUser = createAsyncThunk(
    'account/fetchCurrentUser',
    async (_, thunkAPI) => {
        thunkAPI.dispatch(setUser(JSON.parse(localStorage.getItem('user') ?? '')));
    },
    {
        condition: () => {
            if (!localStorage.getItem('user')) return false;
        }
    }
);

export const fetchUserProfile = createAsyncThunk(
    'account/fetchUserProfile',
    async (_, thunkAPI) => {
        const currentPath = window.location.pathname;
        if (currentPath !== '/cp') {
            return thunkAPI.rejectWithValue({ error: 'Not in CP page' });
        }
        try {
            const response = await agent.UserProfile.profileInfo();
            return response;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.response?.data });
        }
    }
);

export const updateUserProfile = createAsyncThunk(
    'account/updateUserProfile',
    async (profileData: object, thunkAPI) => {
        try {
            const response = await agent.UserProfile.updateProfile(profileData);
            return response;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.data });
        }
    }
);


export const changePassword = createAsyncThunk(
    'account/changePassword',
    async (data: { current_password: string, new_password: string }, thunkAPI) => {
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
    'account/addCard',
    async (data: object, thunkAPI) => {
        try {
            const response = await agent.Card.AddCard(data);
            return response; 
        } catch (error: any) {
            const errorMessage = error.data.detail || 'خطا در ثبت کارت';
            return thunkAPI.rejectWithValue({ error: errorMessage });
        }
    }
);


export const fetchCards = createAsyncThunk(
    'account/fetchCards',
    async (_, thunkAPI) => {
        try {
            const response = await agent.Card.CardList(); // فراخوانی API برای دریافت لیست کارت‌ها
            return response; // برگرداندن داده‌های کارت‌ها
        } catch (error: any) {
            const errorMessage = error.data.detail || 'خطا در دریافت کارت‌ها';
            return thunkAPI.rejectWithValue({ error: errorMessage });
        }
    }
);

  
export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        signOut: (state) => {
            state.user = null;
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
        
            
            localStorage.setItem('isManualSignOut', 'true');
        
            const toastId = toast.info('شما با موفقیت خارج شدید', {
                autoClose: false
            });
        
            setTimeout(() => {
                toast.dismiss(toastId);
            }, 4000);
        
            router.navigate('/sign-in');
        }
        ,
        setUser: (state, action) => {
            state.user = action.payload;
        }
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
                //if (currentPath === '/cp') {
                //    toast.error('خطا در دریافت اطلاعات پروفایل');
                //}
            });

            builder.addCase(refreshTokensAsync.rejected, (state) => {
                state.user = null;
                localStorage.removeItem('user');
                const isManualSignOut = localStorage.getItem('isManualSignOut');
                
                if (!isManualSignOut) {
                    toast.error('دسترسی شما قطع شد، لطفاً مجدد وارد شوید');
                }
                
                localStorage.removeItem('isManualSignOut');
                router.navigate('/sign-in');
            });
            
        builder.addCase(signInUser.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(verifyOTP.fulfilled, (state, action) => {
            state.user = action.payload;
        });
        builder
        .addCase(addCard.pending, (state) => {
            state.isLoading = true; // Indicate loading state
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
    state.isLoading = true; // نشان‌دهنده وضعیت در حال بارگذاری
  })
  .addCase(fetchCards.fulfilled, (state, action) => {
    state.isLoading = false; // بارگذاری کامل شد
    state.cards = action.payload; // ذخیره لیست کارت‌ها در state
  })
  .addCase(fetchCards.rejected, (state) => {
    state.isLoading = false; // بارگذاری با خطا مواجه شد
    toast.error('خطا در دریافت لیست کارت‌ها');
  });

        builder.addMatcher(isAnyOf(signInUser.rejected, verifyOTP.rejected), (state) => {
            state.isLoading = false;
        });
      
    }
});

export const { signOut, setUser } = accountSlice.actions;
export default accountSlice.reducer;

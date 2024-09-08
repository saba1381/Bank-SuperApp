import { User } from './../../models/UserModel';
import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";

import agent from "../../api/agent";
import { toast } from "react-toastify";
import { router } from "../../router/Routes";

import { setLoginStepToOTP } from "../../layout/appSlice";

interface AccountState {
    user: User | null,
    isLoading :boolean
}

const initialState: AccountState = {
    user: null,
    isLoading : false,
};

export const verifyOTP = createAsyncThunk(
    'account/verifyOtp',
    async (data:object, thunkAPI) => {
        try {
            const userDto = await agent.UserProfile.verifyOTP(data);
            const {...user} = userDto;
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        } catch (error:any) {
            return thunkAPI.rejectWithValue({error: error.data});
        }
    }
)

export const refreshTokensAsync = createAsyncThunk(
    'account/refreshTokens',
    async (_, thunkAPI) => {
        const userObject = JSON.parse(localStorage.getItem('user') || '{}');
        //get refreshed token from api
        // const refreshedToken =  await agent.UserProfile.refreshTokens({refreshToken:userObject.tokens.refresh.token});
        // userObject.tokens = refreshedToken;

        thunkAPI.dispatch(setUser(userObject));
        localStorage.setItem('user', JSON.stringify(userObject));
        window.location.reload();
    },
    {
        condition: () => {
            if (!localStorage.getItem('user')) return false;
        }
    }
)


export const signInUser = createAsyncThunk(
    'account/signInUser',
    async (data:object, thunkAPI) => {
        try {
            const userDto = await agent.UserProfile.login(data);
            const {...user} = userDto;
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        } catch (error:any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)

export const fetchCurrentUser = createAsyncThunk(
    'account/fetchCurrentUser',
    async (_, thunkAPI) => {
        thunkAPI.dispatch(setUser(JSON.parse(localStorage.getItem('user')?? '')))
        // try {
        //     const userDto = await agent.UserProfile.currentUser();
        //     const {...user} = userDto;
            
        //     localStorage.setItem('user', JSON.stringify(user));
        //     return user;
        // } catch (error) {
        //     return thunkAPI.rejectWithValue(error);
        // }
    },
    {
        condition: () => {
            if (!localStorage.getItem('user')) return false;
        }
    }
)

export const accountSlice = createSlice({
    name:'account',
    initialState,
    reducers: {
        signOut: (state) => {
            state.user = null;
            localStorage.removeItem('user');
            router.navigate('/');
        },
        setUser: (state, action) => {
            state.user = action.payload;
        }
    },
    extraReducers: (builder => {
        builder.addCase(refreshTokensAsync.rejected, (state) => {
            state.user = null;
            localStorage.removeItem('user');
            toast.error('دسترسی شما قطع شد ، لطفا مجدد وارد شوید');
            router.navigate('/');
        });
        builder.addCase(signInUser.pending,(state)=>{
            state.isLoading = true;
        });
        builder.addCase(verifyOTP.fulfilled, (state, action:any) => {
            state.user = action.payload;
        });
        builder.addMatcher(isAnyOf(signInUser.rejected,verifyOTP.rejected), (state, action) => {

          
        })
       
    })
})

export const {signOut, setUser} = accountSlice.actions;
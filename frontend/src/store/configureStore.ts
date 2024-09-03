import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import { accountSlice } from "../features/account/accountSlice";
import appSlice from "../layout/appSlice";



export const store = configureStore({
    reducer:{
        app:appSlice,
        account:accountSlice.reducer,
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const UseAppDispatch = ()=> useDispatch<AppDispatch>();
export const UseAppSelector:TypedUseSelectorHook<RootState> = useSelector;
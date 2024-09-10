import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loginStep: "mobile",
  startTimer: false,
  timer: {
    seconds: 0,
    minutes: 2,
    intervallId: null,
  },
  showCardList: false,
};

export const appSlice = createSlice({
  name: "appslice",
  initialState,
  reducers: {
    setLoginStepToMobile: (state) => {
      state.loginStep = "mobile";
      state.startTimer = false;
    },
    setLoginStepToOTP: (state) => {
      state.loginStep = "otp";
      state.startTimer = true;
    },
    TimerTick: (state) => {
      if (state.timer.seconds > 0) {
        state.timer.seconds -= 1;
      }
      if (state.timer.seconds === 0) {
        if (state.timer.minutes === 0) {
          state.loginStep = "mobile";
          state.timer.minutes = 2;
          state.startTimer = false;
          clearInterval(state.timer.intervallId);
        } else {
          state.timer.minutes -= 1;
          state.timer.seconds = 59;
        }
      }
    },
    setTimeInterval: (state, action) => {
      state.timer.intervallId = action.payload;
    },
    clearTimeInterval: (state) => {
      clearInterval(state.timer.intervallId);
    },
    setStartTimer: (state, action) => {
      state.startTimer = action.payload;
    },
    // اکشن‌ها برای مدیریت نمایش لیست کارت‌ها
    showCardList: (state) => {
      state.showCardList = true;
    },
    hideCardList: (state) => {
      state.showCardList = false;
    },
  },
});

export const {
  setStartTimer,
  TimerTick,
  setTimeInterval,
  clearTimeInterval,
  setLoginStepToMobile,
  setLoginStepToOTP,
  showCardList,
  hideCardList,
} = appSlice.actions;

export default appSlice.reducer;

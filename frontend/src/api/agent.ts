import axios from "axios";
import { toast } from "react-toastify";
import { store } from "../store/configureStore";
import { refreshTokensAsync } from "../features/account/accountSlice";
import { signOut } from "../features/account/accountSlice";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.withCredentials = false;

const responseBody = (response: any) => response;

axios.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axios.interceptors.response.use(
  async (response) => {
    return response.data;
  },
  async (error) => {
    if (error?.response) {
      const { data, status } = error.response;
      switch (status) {
        case 400:
          if (data.errors) {
            const modelStateErrors = [];
            for (const key in data.errors) {
              if (data.errors[key]) {
                modelStateErrors.push(data.errors[key]);
              }
            }
            throw modelStateErrors.flat();
          }
          toast.error(data.Title);
          break;

        case 401:
          if (data.message === "Token is expired" || data.message === "Unauthorized") {
            toast.error('دسترسی شما قطع شد، لطفاً مجدد وارد شوید');
            store.dispatch(signOut()); // فراخوانی اکشن signOut
          } else {
            store.dispatch(refreshTokensAsync());
            toast.error('زمان توکن شما به پایان رسیده است. لطفاً مجدداً وارد شوید.');
          }
          break;

        case 403: // در صورت منقضی شدن رفرش توکن
          toast.error('زمان توکن شما به پایان رسیده است. لطفاً مجدداً وارد شوید.');
          store.dispatch(signOut()); // خروج از حساب
          break;

        case 406:
          toast.error("متاسفانه پاسخ شما قابل قبول نیست.");
          break;

        case 429:
          toast.error("درخواست‌ها به سمت سرور زیاد است.");
          break;

        case 500:
          toast.error("خطای داخلی سرور لطفا تا دقایقی دیگر مجدد تلاش نمایید.");
          break;

        default:
          toast.error(data.Title || data.title);
          break;
      }

      return Promise.reject(error.response);
    } else {
      return Promise.reject(error.response);
    }
  }
);

const requests = {
  get: (url: string) => axios.get(url).then(responseBody),
  post: (url: string, body: object) => axios.post(url, body).then(responseBody),
  put: (url: string, body: object) => axios.put(url, body).then(responseBody),
  del: (url: string, data: object) =>
    axios.delete(url, { headers: {}, data }).then(responseBody),
  options: (url: string) => axios.options(url).then(responseBody),
};

const UserProfile = {
  login: (values: object) => requests.post("users/login/", values),
  verifyOTP: (values: object) => requests.post("users/verify-otp/", values),
  refreshTokens: (values: object) => requests.post("auth/refresh-tokens", values),
  register: (values: object) => requests.post("users/register/", values),
  profileInfo: () => requests.get("users/profile/update/"),
  updateProfile: (values: object) => requests.put("users/profile/update/", values),
  passwordRecovery: (values: object) => requests.put("users/password/change/", values),
  completeInfo : (values: object) => requests.put("users/complete-info/", values),
  currentUser: () => requests.get("account/currentUser"),
};

const Card = {
  Transfer: (values: object) => requests.post("card/card-to-card/", values),
  TransferSendOtp: (values: object) => requests.post("card/send-otp/", values),
  TransferVerifyOtp: (values: object) => requests.post("card/verify-otp/", values),
  SaveDesCard: (values: object) => requests.post("card/save_desCard/", values),
  AddCard: (values: object) => requests.post("card/add-card/", values),
  CardList: () => requests.get("card/my-cards/"),
  deleteCard: (values : any) => requests.del(`card/delete-card/${values.cardNumber}/`, values),
  cardInfo: (values : any) => requests.get(`card/info-card/${values.cardNumber}`),
  updateCard: (id: number, values: any) => requests.put(`card/edit-card/${id}/`, values),
};

const agent = {
  UserProfile,
  Card
};

export default agent;

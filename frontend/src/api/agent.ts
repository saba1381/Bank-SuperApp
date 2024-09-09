import axios from "axios";
import { toast } from "react-toastify";
import {  store } from "../store/configureStore";
import { refreshTokensAsync } from "../features/account/accountSlice";


axios.defaults.baseURL = process.env.REACT_APP_API_URL;
//Cors Policy
axios.defaults.withCredentials = false;

const responseBody = (response:any) => response;



axios.interceptors.request.use(config => {
    const token = store.getState().account.user?.token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
})

axios.interceptors.response.use(
  async (response) => {
    //await sleep();
    //const pagination = response.headers["pagination"];
    // if (pagination) {
      return response.data;
    // }
    // responseCode = response.status;
    // return response;
  },
  (error) => {
    if(error?.response){
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
          store.dispatch(refreshTokensAsync());
          toast.error(data.Title);
          break;
          case 406:
            toast.error("متاسفانه پاسخ شما قابل قبول نیست .");
            break;  
            case 429:
              toast.error("درخواست ها به سمت سرور زیاد است .");
              break;   
                
        case 500:
          toast.error("خطای داخلی سرور لطفا تا دقایقی دیگر مجدد تلاش نمایید .");
          break;
        default:
          toast.error(data.Title || data.title);
          break;
      }
  
      return Promise.reject(error.response);
    }
    else {
      //toast.error("Server Timeout 504.");
      return Promise.reject(error.response);
    }
   
  }
);

const requests = {
  get: (url:string, params?:string) => axios.get(url, { params }).then(responseBody),
  post: (url:string , body:object) => axios.post(url , body).then(responseBody),
  put: (url:string, body:object) => axios.put(url, { headers: {}, body }).then(responseBody),
  del: (url:string, data:object) =>
    axios.delete(url, { headers: {}, data }).then(responseBody),
  options: (url:string) => axios.options(url).then(responseBody),
  
};

const UserProfile = {
  login: (values:object) => requests.post("users/login/",values),
  verifyOTP: (values:object) => requests.post("users/verify-otp/", values),
  refreshTokens: (values:object) => requests.post("auth/refresh-tokens", values),
  register: (values:object) => requests.post("account/register", values),
  currentUser: () => requests.get("account/currentUser"),
};

const Card={
  Transfer: (values:object) => requests.post("Cards/Transfer/",values),
}


const agent = {
  UserProfile,
};

export default agent;

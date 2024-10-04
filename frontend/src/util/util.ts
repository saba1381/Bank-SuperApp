import { number } from "prop-types";

export function getCookie(key:string) {
    const b = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
    return b ? b.pop() : "";
  }

  export function currencyFormatter(price:number){
    return (price/100).toFixed(2);
  }

  export function currencyFormat(number:string){
    return Number(number).toLocaleString("fa-IR") ;
  }

  export function toPersianNumbers(num: number | string) {
    const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return num.toString().replace(/[0-9]/g, (d) => persianNumbers[parseInt(d, 10)]);
}
  
  export const sleep = () => new Promise((resolve) => setTimeout(resolve, 3500));

  export const TodayDate = new Date().toLocaleDateString('fa-IR');
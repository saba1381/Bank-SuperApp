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
  
  export const sleep = () => new Promise((resolve) => setTimeout(resolve, 3500));

  export const TodayDate = new Date().toLocaleDateString('fa-IR');
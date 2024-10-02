import React, { createContext, useContext, useState } from "react";

const HeaderContext = createContext();

export const useHeader = () => {
  return useContext(HeaderContext);
};

export const HeaderProvider = ({ children }) => {
  const [headerTitle, setHeaderTitle] = useState("موبایل بانک");

  return (
    <HeaderContext.Provider value={{ headerTitle, setHeaderTitle }}>
      {children}
    </HeaderContext.Provider>
  );
};
import React, { useState, useEffect } from 'react';
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/configureStore";
import { StrictMode } from "react";
import { Box, CssBaseline } from "@mui/material";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "@mui/material/styles";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { theme , darkTheme } from "./theme";
import * as serviceWorkerRegistration from "./serviceWorkerResgistration";
import SplashScreenBox from './SplashScreenBox';
import { Helmet } from 'react-helmet';
import Header from './components/Header'
import { router } from "./router/Routes";
import { HeaderProvider } from "./components/contexts/HeaderContext";
import * as serviceWorker from './serviceWorker';
import { useSelector } from "react-redux";
import { toggleTheme , setTheme } from "../src/features/theme/themeSlice";
import { useDispatch } from "react-redux";
import LoadingComponent from "../src/components/LoadingComponent";

const root = ReactDOM.createRoot(document.getElementById("root"));
if (process.env.NODE_ENV === 'production') {
  console.log = () => {};
  console.error = () => {};
  console.debug = () => {};
}
const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});
serviceWorkerRegistration.unregister();

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.theme.mode);
  const [loading, setLoading] = useState(true); 



  useEffect(() => {

    const savedTheme = localStorage.getItem("theme") || "light";
    dispatch(setTheme(savedTheme));
  }, [dispatch]);

  

  useEffect(() => {
    const hasVisited = sessionStorage.getItem('hasVisited');
    if (!hasVisited) {
      setTimeout(() => {
        setShowSplash(false);
        sessionStorage.setItem('hasVisited', true);
      }, 3000);
    } else {
      setShowSplash(false);
    }
  }, []);


  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000); 
  }, []);

  return (
    <StrictMode>
      
      <Provider store={store}>
      <HeaderProvider>
        <CacheProvider value={cacheRtl}>
          <ThemeProvider theme={mode === "light" ? theme : darkTheme}>
            <Box component="div" dir="rtl" sx={{ display: "flex", flexDirection: "column", maxHeight: '100vh' }}>
              <CssBaseline />
            

              {showSplash  ? (
                <SplashScreenBox />
              ) : (
                
                <RouterProvider router={router} />
               
              )}
               
              <ToastContainer
                position="top-center"
                rtl
                hideProgressBar
                theme="colored"
              />
            </Box>
          </ThemeProvider>
        </CacheProvider>
        </HeaderProvider>
      </Provider>
    
    </StrictMode>
  );
}


root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
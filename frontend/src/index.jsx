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
import { theme } from "./theme";
import * as serviceWorkerRegistration from "./serviceWorkerResgistration";
import SplashScreenBox from './SplashScreenBox';
import { Helmet } from 'react-helmet';
import Header from './components/Header'
import { router } from "./router/Routes";
import { HeaderProvider } from "./components/contexts/HeaderContext";




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

  

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
      setTimeout(() => {
        setShowSplash(false);
        localStorage.setItem('hasVisited', true);
      }, 3000);
    } else {
      setShowSplash(false);
    }
  }, []);

  return (
    <StrictMode>
      
      <Provider store={store}>
      <HeaderProvider>
        <CacheProvider value={cacheRtl}>
          <ThemeProvider theme={theme}>
            <Box component="div" dir="rtl" sx={{ display: "flex", flexDirection: "column", maxHeight: '100vh' }}>
              <CssBaseline />
            

              {showSplash ? (
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

root.render(<App />);
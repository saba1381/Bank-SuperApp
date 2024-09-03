import React, { useState, useEffect } from 'react';
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/Routes";
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

const root = ReactDOM.createRoot(document.getElementById("root"));
if (process.env.NODE_ENV === 'production') {
  console.log = () => {}
  console.error = () => {}
  console.debug = () => {}
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
      <Helmet>
                <title>  موبایل بانک</title>
            </Helmet>
      <Provider store={store}>
        <CacheProvider value={cacheRtl}>
          <ThemeProvider theme={theme}>
            <Box component="div" dir="rtl" sx={{ display: "flex" }}>
              <ToastContainer
                position="top-center"
                rtl
                toastStyle={{}}
                hideProgressBar
                theme="colored"
              />
              <CssBaseline />
              {showSplash ? (
                <SplashScreenBox />
              ) : (
                <RouterProvider router={router} />
              )}
            </Box>
          </ThemeProvider>
        </CacheProvider>
      </Provider>
    </StrictMode>
  );
}

root.render(<App />);

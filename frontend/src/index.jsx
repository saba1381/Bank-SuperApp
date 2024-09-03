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

root.render(
  <StrictMode>
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
            <RouterProvider router={router} />
          </Box>
        </ThemeProvider>
      </CacheProvider>
    </Provider>
  </StrictMode>
);

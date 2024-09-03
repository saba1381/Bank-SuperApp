import Box from "@mui/material/Box";

import { Outlet } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import "./styles.css";
import LoadingComponent from "../components/LoadingComponent";
import { UseAppDispatch } from "../store/configureStore";
import { fetchCurrentUser } from "../features/account/accountSlice";
import { sleep } from "../util/util";

export default function App() {
  const dispatch = UseAppDispatch();
  const [loading, setLoading] = useState(true);
  const initApp = useCallback(async () => {
    try {
      await dispatch(fetchCurrentUser());
      await sleep();
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);

  useEffect(() => {
    initApp().then(() => setLoading(false));
  }, [initApp]);




  if (loading) return <LoadingComponent message="لطفا منتظر باشید ..." />;

  return (
    <Box sx={{display:"flex",flexDirection:"column",minHeight:"100vh",width:"100%"}}>
      <Box
      component={"main"}
      sx={{mt:8,pt:3,flexGrow:1}}
      >
            <Outlet />
      </Box>
    </Box>
  );
}

import Box from "@mui/material/Box";

import { Outlet } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import "./styles.css";
import LoadingComponent from "../components/LoadingComponent";
import { UseAppDispatch } from "../store/configureStore";
import { fetchCurrentUser } from "../features/account/accountSlice";
import { sleep } from "../util/util";
import BottomMenu from '../features/private/bottomMenu/BottomMenu';
import { useSelector } from 'react-redux';
import Header from '../components/Header';
import { theme, darkTheme } from "./../theme";
import { RouterProvider } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { toggleTheme , setTheme } from "../features/theme/themeSlice";


export default function App() {
  const dispatch = UseAppDispatch();
  const { user, isLoading } = useSelector((state) => state.account);
  const [step, setStep] = useState('register');
  const [showProfile, setShowProfile] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const isCPPageAdmin = window.location.pathname.startsWith('/cp') || window.location.pathname.startsWith('/admin'); 
  const location = useLocation(); 
  const mode = useSelector((state) => state.theme.mode);

  useEffect(() => {
    if (location.pathname === '/sign-in' || location.pathname === '/sign-in-admin') {

      dispatch(setTheme("light"));
    } else {
      const savedTheme = localStorage.getItem("theme") || "light";
      dispatch(setTheme(savedTheme));
    }
  }, [dispatch, location.pathname]); 


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
    <Box sx={{display:"flex",flexDirection:"column",maxHeight:"100vh",width:"100%"}}>
      <Header />
      <Box
      component={"main"}
      sx={{flexGrow:1}}
      >
           {user && isCPPageAdmin && !isLoading && (<BottomMenu

                  /> )}
        
       
            <Outlet />
      </Box>
    </Box>
  );
}

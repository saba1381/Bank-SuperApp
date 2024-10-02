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

export default function App() {
  const dispatch = UseAppDispatch();
  const { user, isLoading } = useSelector((state) => state.account);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState('register');
  const [showProfile, setShowProfile] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const isCPPage = window.location.pathname.startsWith('/cp'); 

  const handleProfileClick = () => setShowProfile(true);
  const handleHistoryClick = () => setShowHistory(true);
  const handleServicesClick = () => setShowServices(true);
  const handleSettingsClick = () => setShowSettings(true);


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
           {user && isCPPage && !isLoading && (<BottomMenu

                  /> )}
        
       
            <Outlet />
      </Box>
    </Box>
  );
}

import React , {useState , useEffect} from 'react';
import { FaHome, FaBell, FaCreditCard, FaUserCircle, FaCog } from 'react-icons/fa';
import { Box, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import Notification from "../Notification";

const BottomMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isSettingsPage = location.pathname.startsWith('/cp/setting');
  const isCPPage = location.pathname==='/cp';
  const isListCardPage = location.pathname.startsWith('/cp/user-cards');
  const [isNewUser, setIsNewUser] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  useEffect(() => {
    const newUser = localStorage.getItem("isNewUser") === "true";
    setIsNewUser(newUser);

  }, []);


  const handleCardListClick = () => {
    if (isNewUser) {
      setNotificationOpen(true);
    } else {
      navigate("/cp/user-cards", { state: { from: "/cp/" } });
    }
  };
  const handleNotificationClose = () => {
    setNotificationOpen(false);
  };


  return (
    <Box sx={{
      position: 'fixed',
      bottom: 0,
      width: '100%',
      backgroundColor: '#fff',
      boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)',
      borderTop: '1px solid #ddd',
      display: 'flex',
      justifyContent: 'space-around',
      padding: '10px 0',
      zIndex: 1000
    }}>

      {/* Menu Item: خانه */}
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
        '&:hover svg': { color: '#6b7280' },
        '&:hover': { '& *': { color: '#6b7280' } }
      }}
      onClick={() => navigate('/cp')}
      >
        <FaHome style={{ color: isCPPage ? '#6b7280' : '#3b82f6',fontSize: '24px', transition: 'color 0.3s', marginBottom: '4px' }} />
        <Typography variant="caption" sx={{ color: isCPPage ? '#6b7280' : '#3b82f6', fontSize: '12px' }}>خانه</Typography>
      </Box>

    
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
        '&:hover svg': { color: '#6b7280' },
        '&:hover': { '& *': { color: '#6b7280' } }
      }}
      onClick={() => navigate('/notifications')}
      >
        <FaBell style={{ color: '#3b82f6', fontSize: '24px', transition: 'color 0.3s', marginBottom: '4px' }} />
        <Typography variant="caption" sx={{ color: '#3b82f6', fontSize: '12px' }}>اعلانات</Typography>
      </Box>

      {/* Menu Item: کارت‌ها */}
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
        '&:hover svg': { color: '#6b7280' },
        '&:hover': { '& *': { color: '#6b7280' } }
      }}
      onClick={()=>navigate("/cp/user-cards", { state: { from: "/cp/" } })}
      >
        <FaCreditCard style={{ color: isListCardPage ? '#6b7280' : '#3b82f6',fontSize: '24px', transition: 'color 0.3s', marginBottom: '4px' }} />
        <Typography variant="caption" sx={{ color: isListCardPage ? '#6b7280' : '#3b82f6',fontSize: '12px' }}>کارت‌ها</Typography>
      </Box>

      {/* Menu Item: پروفایل */}
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
        '&:hover svg': { color: '#6b7280' },
        '&:hover': { '& *': { color: '#6b7280' } }
      }}
      onClick={() => navigate('/profile')}
      >
        <FaUserCircle style={{ color: '#3b82f6', fontSize: '24px', transition: 'color 0.3s', marginBottom: '4px' }} />
        <Typography variant="caption" sx={{ color: '#3b82f6', fontSize: '12px' }}>پروفایل</Typography>
      </Box>

      {/* Menu Item: تنظیمات */}
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
        '&:hover svg': { color: '#6b7280' },
        '&:hover': { '& *': { color: '#6b7280' } }
      }}
      onClick={() => navigate('/cp/setting')}
      >
        <FaCog style={{
          color: isSettingsPage ? '#6b7280' : '#3b82f6',
          fontSize: '24px',
          transition: 'color 0.3s',
          marginBottom: '4px'
        }} />
        <Typography variant="caption" sx={{ color: isSettingsPage ? '#6b7280' : '#3b82f6',fontSize: '12px' }}>تنظیمات</Typography>
      </Box>
    </Box>
  );
};

export default BottomMenu;

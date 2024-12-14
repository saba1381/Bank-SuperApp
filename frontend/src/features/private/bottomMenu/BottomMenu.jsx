import React , {useState , useEffect} from 'react';
import { FaHome, FaBell, FaCreditCard, FaUserCircle, FaCog } from 'react-icons/fa';
import { Box, Typography , useTheme  } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import Notification from "../Notification";

const BottomMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const isSettingsPage = location.pathname.startsWith('/cp/setting');
  const isCPPageAdmin = location.pathname==='/cp'
  const isListCardPage = location.pathname.startsWith('/cp/user-cards');
  const isAdsPage = location.pathname.startsWith('/cp/ads');
  const isProfilePage = location.pathname.startsWith('/cp/profile-view');
  const isAdminPage = location.pathname.startsWith('/admin');
  const [isNewUser, setIsNewUser] = useState(false);
  const isAdminUserListPage = location.pathname === '/admin/user-list';
  const isAdminUserProfilePage = location.pathname === '/admin/profile-view';
  const [notificationOpen, setNotificationOpen] = useState(false);

  const isCPPage = location.pathname.startsWith('/cp');


  useEffect(() => {
    const newUser = localStorage.getItem("isNewUser") === "true";
    setIsNewUser(newUser);

  }, []);

  if (!isCPPage) return null;
  const handleCardListClick = () => {
    if (isNewUser) {
      setNotificationOpen(true);
    } else {
      const path = "/cp/user-cards";
      navigate(path, { state: { from: location.pathname } });
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
      backgroundColor: theme.palette.background.paper,
      boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)',
      borderTop: '1px solid #ddd',
      display: 'flex',
      justifyContent: 'space-around',
      padding: '10px 0',
      zIndex: 1000,
    }}>


    
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
        '&:hover svg': { color: '#6b7280' },
        '&:hover': { '& *': { color: '#6b7280' } }
      }}
      onClick={() => navigate('/cp/ads')}
      >
        <FaBell style={{ color: (isAdsPage) ? '#6b7280' : '#3b82f6', fontSize: '24px', transition: 'color 0.3s', marginBottom: '4px' }} />
        <Typography variant="caption" sx={{ color: (isAdsPage) ? '#6b7280' : '#3b82f6', fontSize: '12px' }}>اعلانات</Typography>
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
      onClick={handleCardListClick}
      >
        <FaCreditCard style={{ color: (isListCardPage) ? '#6b7280' : '#3b82f6',fontSize: '24px', transition: 'color 0.3s', marginBottom: '4px' }} />
        <Typography variant="caption" sx={{ color: (isListCardPage) ? '#6b7280' : '#3b82f6', fontSize: '12px' }}>{isAdminPage ? "لیست کاربران" : "کارت‌ها"}</Typography>
      </Box>
      
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
        <FaHome style={{ color: isCPPageAdmin ? '#6b7280' : '#3b82f6',fontSize: '24px', transition: 'color 0.3s', marginBottom: '4px' }} />
        <Typography variant="caption" sx={{ color: isCPPageAdmin ? '#6b7280' : '#3b82f6', fontSize: '12px' }}>خانه</Typography>
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
      onClick={() => navigate('/cp/profile-view')}
      >
        <FaUserCircle style={{ color:(isProfilePage) ? '#6b7280' : '#3b82f6', fontSize: '24px', transition: 'color 0.3s', marginBottom: '4px' }} />
        <Typography variant="caption" sx={{ color: (isProfilePage) ? '#6b7280' : '#3b82f6', fontSize: '12px' }}>پروفایل</Typography>
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

import React from 'react';
import { Snackbar, Alert , Button  , Box} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Notification = ({ open, onClose }) => {
    const navigate = useNavigate();
    const handleCompleteProfile = () => {
        navigate('/cp/complete-info'); 
        onClose(); 
      };
  return (
    <Snackbar open={open} autoHideDuration={8000} onClose={onClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} style={{top:70 }}>
      <Alert onClose={onClose} severity="info" sx={{ width: '100%' ,  borderRadius:'30px', boxShadow:3}}>
      <span>
          به موبایل بانک خود خوش آمدید، لطفا نسبت به تکمیل پروفایل خود اقدام کنید تا از خدمات بانکی ما بهره مند شوید.
        </span>
        <Box mt={{xs:'-10px' , sm:'3px'}}>
        <Button 
          color="primary" 
          onClick={handleCompleteProfile} 
         
        >
          تکمیل پروفایل
        </Button>
        </Box>
      </Alert>
    </Snackbar>
  );
};

export default Notification;

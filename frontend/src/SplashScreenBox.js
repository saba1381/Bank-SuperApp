import React from 'react';
import { Box, Typography , Avatar } from '@mui/material';
import { motion } from 'framer-motion';

const SplashScreenBox = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      width="100%"
      sx={{
        background:'linear-gradient(to right, #2560eb, #7c3aed)',
        dark: {
          background: 'linear-gradient(to right, #6b46c1, #3182ce)',
        },
      }}
    >
      <motion.div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        initial={{ opacity: 0, scale: 0.8, rotate: -15 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{
          duration: 1.5, 
          ease: [0.25, 0.8, 0.5, 1], 
        }}
      >
       

          <Avatar
              src={`${process.env.PUBLIC_URL}/logo.png`}
              alt="App Icon"
              variant="square"
              sx={{
                width: { xs: 130, md: 130 },
                height: { xs: 140, md: 130 },
                marginLeft: "0.1rem",
              }}
            />
            
        {/* </Typography> */}
      </motion.div>
    </Box>
  );
};

export default SplashScreenBox;

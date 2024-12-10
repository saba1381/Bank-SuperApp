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
        style={{ display: 'flex', gap: '8px', fontWeight: '600' }}
        initial={{ opacity: 0, y: -80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
       

        {/* <Typography
          component="span"
          variant="h3"
          sx={{
            fontSize: { xs: '2rem', sm: '3rem' },
            
            color: 'white',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
          }}
        > */}
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

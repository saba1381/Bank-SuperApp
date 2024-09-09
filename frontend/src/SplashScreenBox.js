import React from 'react';
import { Box, Typography } from '@mui/material';
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
        background: 'linear-gradient(to right, #6b46c1, #90cdf4)',
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
        <Typography
          component="span"
          variant="h3"
          sx={{
            fontSize: { xs: '2rem', sm: '3rem' },
            background: 'linear-gradient(to right, #2c5282, #2a4365)',
            backgroundClip: 'text',
            color: 'transparent',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
          }}
        >
          همراه
        </Typography>

        <Typography
          component="span"
          variant="h3"
          sx={{
            fontSize: { xs: '2rem', sm: '3rem' },
            background: 'linear-gradient(to right, #805ad5, #6b46c1)',
            backgroundClip: 'text',
            color: 'transparent',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
          }}
        >
          بانک
        </Typography>
      </motion.div>
    </Box>
  );
};

export default SplashScreenBox;

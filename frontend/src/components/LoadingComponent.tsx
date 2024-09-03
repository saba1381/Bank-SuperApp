import { Backdrop, Box, CircularProgress, Typography } from '@mui/material';
const LoadingComponent = ({message='Loading...'}) => {
  return (
    <Backdrop open={true} invisible={true}>
        <Box display='flex' flexDirection={"column"} justifyContent='center' alignItems='center' height='100vh' >
                <CircularProgress size={30}  sx={{mt:3}} color='secondary' />
                <Typography variant='h4' sx={{position:'fixed',justifyContent:'center',top:'60%' }} >{message}</Typography>
        </Box>
    </Backdrop>
  )
}

export default LoadingComponent
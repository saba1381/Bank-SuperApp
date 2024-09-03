import { Container, Paper, Typography } from "@mui/material"

const ServerError = () => {
   
  return (
    <Container component={Paper} sx={{p:15 ,textAlign:"center"}}>

    <Typography variant="h1" margin={5}>
        500
    </Typography>
    <Typography variant="h5" margin={10}>
         متاسفانه سرور قادر به پاسخگویی نیست ، از شکیبایی شما متشکریم .
    </Typography>

    </Container>
  )
}

export default ServerError
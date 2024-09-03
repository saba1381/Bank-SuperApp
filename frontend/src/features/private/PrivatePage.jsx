import { Box, Container, Grid, Paper } from "@mui/material"
import { useEffect } from "react";
import { UseAppDispatch } from "../../store/configureStore";


const PrivatePage = () => {
    const dispatch = UseAppDispatch();

    const loadDataAsync = async()=>{
       
    }

    useEffect(() => {
        loadDataAsync();
    
    }, [dispatch])
    
    return (
       <Container maxWidth="xl">
         <Grid container >
            <Grid item lg={6}>
                <Paper sx={{p:4}}>
                    <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"}>
                        Hi Private User :D !
                    </Box>
                </Paper>
            </Grid>

        </Grid>
       </Container>
    )
}

export default PrivatePage
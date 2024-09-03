import { Box, Container, Grid, Paper } from "@mui/material";
import { useEffect } from "react";
import { useDispatch } from "react-redux"; // Ensure this import matches your Redux setup
import { motion } from 'framer-motion';
import Link from "@mui/material/Link";
import { CiMobile1 } from "react-icons/ci";
import { BsCreditCard } from "react-icons/bs";
import { MdOutlineListAlt } from "react-icons/md";
import { FaRegChartBar } from "react-icons/fa";
import { BiTransfer } from "react-icons/bi";
import { BsBank2 } from "react-icons/bs";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { ImProfile } from "react-icons/im";
import { TbCreditCardPay } from "react-icons/tb";
import { FaMoneyCheck } from "react-icons/fa6";
import { GoChecklist } from "react-icons/go";
import { RiSimCard2Line } from "react-icons/ri";
import { CiClock2 } from "react-icons/ci";

const systems = [
    { title: "گردش حساب", icon: <FaRegChartBar size={46}/> },
    { title: 'لیست حساب', icon: <MdOutlineListAlt size={46}/> },
    { title: 'لیست کارت', icon: <BsCreditCard size={46}/> },
    { title: 'انتقال وجه داخلی', icon: <BiTransfer size={46}/> },
    { title: 'انتقال وجه بین بانکی', icon: <BsBank2 size={46}/> },
    { title: 'چک صیادی', icon: <FaMoneyCheckDollar size={46}/> },
    { title: 'حساب کاربری', icon: <ImProfile size={46}/> },
    { title: 'کارت به کارت', icon: <TbCreditCardPay size={46}/> },
    { title: 'پرداخت قبض', icon: <FaMoneyCheck size={46}/> },
    { title: 'لیست تسهیلات', icon: <GoChecklist size={46}/> },
    { title: 'خرید شارژ', icon: <RiSimCard2Line size={46}/> },
    { title: 'سوابق تراکنش', icon: <CiClock2 size={46}/> },
];

const PrivatePage = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const loadDataAsync = async () => {
            // Load your data here
        };
        loadDataAsync();
    }, [dispatch]);

    return (
        <Container maxWidth="xl" sx={{ py: 5 }}>
            <Grid container spacing={3}>
                {systems.map((system, index) => (
                    <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                        <Paper elevation={3} sx={{ p: 2, textAlign: 'center', cursor: 'pointer', transition: '0.3s', '&:hover': { transform: 'scale(0.95)' } }}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ scale: 0.9 }}
                                transition={{ duration: 0.05, ease: "easeOut" }}
                            >
                                <Box display="flex" flexDirection="column" alignItems="center">
                                    <Link href="#" underline="none" color="inherit">
                                        {system.icon}
                                    </Link>
                                    <Box mt={2} color="text.primary" sx={{ '&:hover': { color: 'primary.main' } }}>
                                        {system.title}
                                    </Box>
                                </Box>
                            </motion.div>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default PrivatePage;

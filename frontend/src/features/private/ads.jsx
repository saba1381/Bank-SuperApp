import React, { useEffect } from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { FcAbout } from "react-icons/fc";
import { motion } from "framer-motion";
import { toPersianNumbers } from "../../util/util";
import { userAds } from "../../features/account/accountSlice";
import { UseAppDispatch } from "../../store/configureStore";
import { useSelector } from "react-redux";

const MessageBox = () => {
  const dispatch = UseAppDispatch();
  const { ads, isLoading } = useSelector((state) => state.account);

  useEffect(() => {
    dispatch(userAds());
  }, [dispatch]);

  const formatDate = (date) => {
    if (!date) return "";
    return date.replace(/-/g, "/");
  };

  return (
    <Box
      sx={{
        padding: 2,
        maxWidth: { xs: "100%", sm: 600 },
        margin: "0 auto",
        maxHeight: { sm: "auto" },
        paddingBottom: 15,
      }}
    >
      {isLoading ? (
        <Typography variant="h6" sx={{ color: "gray" }}>
          در حال بارگذاری...
        </Typography>
      ) : (
        ads.map((ad, index) => (
          <motion.div
            key={ad.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <Card
              sx={{
                marginBottom: 2,
                boxShadow: 3,
                borderRadius: "8px",
                direction: "rtl",
                paddingX: 1,
                paddingY: -10,
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    textAlign: "left",
                    position: "relative",
                  }}
                >
                  <Typography
                    variant="body1"
                    color="textPrimary"
                    sx={{
                      marginLeft: "10px",
                      width: "100%",
                      fontSize:'16px'
                    }}
                  >
                    {ad.description}
                  </Typography>
                  <FcAbout sx={{ marginRight: 1, marginLeft: 20 }} size={40} />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mt: 1,
                  }}
                >
                  <Typography variant="body2" sx={{  }}>
                    {toPersianNumbers(formatDate(ad.start_date))}
                  </Typography>
                  <Typography variant="body2" sx={{  }}>
                    {ad.start_time
                      ? toPersianNumbers(
                          ad.start_time.split(":").slice(0, 2).join(":")
                        )
                      : ""}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        ))
      )}
    </Box>
  );
};

export default MessageBox;

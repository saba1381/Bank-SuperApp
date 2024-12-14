import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../src/features/theme/themeSlice";
import { Box ,Typography , Switch } from "@mui/material";

const ThemeSwitcher = () => {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.theme.mode);

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 , marginLeft:10 }}>
   
    <Switch
      checked={mode === "light"}
      onChange={() => dispatch(toggleTheme())}
      color="secondary"
    />
  </Box>
  );
};

export default ThemeSwitcher;

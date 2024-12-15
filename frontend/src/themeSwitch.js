import React ,{useState , useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme , setTheme } from "../src/features/theme/themeSlice";
import { Box ,Typography , Switch } from "@mui/material";

const ThemeSwitcher = () => {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.theme.mode);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      dispatch(setTheme(savedTheme));
    }
  }, [dispatch]);

  const handleThemeChange = () => {
    const newTheme = mode === "light" ? "dark" : "light";
    localStorage.setItem("theme", newTheme);
    dispatch(toggleTheme());
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 , marginLeft:10 }}>
   
    <Switch
      checked={mode === "light"}
      onChange={handleThemeChange}
      color="secondary"
    />
  </Box>
  );
};

export default ThemeSwitcher;

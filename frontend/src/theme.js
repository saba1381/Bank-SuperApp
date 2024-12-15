import { faIR } from '@mui/material/locale';
import {createTheme} from '@mui/material/styles';


export const theme =  createTheme(
    {
      
      typography: {
        fontFamily: ["IRANSans","sans-serif"].join(","),
        
        fontSize: '1.0rem',
        '@media (min-width:600px)': {
            fontSize: '1.0rem',
          },
        h1: {
          fontSize: '2.5rem',
          '@media (min-width:600px)': {
              fontSize: '2.5rem',
            },
          fontWeight:'bolder'
        },
        h2: {
          fontSize: '2.0rem',
          '@media (min-width:600px)': {
              fontSize: '2.0rem',
            },
          fontWeight:900
        },
        h3: {
          fontSize: '1.75rem',
          '@media (min-width:600px)': {
              fontSize: '1.75rem',
            },
            
          fontWeight:800
        },
        h4: {
          fontSize: '1.5rem',
          '@media (min-width:600px)': {
              fontSize: '1.5rem',
            },
          fontWeight:700
        },
        h5: {
          fontSize: '1.25rem',
          '@media (min-width:600px)': {
              fontSize: '1.25rem',
            },
          fontWeight:600
        },
        h6: {
          fontSize: '1rem',
          '@media (min-width:600px)': {
              fontSize: '1.0rem',
            },
          fontWeight:600
        },
        caption:{
          fontSize: '0.8rem',
          '@media (min-width:600px)': {
              fontSize: '1.1rem',
            },
        },
        body1:{
          fontSize: '0.8rem',
          '@media (min-width:600px)': {
              fontSize: '1.1rem',
            },
        },
        body2:{
          fontSize: '0.8rem',
          '@media (min-width:600px)': {
              fontSize: '1.1rem',
            },
        },
        allVariants:{
         
          fontWeight:100,
          lineHeight:1.829,
        }
      },
      palette: {
        mode: "light",
        background: {
          main:"#ffffff",
          default: "#F4F7FE",
          paper: "#ffffff",
          
        },
        primary: {
          100: "#d3d9eb",
          200: "#a6b3d7",
          300: "#7a8cc2",
          400: "#4d66ae",
          500: "#21409a",
          600: "#1a337b",
          700: "#14265c",
          800: "#0d1a3e",
          900: "#070d1f",
          contrastText: "#fff",
          dark:"#d7dee4",
          light:"#ff8601"
        },
        secondary: {
          100: "#fdccdd",
          200: "#fb99bc",
          300: "#f9669a",
          400: "#f73379",
          500: "#ce1778",
          600: "#c40046",
          700: "#930034",
          800: "#620023",
          900: "#310011",
          main: "#ce1778",
          contrastText:"ccc",
          dark:"#00072c",
          light:"#fe1e00"
        },
        text: {
          main: "#00497d",
          primary: "#004e92",
          secondary: "#f95500",
          disabled: "#6c757d",
          white:"#ffffff",
          dark:'#ffffff',
        },
        grey: {
          100: "#f5f5f5",
          200: "#ebebeb",
          300: "#e0e0e0",
          400: "#d6d6d6",
          500: "#cccccc",
          600: "#a3a3a3",
          700: "#7a7a7a",
          800: "#525252",
          900: "#292929",
          dark:'#ffffff',

        },

        
      },
      components:{
        MuiTextField:{

            styleOverrides:{
                root:{
                    padding:0,
                    borderRadius:30,
                    
                },
                
            },
        },
        MuiFilledInput:{
          defaultProps:{
            disableUnderline:true
          },
          styleOverrides:{
            root:{
              borderRadius:10
            },

          }
        },
        MuiPaper:{
          defaultProps:{
            elevation:0
          },
          styleOverrides:{
            root:{
              borderRadius:2,
            }
          }
        },
        MuiAppBar:{
          defaultProps:{
            color:"primary",
            elevation:8
          },
          styleOverrides:{
            root:{
              backgroundColor:"#ffffff",
              borderBottom:0,
              paddingRight:0,
              paddingLeft:0
            }
          }
        },
        MuiButton:{
          styleOverrides:{
            root:{
              borderRadius:30,
              height: 48,
              padding: '0 10px',
            },
            containedPrimary:{
              background: 'linear-gradient(45deg, #ce1778 , #21409a)',
              border: 0,
              
              color: 'white',
              padding: '0 40px',
              ":hover":{
                background: 'linear-gradient(-45deg, #ce1778 , #21409a)',
              }
            },
            outlined:{
             
              ":hover":{
                backgroundColor:"#0d6efd",
                borderColor:"#0d6efd",
                color:"#ffffff"
              }
            },
            outlinedPrimary:{
              borderColor:"#0d6efd",
              color:"#0d6efd"
            }


          }
        },
        MuiSelect:{
         styleOverrides:{
        
         }
        }
        ,
        MuiOutlinedInput:{
          styleOverrides:{
            root:{
              borderRadius:30,
              height:48
            }
          }
        }

      },
      direction: "rtl",
    },
    faIR
  );

  export const darkTheme = createTheme(
    {
      ...theme,
      palette: {
        ...theme.palette,
        mode: "dark",
        background: {
          main: "#121212",
          default: "#121212",
          paper: "#292828",
        },
        text: {
          ...theme.palette.text,
          primary: "#ffffff !important",
          secondary: "#d1d1d1",
        },
        grey: {
          ...theme.palette.grey,
          100: "#f5f5f5",
          200: "#e0e0e0",
          300: "#b3b3b3",
          400: "#8c8c8c",
          500: "#666666",
          600: "#4d4d4d",
          700: "#333333",
          800: "#1a1a1a",
          900: "#0d0d0d",
        },
      },
      
    },
    faIR
  );
  
  
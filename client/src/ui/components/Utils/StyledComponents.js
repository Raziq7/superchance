import { Button, styled } from "@mui/material";

export const GameButton = styled(Button)(({ theme, isActive }) => ({
  color: "white",
  fontSize:"1.5rem",
  fontFamily:"Poppins-Bold",
  textTransform: "uppercase",
  border: isActive ? "2px solid #FFBB00" : "2px solid rgba(206,0,0,1)",
  background: "rgb(255,183,183)",
  backgroundImage:"linear-gradient(180deg  ,rgb(255, 183, 183,0.1), #CE0000 , #CE0000, #CE0000 ,#CE0000 , #CE0000 , #CE0000 , #CE0000  , #CE0000 , #CE0000  )",
  borderRadius: "8px",
  boxShadow:"0px 2px 0px 0px rgba(0, 0, 0, 0.7)",
  transition: "background-image 0.5s ease",
  ":hover": {
    border: "2px solid #FFBB00",
    boxShadow: "0px 5px 4px 0px rgba(0, 0, 0, 0.7)",
    backgroundImage:"linear-gradient(180deg, rgba(255,183,183,1) 0%, rgba(206,0,0,1) 10%)",
  },
  "&.Mui-disabled": {
    boxShadow:"0px 5px 4px 0px rgba(0, 0, 0, 0.7)",
    color:"#FFFFFF50",
    backgroundImage:"linear-gradient(180deg, rgba(255,183,183,1) 0%, rgba(206,0,0,1) 10%)",
  },
}));




// color: "white",
// fontSize: "24px",
// fontWeight: "600",
// textTransform: "uppercase",
// border: isActive ? "2px solid #FFBB00" : "none",
// background: "rgb(237,33,33)",
// backgroundImage:
//   "linear-gradient(180deg, rgba(237,33,33,1) 0%, rgba(255,183,183,1) 13%, rgba(227,42,42,1) 23%)",
// borderRadius: "8px",
// boxShadow: 3,
// transition: "background-image 0.5s ease",
// ":hover": {
//   backgroundImage:
//     "linear-gradient(180deg, rgba(122,3,3,1) 0%, rgba(255,183,183,1) 13%, rgba(122,3,3,1) 23%)",
// },

// "&.Mui-disabled": {
//   color: "#FFFFFF50",
//   backgroundImage:
//   "linear-gradient(180deg, rgba(237,33,33,50) 0%, rgba(255,183,183,50) 13%, rgba(227,42,42,50) 23%)",
// },
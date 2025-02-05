import { Box, styled, Typography } from "@mui/material";
import React from "react";

function Rules() {
  return (
    <Box
      sx={{
        height: "100%",
        backgroundColor: "#FFE5C6",
        border: "1px solid #9E3F1B",
        borderRadius: "16px",
        py: 3,
        px: 4,
        mx: 2,fontFamily:"Poppins-Bold",fontSize:"18.8px"
      }}
    >
      <Box component={"ul"} sx={{ li: { mb: 2 }}}>
        <li> <StyleTypo>Single chance is a game with 10 numbers from 0 to 9, which held in every 2 minutes.</StyleTypo> </li>
        <li> <StyleTypo>You can place numbers of bets in each draw before the timer reaches in last 10 seconds.</StyleTypo> </li>
        <li> <StyleTypo>In any time you can collect yur tickets, you have to claim your tickets with its ID, so that the winning amount will be added to your balance.</StyleTypo> </li>
        <li> <StyleTypo>There is an opportunity to cancel your bets before the draw.</StyleTypo> </li>
        <li> <StyleTypo>The Maximum amount that can be placed in a single number  :  5000</StyleTypo> </li>
        <li> <StyleTypo>The winning amount will be calculated as  :  Bet placed on that number *  10</StyleTypo> </li>
      </Box>
    </Box>
  );
}

export default Rules;

const StyleTypo = styled(Typography)(() => ({
  color: "black", 
  fontSize: "1.3rem",
  fontWeight: "600",
}))

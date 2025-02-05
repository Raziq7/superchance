import React, { useEffect } from "react";
import YouWinImg from "../../../public/backgrounds/youWin.png";
import {  Typography, Zoom } from "@mui/material";

function YouWin({ isOpen, winAmount, setIsOpen }) {


  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setIsOpen(false);
      }, 3000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [isOpen]);
  return (
    <div
      style={{
        position: "absolute",
        bottom: "35px",
        left: "50%",
        transform: "translateX(-50%)",
      }}
    >
      <Zoom in={isOpen}>
        <div style={{ position: "relative" }}>
          <img src={YouWinImg} alt="youWin" />
          <Typography
            sx={{
              position: "absolute",
              bottom: "70px",
              left: "50%",
              transform: "translateX(-50%)",
              color: "#fff",
              fontSize: "30px",
              fontWeight: "bold",
              fontFamily: "Hahmlet Variable",
            }}
          >
            {winAmount}
          </Typography>
        </div>
      </Zoom>
    </div>
  );
}

export default YouWin;

import { Box, Button, Paper, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import token from "../../../public/icons/token.png";
// import { useState } from "react";

// const betList = [
//   {
//     num: 1,
//     color: "#005EE1",
//     token: "50",
//   },

//   {
//     num: 2,
//     color: "#EF0202",
//     token: "50",
//   },
//   {
//     num: 3,
//     color: "#F98C07",
//     token: "50",
//   },
//   {
//     num: 4,
//     color: "#EEDE01",
//     token: "50",
//   },
//   {
//     num: 5,
//     color: "#3CC23B",
//     token: "50",
//   },
//   {
//     num: 6,
//     color: "#0154C9",
//     token: "50",
//   },
//   {
//     num: 7,
//     color: "#3D07A5",
//     token: "50",
//   },
//   {
//     num: 8,
//     color: "#EB1B90",
//     token: "50",
//   },
//   {
//     num: 9,
//     color: "#01A501",
//     token: "50",
//   },
//   {
//     num: 0,
//     color: "#F98C07",
//     token: "50",
//   },
// ];

function BetNumbers({ betNumList, betButtonClick, betremoveClick, chipSound, isDisabled }) {
  // const [betNumList, setBetNumList] = useState([
  //   {
  //     num: 1,
  //     color: "#005EE1",
  //     token: "",
  //   },

  //   {
  //     num: 2,
  //     color: "#EF0202",
  //     token: "",
  //   },
  //   {
  //     num: 3,
  //     color: "#F98C07",
  //     token: "",
  //   },
  //   {
  //     num: 4,
  //     color: "#EEDE01",
  //     token: "",
  //   },
  //   {
  //     num: 5,
  //     color: "#3CC23B",
  //     token: "",
  //   },
  //   {
  //     num: 6,
  //     color: "#0154C9",
  //     token: "",
  //   },
  //   {
  //     num: 7,
  //     color: "#3D07A5",
  //     token: "",
  //   },
  //   {
  //     num: 8,
  //     color: "#EB1B90",
  //     token: "",
  //   },
  //   {
  //     num: 9,
  //     color: "#01A501",
  //     token: "",
  //   },
  //   {
  //     num: 0,
  //     color: "#F98C07",
  //     token: "",
  //   },
  // ]);

  // const betButtonClick = function (index) {
  //   let newList = betNumList.map((e, i) => {
  //     if (index == i) {
  //       return {
  //         ...e,
  //         token: chipNum,
  //       };
  //     }
  //     return e;
  //   });
  //   setBetNumList(newList);
  // };

  return (
    <Box sx={{ flexGrow: 1,marginTop:"2rem",width: "40rem",fontFamily:"Poppins-Regular" }}>
      <Grid container spacing={2} sx={{ width: "40rem" }}>
        {betNumList.map((e, i) => (
          <Grid size={2.4} key={i + 1}>
            <Button
              disabled={isDisabled}
              component={Paper}
              elevation={0}
              sx={{
                bgcolor: e.color || "#042655",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                p: 1,
                borderRadius: "8.75px",
                fontFamily:"Poppins-Medium",
                WebkitTextStroke:"1px #000",
                width: "7.094rem",
                height:"7.997rem"
              }}
              onClick={() => {
                betButtonClick(i);
                chipSound.play();
              }}
              onContextMenu={(event) => {
                event.preventDefault(); // Prevents the default context menu
                // Add your right-click function here, for example:
                betremoveClick(i);
                chipSound.play();
              }}
            >
              <Typography
                sx={{
                  fontSize: "3rem",
                 
                  color: "white",
                  textAlign: "center",
                  fontFamily: "Poppins-Medium",
                  lineHeight: "1.2",
                }}
              >
                {e.num}
              </Typography>
              <Box
                sx={{
                  bgcolor: "white",
                  borderRadius: "8.75px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: 1,
                  width: "100%",
                  height: "38px",
                }}
              >
                {e.token && (
                  <>
                    <img
                      src={token}
                      alt=""
                      style={{ height: "21px", width: "21px" }}
                    />
                    <Typography
                      sx={{
                        // fontSize: "17.56px",
                        fontWeight: "700",
                        color: "#042655",
                        fontSize:"1.032rem",
                        fontFamily: "Hemlets-ExtraBold",
                  
                      }}
                    >
                      {e.token}
                    </Typography>
                  </>
                )}
              </Box>
            </Button>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default BetNumbers;

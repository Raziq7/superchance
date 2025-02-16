import { Box, IconButton, Paper, Typography } from "@mui/material";
import { InfoIcon } from "../../../assets/Icones";
import topBackground from "../../../public/svgs/h_bg.png";
import useLocalStorage from "../../../utils/useLocalStorage";
import { useCallback, useEffect, useState } from "react";
import { get_game_result } from "../../../api/gameData";
import moment from "moment";

const timeLapList = [
  {
    num: 1,
    color: "#B36A09",
    token: "",
  },

  {
    num: 2,
    color: "#EF0202",
    token: "",
  },
  {
    num: 3,
    color: "#F98C07",
    token: "",
  },
  {
    num: 4,
    color: "#EEDE01",
    token: "",
  },
  {
    num: 5,
    color: "#0D9E7D",
    token: "",
  },
  {
    num: 6,
    color: "#0154C9",
    token: "",
  },
  {
    num: 7,
    color: "#042655",
    token: "",
  },
  {
    num: 8,
    color: "#EB1B90",
    token: "",
  },
  {
    num: 9,
    color: "#01A501",
    token: "",
  },
  {
    num: 0,
    color: "#06A5C1",
    token: "",
  },
];

const getColorForNumber = (number) => {
  const colorMap = {
    1: "#B36A09",
    2: "#EF0202",
    3: "#F98C07",
    4: "#EEDE01",
    5: "#5550A7",
    6: "#0D9E7D",
    7: "#3D07A5",
    8: "#EB1B90",
    9: "#00A500",
    0: "#06A5C1",
  };
  return colorMap[number] || "#F98C07"; // Default color if number not found
};

function Historyinfo({ setinfoModal, betHistory }) {
  // const [historyList, sethistoryList] = useState([])
  // const [idLocl, setLocalid] = useLocalStorage("userDetails", {});

  // const calculateNextInterval = useCallback(() => {
  //   const time = 2; // Interval time in minutes
  //   const intervalMs = time * 60 * 1000;

  //   const now = moment();
  //   const midnight = moment().startOf("day");
  //   const elapsedTime = now.diff(midnight);
  //   const timeUntilNextInterval = intervalMs - (elapsedTime % intervalMs);

  //   return {
  //     timeUntilNextInterval,
  //   };
  // }, []);

  // const fetchGameResult = async () => {
  //   const response = await get_game_result(idLocl.id, 1, 10);
  //   sethistoryList(response.response.data);
  //   // console.log(response.response.data, "response data ((((((((((((");
  // };

  // useEffect(() => {
  //   const { timeUntilNextInterval } = calculateNextInterval();
  //   const setInterval = setTimeout(() => {
  //     fetchGameResult();
  //   }, timeUntilNextInterval);
  //   return () => clearTimeout(setInterval);
  // }, []);

  // useEffect(() => {
  //   fetchGameResult();
  // }, []);

  return (
    <Box
      sx={{
        // display: "flex",
        // justifyContent: "flex-end",
        // alignItems: "center",
        // backgroundImage:
        //   "linear-gradient(180deg, rgba(251,221,138,1) 0%, rgba(255,132,0,1) 49%, rgba(255,187,0,1) 100%)",
        // p: 1,
        zIndex: 1,
        position: "relative",
      }}
    >
      <img
        src={topBackground}
        alt=""
        style={{
          width: "100%",
          position: "absolute",
          top: "-10px",
        }}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          top: -3,
          gap: "10px",
          mr: 3,
          right: 20,
        }}
      >
        <Typography
          sx={{
            color: "#390206",
            fontSize: "32px",
            fontWeight: "600",
            fontFamily: "Poppins-SemiBold",
            textTransform: "uppercase",
            mr: 1,
          }}
        >
          HISTORY
        </Typography>
        <Box
          sx={{
            bgcolor: "#622402",
            p: "6px",
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            // justifyContent: "end",
            // gap: 1,
            // width: "660px",
            // height: "110px",
            position: "relative",
            top: "-2px",
            justifyContent: "flex-end",
            gap: 1,
            minWidth: "588px",
            height: "104px",
          }}
        >
          {betHistory.map((e, i) => (
            <Box
              key={i}
              sx={
                {
                  // display: "flex",
                  // flexDirection: "column",
                  // alignItems: "center",
                }
              }
            >
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: "500",
                  color: "white",
                  mb: "4px",
                }}
              >
                {/* {moment(e.dateTime, "HH:mm:ss.SSSSSS").format("hh:mm A")} */}
                {moment(e.dateTime).format("hh:mm A")}
              </Typography>
              <Paper
                elevation={0}
                sx={{
                  bgcolor: getColorForNumber(e.spinnerNumber) || "#F98C07",
                  borderRadius: "6px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  // // width: "100%",
                  width: "50px",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "2.5rem",
                    fontWeight: "600",
                    color: "white",
                    fontFamily: "Poppins-Regular",
                  }}
                >
                  {e.spinnerNumber}
                </Typography>
              </Paper>
            </Box>
          ))}
        </Box>
        <IconButton sx={{ width: "52px" }} onClick={() => setinfoModal(true)}>
          <InfoIcon sx={{ fontSize: "42px", width: "52px" }} />
        </IconButton>
      </Box>
    </Box>
  );
}

export default Historyinfo;

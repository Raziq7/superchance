import { Box, Button, IconButton, Paper, Typography } from "@mui/material";
import gsap from "gsap";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import bottom from "../../../public/backgrounds/bottom.png";
import treasury from "../../../public/svgs/GoldBox.svg";
import LoadingTexture from "../../../public/backgrounds/Loader Texture.png";
import Chip10 from "../../../public/icons/Y_chip.svg";
import Chip20 from "../../../public/icons/Chips_b.svg";
import Chip25 from "../../../public/icons/Chips_g.svg";
import Chip50 from "../../../public/icons/Chips_db.svg";
import Chip100 from "../../../public/icons/Chips_p.svg";
import Chip500 from "../../../public/icons/Chips_o.svg";
import BG_Bottom from "../../../public/icons/Bottom Panel1.svg";
import ButtonIcon from "../../../public/icons/Button.png";
import SmallButton from "../../../public/icons/SmallButton.png";
import playButton from "../../../public/svgs/PlayBtn.svg";
import winButton from "../../../public/svgs/WinBtn.svg";

import { GameButton } from "../../../components/Utils/StyledComponents";
// import { ipcRenderer } from "electron";

const chipList = [
  { num: 10, img: Chip10 },
  { num: 20, img: Chip20 },
  { num: 25, img: Chip25 },
  { num: 50, img: Chip50 },
  { num: 100, img: Chip100 },
  { num: 500, img: Chip500 },
];

function BottomPortion({
  handlePlay,
  chipNum,
  setChipNum,
  betFunction,
  chipSound,
  openAlertBox,
  remainingTime,
  isDisabled,
  isDisableFunBtn,
  betFunc,
  play,
  betNumList,
  duration,
  totalWin,
  // progressRef,
}) {
  // const [chipNum, setChipNum] = useState(null);
  // const progressRef = useRef(null);
  // const [time, setTime] = useState(moment().format("h:mm A"));
  // const initialTime = moment.duration(3, "minutes"); // 3 minutes
  // const [remainingTime, setRemainingTime] = useState(initialTime);
  // const [isCounting, setIsCounting] = useState(false);
  const progressRef = useRef(null);
  const TOTAL_DURATION = 120000; // 2 minutes in milliseconds
  const handleShrink = () => {
    // console.log(
    //   betNumList
    //     .filter((e) => e.token !== "")
    //     .map((e) => ({ num: e.num, token: e.token }))
    // );
    betFunc();
    // handlePrint();
    // if (!isCounting) {
    //   setIsCounting(true); // Start countdown
    // gsap.to(progressRef.current, {
    //   width: 0, // Shrink to 0 width
    //   duration: 180, // Total duration in seconds (180 seconds)
    //   ease: "linear", // Linear easing for consistent speed
    // });
    // }
  };

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setTime(moment().format("h:mm A"));
  //   }, 1000);

  //   return () => clearInterval(interval); // Cleanup on unmount
  // }, []);

  // useEffect(() => {
  //   if (remainingTime.asSeconds() > 0 && isCounting === true) {
  //     const timer = setInterval(() => {
  //       setRemainingTime((prevTime) =>
  //         moment.duration(prevTime.asSeconds() - 1, "seconds")
  //       );
  //     }, 1000);

  //     return () => clearInterval(timer); // Cleanup timer
  //   }
  // }, [remainingTime, isCounting]);

  const formatCountdown = (ms) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    return `${"0" + minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Add useEffect for progress bar animation
  useEffect(() => {
    if (remainingTime > 0 && progressRef.current) {
      // Kill any existing animations on the progress bar
      gsap.killTweensOf(progressRef.current);

      const percentageRemaining = (remainingTime / TOTAL_DURATION) * 100;

      // Reset to initial width
      gsap.set(progressRef.current, { width: `${percentageRemaining}%` });

      // Create new animation
      const animation = gsap.to(progressRef.current, {
        width: "0%",
        duration: remainingTime / 1000,
        ease: "linear",
      });

      // Cleanup function to kill animation when component unmounts or remainingTime changes
      return () => {
        animation.kill();
      };
    }
  }, [remainingTime]);

  return (
    <Box
      sx={{
        position: "relative",
        // mt: "-235px",
        height: "109px",
        fontFamily: "Poppins-Regular",
        
      }}
    >
      {/* <img
        src={bottom}
        alt=""
        style={{ width: "100%", position: "absolute", bottom: 0, left: 0 }}
      /> */}
      <BackgroundSVG />

      <img
        src={treasury}
        alt=""
        style={{
          position: "absolute",
          bottom: -50,
          left: 22,
          width: "599px",
          height: "342px",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          top: -260,
          right: 30,
          // zIndex: 5,
          display: "flex",
          flexDirection: "row",
          gap: "12px",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {chipList.map((e, i) => (
          <IconButton
            disabled={isDisabled}
            key={i + 1}
            sx={{
              position: "relative",
              width: "104.22px",
              fontFamily: "Poppins-Regular",
              height: "104.22px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => {
              setChipNum((prev) => prev !== e.num && e.num);
              chipSound.play();
            }}
          >
            <img
              src={e.img}
              alt=""
              style={{
                position: "relative",
                width: "104.22px",
                height: "104.22px",

                border: chipNum === e.num ? "3px solid #3BF435" : "none",
                borderRadius: "999px",
              }}
            />
            <Typography
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontSize: "19px",
                fontFamily: "Poppins-Black",
                color: "#042655",
              }}
            >
              {e.num}
            </Typography>
          </IconButton>
        ))}
      </Box>

      <Box sx={{ position: "absolute", bottom: 16, left: 120, zIndex: 5 }}>
        <Box sx={{ display: "flex", gap: 4, fontFamily: "Poppins-SemiBold" }}>
          <Box>
            {/* <Button sx={{ p: 0, mb: 1 }} onClick={() => handlePlay()}> */}
            <img src={playButton} alt="Play" />
            {/* </Button> */}
            <Typography
              sx={{
                width: "12.841rem",
                color: "white",
                py: 1,
                // backgroundImage:
                //   "linear-gradient(180deg, rgba(4,38,85,1) 0%, rgba(9,84,187,1) 100%)",
                backgroundColor: "#6D2802",
                border: "1px solid #FFEDBA",
                fontSize: "2.151rem",
                fontWeight: "600",
                textAlign: "center",
                borderRadius: "8.61px",
                fontFamily: "Poppins-Regular",
              }}
            >
              {play + ".00"}
            </Typography>
          </Box>
          <Box>
            {/* <Button
              sx={{ p: 0, mb: 1 }}
              onClick={() => setIsmessageModal(true)}
            > */}
            <img src={winButton} alt="Win" />
            {/* </Button> */}
            <Typography
              sx={{
                width: "12.841rem",
                color: "white",
                py: 1,
                // backgroundImage:
                //   "linear-gradient(180deg, rgba(4,38,85,1) 0%, rgba(9,84,187,1) 100%)",
                backgroundColor: "#6D2802",
                border: "1px solid #FFEDBA",
                fontSize: "2.151rem",
                fontWeight: "600",
                textAlign: "center",
                borderRadius: "8.61px",
              }}
            >
              {totalWin + ".00"}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          position: "absolute",
          bottom: 28,
          right: 20,
          display: "flex",
          alignItems: "flex-start",
          gap: 2,
        }}
      >
        <Box sx={{}}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
              mb: 3,
            }}
          >
            <GameButton
              disabled={isDisabled || isDisableFunBtn}
              variant="contained"
              sx={{
                width: "13.313rem",
                height: "3.25rem",
                fontFamily: "Poppins-Bold",
              }}
              onClick={() => betFunction("upperLine")}
            >
              UPPER LINE
            </GameButton>
            <GameButton
              disabled={isDisabled || isDisableFunBtn}
              variant="contained"
              sx={{
                width: "13.313rem",
                height: "3.25rem",
              }}
              onClick={() => betFunction("lowerLine")}
            >
              Lower LINE
            </GameButton>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
              mb: 3,
            }}
          >
            <GameButton
              disabled={isDisabled || isDisableFunBtn}
              variant="contained"
              sx={{
                width: "8.5rem",
                height: "3.25rem",
                fontSize: "1.5rem",
                fontFamily: "Poppins-Bold",
              }}
              onClick={() => betFunction("odd")}
            >
              ODDS
            </GameButton>
            <GameButton
              disabled={isDisabled || isDisableFunBtn}
              variant="contained"
              sx={{
                width: "8.5rem",
                height: "3.25rem",
                fontSize: "1.5rem",
                fontFamily: "Poppins-Bold",
              }}
              onClick={() => betFunction("even")}
            >
              EVENS
            </GameButton>
            <GameButton
              disabled={isDisabled || isDisableFunBtn}
              variant="contained"
              sx={{
                width: "8.5rem",
                height: "3.25rem",
                fontSize: "1.5rem",
                fontFamily: "Poppins-Bold",
              }}
              onClick={() => betFunction("double")}
            >
              DOUBLE
            </GameButton>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
            }}
          >
            <GameButton
              disabled={isDisabled || isDisableFunBtn}
              variant="contained"
              sx={{
                width: "8.5rem",
                height: "3.25rem",
                fontSize: "1.5rem",
                fontFamily: "Poppins-Bold",
              }}
              onClick={() => betFunction("repeat")}
            >
              REPEAT
            </GameButton>
            <GameButton
              disabled={isDisabled}
              variant="contained"
              sx={{
                width: "8.5rem",
                height: "3.25rem",
                fontSize: "1.5rem",
                fontFamily: "Poppins-Bold",
              }}
              onClick={() => betFunction("clear")}
            >
              CLEAR
            </GameButton>
            <GameButton
              disabled={isDisabled}
              variant="contained"
              sx={{
                width: "8.5rem",
                height: "3.25rem",
                fontSize: "1.5rem",
                fontFamily: "Poppins-Bold",
              }}
              onClick={handleShrink}
            >
              BET
            </GameButton>
          </Box>
        </Box>
        <Box>
          <Typography
            sx={{
              fontSize: "1.5rem",
              fontFamily: "Poppins-SemiBold",
              color: "black",

              textAlign: "center",
              mb: 1,
            }}
          >
            Next Draw : {duration}
            {/* Next Draw : {duration?.format("h:mm A")} */}
          </Typography>
          <Paper
            elevation={0}
            sx={{
              border: "4px solid black",
              // p: "16px",
              width: "15.438rem",
              height: "10.063rem",
              borderRadius: "16px",
              backgroundColor: "transparent",
              // backgroundImage:
              //   "linear-gradient(180deg, rgba(251,221,138,1) 0%, rgba(255,132,0,1) 49%, rgba(255,187,0,1) 100%)",
            }}
          >
            <Typography
              sx={{
                textAlign: "center",
                color: "white",
                fontSize: "3.25rem",

                // "-webkit-text-stroke": "2px #042655",

                bgcolor: "#C60042",
                borderRadius: "12px 12px 0px 0px",
              }}
            >
              <Typography
                sx={{
                  textAlign: "center",
                  color: "white",
                  fontSize: "3.25rem",
                  fontFamily: "Poppins-ExtraBold",
                  letterSpacing: "0.2rem",
                  filter: "drop-shadow(3px 3px 3px #000)",
                  // "-webkit-text-stroke": "2px #042655",
                }}
              >
                {formatCountdown(remainingTime)}
              </Typography>
            </Typography>
            <Box sx={{ p: "14px" }}>
              <Box
                sx={{
                  overflow: "hidden",
                  border: "2px solid #000",
                  height: "37px",
                  width: "100%",
                  borderRadius: "30px",
                  backgroundImage: `url('${LoadingTexture}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                {/* <img src={LoadingTexture} alt="" style={{ position: ""}} /> */}
                <Box
                  ref={progressRef}
                  sx={{
                    backgroundImage:
                      "linear-gradient(90deg, rgba(220,0,0,1) 0%, rgba(255,195,0,1) 48%, rgba(0,255,30,1) 100%)",
                    backgroundColor: "rgb(220,0,0)",
                    width: "100%",
                    height: "100%",
                    border: "1px solid #000",
                    transition: "width 0.3s ease-in-out",
                  }}
                />
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}

export default BottomPortion;

const BackgroundSVG = (props) => (
  // <svg

  //   viewBox="0 0 1440 327"
  //   fill="none"
  //   xmlns="http://www.w3.org/2000/svg"

  // >
  //   <path
  //     d="M-18.5 47.5V350L1450 338V3H712.5C681.7 3 669 39.36 634 72c-44.5 41.5-111.993 135-279 135C186.5 207 78.5 47.5-18.5 47.5z"
  //     fill="url(#paint0_linear_2216_122)"
  //     stroke="url(#paint1_linear_2216_122)"
  //     strokeWidth={5}
  //   />
  //   <defs>
  //     <linearGradient
  //       id="paint0_linear_2216_122"
  //       x1={688.503}
  //       y1={2.9999}
  //       x2={694.503}
  //       y2={398}
  //       gradientUnits="userSpaceOnUse"
  //     >
  //       <stop stopColor="#F1830A" />
  //       <stop offset={0.508697} stopColor="#BD2F00" />
  //       <stop offset={1} stopColor="#FFAC09" />
  //     </linearGradient>
  //     <linearGradient
  //       id="paint1_linear_2216_122"
  //       x1={298.5}
  //       y1={-70.9994}
  //       x2={640.999}
  //       y2={341.001}
  //       gradientUnits="userSpaceOnUse"
  //     >
  //       <stop stopColor="#FFCF82" />
  //       <stop offset={1} stopColor="#FF9D00" />
  //     </linearGradient>
  //   </defs>
  // </svg>



<svg style={{ position:"absolute",bottom: 0}} viewBox="0 0 1440 341" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M751 1H750.971L750.941 1.00173C748.038 1.17248 738.824 1.93439 728.696 7.75108C718.544 13.5815 707.549 24.4486 701.048 44.6943C683.586 99.0749 638.713 201.764 516.077 259.094C433.644 297.63 315.622 307.131 211.77 285.193C107.878 263.246 18.5522 209.935 -7.0409 123.217L-9 123.5V364V365H-8H1440H1441V364V2V1H1440H751Z" fill="url(#paint0_linear_2362_976)" stroke="#6F2B02" stroke-width="2"/>
<defs>
<linearGradient id="paint0_linear_2362_976" x1="797.5" y1="-12" x2="797.5" y2="354" gradientUnits="userSpaceOnUse">
<stop stop-color="#F1830A"/>
<stop offset="0.765476" stop-color="#E14902"/>
<stop offset="1" stop-color="#FFAC09"/>
</linearGradient>
</defs>
</svg>
);

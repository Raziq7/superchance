// import React from 'react'
import anime from "animejs/lib/anime.es.js";
import gsap from "gsap";
import Header from "../../components/Header";
import { useEffect, useRef, useState, useCallback, useMemo, memo } from "react";
import { Box, Typography } from "@mui/material";
import Historyinfo from "./components/Historyinfo";
import BetNumbers from "./components/BetNumbers";
import BottomPortion from "./components/BottomPortion";
import InfoModal from "./components/InfoModal";
import Spinner4 from "../../components/Spinner/Spinner4";
import { useGSAP } from "@gsap/react";
import { Howl } from "howler";
import ChipSound from "../../public/GAME SOUNDS/Chip Sound.mp3";
import SpinnerSound from "../../public/GAME SOUNDS/Spinning Wheel.mp3";
import NoMoreBetsPlease from "../../public/GAME SOUNDS/No more bets please.mp3";
import YouWinSound from "../../public/GAME SOUNDS/Victory.mp3";
import LastChance from "../../public/GAME SOUNDS/Last chance.mp3";
import PlaceYourBets from "../../public/GAME SOUNDS/Place your bets.mp3";
import MessageModal from "../../components/CustomComponent/MessageModal";
import {
  create_game,
  get_gameUser,
  get_game_result,
  predict_winner,
} from "../../api/gameData";
import moment from "moment";
import useLocalStorage from "../../utils/useLocalStorage";
import StarPattern from "../../public/svgs/StarPattern.svg";
import useSpinningGame from "../../hooks/useSpinningGame";
import YouWin from "./components/YouWin";
import midShefN from "../../public/midShfl/N.png";
import midShef2 from "../../public/midShfl/2X.png";
import midShef3 from "../../public/midShfl/3X.png";
import midShef4 from "../../public/midShfl/4X.png";
import midShef5 from "../../public/midShfl/5X.png";
import midShef6 from "../../public/midShfl/6X.png";
import midShef7 from "../../public/midShfl/7X.png";
import StarsBg from "../../public/backgrounds/StarsBg.png";

// Setup sound effects
const chipSound = new Howl({ src: [ChipSound] });
const spinnerSound = new Howl({ src: [SpinnerSound] });
const noMoreBetsPlease = new Howl({ src: [NoMoreBetsPlease] });
const youWinSound = new Howl({ src: [YouWinSound] });
const lastChanceSound = new Howl({ src: [LastChance] });
const placeYourBetsSound = new Howl({ src: [PlaceYourBets] });

// Memoize child components
const MemoizedBetNumbers = memo(BetNumbers);
const MemoizedHistoryinfo = memo(Historyinfo);
const MemoizedBottomPortion = memo(BottomPortion);

function HomeOpt() {
  // Initialize state with useMemo for complex initial values
  const [betNumList, setBetNumList] = useState(
    useMemo(
      () => [
        { num: 1, color: "#B36A09", token: "" },
        { num: 2, color: "#EF0202", token: "" },
        { num: 3, color: "#F98C07", token: "" },
        { num: 4, color: "#EEDE01", token: "" },
        { num: 5, color: "#5550A7", token: "" },
        { num: 6, color: "#0D9E7D", token: "" },
        { num: 7, color: "#3D07A5", token: "" },
        { num: 8, color: "#EB1B90", token: "" },
        { num: 9, color: "#00A500", token: "" },
        { num: 0, color: "#06A5C1", token: "" },
      ],
      []
    )
  );

  // Initialize refs with proper typing
  const wheelRef1 = useRef(null);
  const wheelRef2 = useRef(null);
  const currentRef = useRef(null);
  const innerWheelLight = useRef(null);
  const redLight = useRef(null);
  const orangeLight = useRef(null);
  const greenLight = useRef(null);
  const spinnerWeel = useRef(null);
  const spinnerRef = useRef(null);
  const boxRef = useRef(null);
  const midImageRef = useRef(null);
  const shuffleInterval = useRef(null);
  const isSpinning = useRef(false);
  const animationFrameId = useRef(null);

  // Initialize state with proper defaults
  const [userData, setUserData] = useState({
    id: "",
    fullName: "",
    userName: "",
    deviceId: "",
    balance: 0,
  });
  const [chipNum, setChipNum] = useState(null);
  const [play, setPlay] = useState(0);
  const [constBalance, setConstBalance] = useState(0);
  const [isShowBet, setisShowBet] = useState(false);
  const [isShowShfl, setIsShowShfl] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [infoModal, setinfoModal] = useState(false);
  const [balance, setBalance] = useState(1000);
  const [winAmount, setWinAmount] = useState(0);
  const [betHistory, setBetHistory] = useState([]);
  const [currentMultiplier, setCurrentMultiplier] = useState(midShefN);
  const [isOpen, setIsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [open, setOpen] = useState(false);

  // Get localStorage values
  const [gameID, setGameID] = useLocalStorage("gameID", "");
  const [local, setLocal] = useLocalStorage("name", {});
  const isAutoClaim = localStorage.getItem("isAutoClaim");

  // Memoize values that don't change
  const multiplierImages = useMemo(
    () => [
      midShefN,
      midShef2,
      midShef3,
      midShef4,
      midShef5,
      midShef6,
      midShef7,
    ],
    []
  );

  // Basic handlers
  const openAlertBox = useCallback((message, section, status) => {
    setAnchorEl(boxRef.current);
    setAlertMessage(message);
    setOpen(section !== "autoClaim");
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
    setAlertMessage("");
  }, []);

  // API handlers
  const fetchBalance = useCallback(async () => {
    try {
      const response = await get_gameUser();
      if (response?.status === 200) {
        const { balance, ...userData } = response.data;
        setConstBalance(balance);
        setBalance(balance);
        setUserData(response.data);
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  }, []);

  const fetchGameResult = useCallback(async () => {
    try {
      const response = await get_game_result();
      if (response?.status === 200) {
        setBetHistory(response.data);
      }
    } catch (error) {
      console.error("Error fetching game result:", error);
    }
  }, []);

  const fetchPredictWinner = useCallback(async () => {
    try {
      const response = await predict_winner();
      if (response?.status === 200) {
        localStorage.setItem(
          "winPoint",
          JSON.stringify(response.data.winningSlot)
        );
        localStorage.setItem(
          "winAmount",
          JSON.stringify(response.data.winningAmount)
        );
        localStorage.setItem("hasWon", JSON.stringify(response.data.haswon));
      } else if (response?.response?.status === 404) {
        localStorage.setItem(
          "winPoint",
          JSON.stringify(response.response.data.winningSlot)
        );
      }
    } catch (error) {
      console.error("Error predicting winner:", error);
    }
  }, []);

  // Betting handlers
  const betButtonClick = useCallback(
    (index) => {
      if (chipNum && typeof index === "number") {
        setBetNumList((prev) => {
          const newList = prev.map((e, i) => {
            if (i === index) {
              const newToken = chipNum + (parseInt(e.token, 10) || 0);
              return {
                ...e,
                token: String(newToken),
              };
            }
            return e;
          });

          const totalTokens = newList.reduce((sum, item) => {
            const tokenValue = parseInt(item.token, 10) || 0;
            return sum + tokenValue;
          }, 0);

          setBalance(balance - chipNum);
          setPlay(totalTokens);

          return newList;
        });
        chipSound.play();
      }
    },
    [chipNum, balance]
  );

  const betremoveClick = useCallback((index) => {
    setBetNumList((prev) => {
      const newList = prev.map((e, i) => {
        if (i === index) {
          const currentToken = parseInt(e.token, 10) || 0;
          if (currentToken > 0) {
            setBalance((b) => b + currentToken);
          }
          return {
            ...e,
            token: "",
          };
        }
        return e;
      });

      const totalTokens = newList.reduce((sum, item) => {
        const tokenValue = parseInt(item.token, 10) || 0;
        return sum + tokenValue;
      }, 0);

      setPlay(totalTokens);
      return newList;
    });
    chipSound.play();
  }, []);

  const betFunction = useCallback(
    (betCase) => {
      let newList;
      switch (betCase) {
        case "upperLine":
          newList = betNumList.map((e, i) => ({
            ...e,
            token: i < 5 ? chipNum : e.token,
          }));
          break;
        case "lowerLine":
          newList = betNumList.map((e, i) => ({
            ...e,
            token: i > 4 ? chipNum : e.token,
          }));
          break;
        case "odd":
          newList = betNumList.map((e, i) => ({
            ...e,
            token: i % 2 === 0 ? chipNum : e.token,
          }));
          break;
        case "even":
          newList = betNumList.map((e, i) => ({
            ...e,
            token: i % 2 === 1 ? chipNum : e.token,
          }));
          break;
        case "double":
          newList = betNumList.map((e) => ({
            ...e,
            token: e.token ? String(Number(e.token) * 2) : "",
          }));
          break;
        case "repeat":
          newList = local;
          break;
        case "clear":
          newList = betNumList.map((e) => ({
            ...e,
            token: "",
          }));
          break;
        default:
          return;
      }

      const totalTokens = newList.reduce((sum, item) => {
        const tokenValue = parseInt(item.token, 10) || 0;
        return sum + tokenValue;
      }, 0);

      betCase === "clear"
        ? setBalance(play + balance)
        : setBalance(constBalance - totalTokens);

      setPlay(totalTokens);
      setBetNumList(newList);
    },
    [betNumList, chipNum, local, play, balance, constBalance]
  );

  // Game logic handlers
  const handleYouWin = useCallback(() => {
    setIsOpen(true);
    youWinSound.play();
    const timer = setTimeout(() => {
      setIsOpen(false);
      fetchBalance();
    }, 3000);
    return () => clearTimeout(timer);
  }, [fetchBalance]);

  const generateGameID = useCallback(() => {
    const timestamp = Date.now();
    const lastSixTimestamp = timestamp.toString().slice(-6);
    const random = Math.floor(Math.random() * 100000)
      .toString()
      .padStart(5, "0");
    const uniqueNumber = lastSixTimestamp.slice(-1) + random;
    return parseInt(uniqueNumber);
  }, []);

  const startImageShuffle = useCallback(() => {
    if (!isSpinning.current) {
      isSpinning.current = true;
      let counter = 0;

      if (shuffleInterval.current) {
        clearInterval(shuffleInterval.current);
      }

      shuffleInterval.current = setInterval(() => {
        if (!isSpinning.current) return;
        counter = (counter + 1) % multiplierImages.length;
        setCurrentMultiplier(multiplierImages[counter]);
      }, 100);
    }
  }, [multiplierImages]);

  const stopImageShuffle = useCallback(() => {
    isSpinning.current = false;
    if (shuffleInterval.current) {
      clearInterval(shuffleInterval.current);
      const timer = setTimeout(() => {
        if (!isSpinning.current) {
          setCurrentMultiplier(midShefN);
          setisShowBet(true);
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, []);


  const spinner = useCallback(
    (targetNumber) => {
      startImageShuffle();

      const sections = 10;
      const sectionAngle = 360 / sections;
      const angleOffset = sectionAngle / 2;
      const initialRotation = -72;

      const currentRotation =
        gsap.getProperty(wheelRef1.current, "rotation") || 0;
      const targetRotation =
        360 - (targetNumber * sectionAngle + angleOffset) - initialRotation;
      const randomExtraRotation = 360 * gsap.utils.random(5, 10, 1);
      const rotationNext =
        currentRotation +
        randomExtraRotation +
        ((targetRotation - currentRotation) % 360);

      const luckywheelTimeline = gsap.timeline({
        onStart: () => {
          spinnerSound.play();
          isSpinning.current = true;
        },
        onComplete: () => {
          stopImageShuffle();
          fetchGameResult();

          if (JSON.parse(localStorage.getItem("hasWon"))) {
            handleYouWin();
            setWinAmount(localStorage.getItem("winAmount"));
            localStorage.removeItem("winAmount");
            localStorage.removeItem("hasWon");
          }

          const updatePaths = () => {
            const paths =
              spinnerRef.current?.getElementsByTagName("path") || [];
            const paths2 =
              wheelRef2.current?.getElementsByTagName("path") || [];

            const allPaths = [...paths, ...paths2];
            allPaths.forEach((path) => {
              path.style.filter = "brightness(0.5)";
            });

            const winningPath = Array.from(paths).find(
              (path) => path.getAttribute("index") === targetNumber.toString()
            );

            const winningPaths2 = Array.from(paths2).filter(
              (path) => path.getAttribute("index") === targetNumber.toString()
            );

            if (winningPath) {
              winningPath.style.filter = "brightness(1)";
            }

            winningPaths2.forEach((path) => {
              path.style.filter = "brightness(1)";
            });

            const resetTimer = setTimeout(() => {
              animationFrameId.current = requestAnimationFrame(() => {
                allPaths.forEach((path) => {
                  path.style.filter = "brightness(1)";
                });
              });
            }, 5000);

            return () => {
              clearTimeout(resetTimer);
              if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
              }
            };
          };

          animationFrameId.current = requestAnimationFrame(updatePaths);

          const greenLightEl = greenLight.current;
          if (greenLightEl) {
            anime({
              targets: greenLightEl.getElementsByClassName("l1"),
              fillOpacity: [0, 1],
              opacity: [0, 1],
              duration: 4000,
              delay: 5000,
              easing: "easeInOutQuad",
            });
          }

          const tl = anime.timeline({
            direction: "alternate",
            duration: 300,
            loop: 6,
            easing: "linear",
          });

          tl.add({
            targets: [
              greenLightEl?.querySelectorAll("g"),
              greenLightEl?.getElementsByClassName("l1"),
            ],
            opacity: [0, 0],
            fillOpacity: [0, 0],
            duration: 0,
          })
            .add({
              targets: [
                redLight.current?.querySelectorAll("g"),
                redLight.current?.getElementsByClassName("l1"),
              ],
              opacity: [0, 1],
              fillOpacity: [0, 1],
              easing: "easeInOutQuad",
            })
            .add({
              targets: [
                orangeLight.current?.querySelectorAll("g"),
                orangeLight.current?.getElementsByClassName("l1"),
              ],
              opacity: [0, 1],
              fillOpacity: [0, 1],
              easing: "easeInOutQuad",
            })
            .add({
              targets: [
                greenLightEl?.querySelectorAll("g"),
                greenLightEl?.getElementsByClassName("l1"),
              ],
              opacity: [0, 1],
              fillOpacity: [0, 1],
              easing: "easeInOutQuad",
            });
        },
      });

      luckywheelTimeline.to(wheelRef1.current, {
        duration: 9,
        rotation: rotationNext,
        transformOrigin: "50% 50%",
        ease: "power2.out",
        force3D: true,
        backfaceVisibility: "hidden",
      });

      if (wheelRef2.current) {
        luckywheelTimeline.to(
          wheelRef2.current,
          {
            duration: 9,
            rotation: rotationNext,
            transformOrigin: "50% 50%",
            ease: "power2.out",
            force3D: true,
            backfaceVisibility: "hidden",
          },
          "<"
        );
      }
    },
    [startImageShuffle, stopImageShuffle, fetchGameResult, handleYouWin]
  );

  const { countdown, nextIntervalTime } = useSpinningGame(
    useCallback(() => {
      setIsDisabled(true);
      noMoreBetsPlease.play();
      openAlertBox(`NO MORE BETS PLEASE`, "", "");
    }, [openAlertBox]),
    useCallback(async () => {
      try {
        const response = await predict_winner();
        if (response?.status === 200) {
          spinner(response.data.spinnerNumber);
        }
      } catch (error) {
        console.error("Error predicting winner:", error);
      }
    }, [spinner])
  );

  const betFunc = useCallback(() => {
    betFunction("clear");
    setPlay(0);

    const betData = betNumList
      .filter((e) => e.token !== "")
      .map((e) => ({ bet: e.num, played: e.token }));

    const chunkArray = (array, size) => {
      const chunks = [];
      for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
      }
      return chunks;
    };

    const pairedItems = chunkArray(
      betNumList.filter((e) => e.token !== "" && e.token !== null),
      2
    );

    const currentGameID = gameID || generateGameID().toString();
    if (!gameID) {
      setGameID(currentGameID);
    }

    const payload = {
      date: moment().format("YYYY-MM-DD"),
      draw_time: moment(nextIntervalTime, "h:mm A").format("HH:mm:ss"),
      ticket_time: moment().format("HH:mm:ss"),
      data: betData,
      startPoint: balance,
      endPoint: balance - play,
      isAutoClaim,
    };

    create_game(payload)
      .then((e) => {
        if (e?.status === 201) {
          openAlertBox(
            `YOUR BET HAS BEEN ACCEPTED WITH ID: ${e.data.bet.ticket_id}`,
            "",
            ""
          );
          fetchBalance();
          setLocal([...betNumList]);

          const isPrinterEnabled = JSON.parse(
            localStorage.getItem("isPrinterEnabled")
          );
          if (isPrinterEnabled) {
            const billHTML = /*html*/ `
            <div class="bill">
              <p style="margin-bottom: 4px;">***Super Chance***</p>
              <p style="margin-bottom: 4px;">From Amusement Only</p>
              <p style="margin-bottom: 4px;">Agent: 634</p>
              <p style="margin-bottom: 4px;">Game ID: ${e.data.bet.game_id}</p>
              <p style="margin-bottom: 4px;">Game Name: Single Chance</p>
              <p style="margin-bottom: 4px;">Draw Time: ${nextIntervalTime}</p>
              <p style="margin-bottom: 4px;">Ticket Time: ${moment().format(
                "DD-MM-YYYY h:mm A"
              )}</p>
              <p style="margin-bottom: 4px;">Total Point: ${play}</p>
              <div style="display: flex; align-items: flex-start; gap: 14px;">
                <table>
                  <tr>
                    <th style="padding-right: 14px;">Item</th>
                    <th style="padding-right: 14px;">Point</th>
                    <th style="padding-right: 14px;">Item</th>
                    <th>Point</th>
                  </tr>
                  ${pairedItems
                    .map(
                      (pair) => `
                    <tr>
                      <td>${pair[0]?.num ?? ""}</td>
                      <td>${pair[0]?.token || ""}</td>
                      <td>${pair[1]?.num ?? ""}</td>
                      <td>${pair[1]?.token || ""}</td>
                    </tr>
                  `
                    )
                    .join("")}
                </table>
              </div>
            </div>
          `;
            window.electronAPI.printBill(billHTML, e.data.bet.ticket_id);
          }
        }
      })
      .catch((error) => {
        console.error("Error creating game:", error);
        openAlertBox("Failed to create game. Please try again.", "", "error");
      });
  }, [
    betFunction,
    betNumList,
    balance,
    play,
    gameID,
    nextIntervalTime,
    isAutoClaim,
    generateGameID,
    setGameID,
    setLocal,
    openAlertBox,
    fetchBalance,
  ]);

  const handlePlay = useCallback(
    async (storedWinPoint) => {
      try {
        await fetchPredictWinner();
        const winPoint =
          storedWinPoint || JSON.parse(localStorage.getItem("winPoint"));
        if (winPoint !== null) {
          spinner(winPoint);
        }
      } catch (error) {
        console.error("Error in handlePlay:", error);
      }
    },
    [spinner, fetchPredictWinner]
  );


  // Initialize game with cleanup
  useEffect(() => {
    fetchBalance();
    fetchGameResult();
  }, [fetchBalance, fetchGameResult]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (shuffleInterval.current) {
        clearInterval(shuffleInterval.current);
      }
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  // Initialize GSAP timeline
  useGSAP(() => {
    let targetNum = betHistory[0]?.spinnerNumber ?? 1;
    const sections = 10;
    const sectionAngle = 360 / sections;
    const angleOffset = sectionAngle / 2;
    const initialRotation = -72;

    const targetRotation =
      360 - (targetNum * sectionAngle + angleOffset) - initialRotation;

    gsap.set(wheelRef1.current, {
      rotation: targetRotation,
      transformOrigin: "50% 50%",
      force3D: true,
      backfaceVisibility: "hidden",
    });
    gsap.set(wheelRef2.current, {
      rotation: targetRotation,
      transformOrigin: "50% 50%",
      force3D: true,
      backfaceVisibility: "hidden",
    });
  }, [betHistory]);

  // Inner Ring animation
  useEffect(() => {
    const tl = anime.timeline({
      easing: "easeOutExpo",
    });

    const spots = innerWheelLight.current?.querySelectorAll("g") || [];

    spots.forEach((spot, i) => {
      if (i % 2 === 0) {
        anime({
          targets: spot,
          fillOpacity: [1, 0, 1],
          duration: 500,
          easing: "linear",
          direction: "alternate",
          loop: true,
        });
      } else {
        anime({
          targets: spot,
          fillOpacity: [1, 0, 1],
          duration: 500,
          delay: 500,
          easing: "linear",
          direction: "alternate",
          loop: true,
        });
      }
    });

    return () => {
      spots.forEach((spot) => {
        anime.remove(spot);
      });
    };
  }, []);

  // Render component
  return (
    <Box
      sx={{
        backgroundImage: `url(${StarsBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        width: "100%",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.3)",
          zIndex: 0,
        },
      }}
    >
      <Header
        balance={balance}
        openAlertBox={openAlertBox}
        userData={userData}
      />
      <Box
        ref={boxRef}
        sx={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          padding: 2,
        }}
      >
        <MemoizedHistoryinfo
          betHistory={betHistory}
          setinfoModal={isDisabled ? () => {} : setinfoModal}
        />
        <MemoizedBetNumbers
          betNumList={betNumList}
          betButtonClick={betButtonClick}
          betremoveClick={betremoveClick}
          chipSound={chipSound}
          isDisabled={isDisabled}
        />
        <MemoizedBottomPortion
          balance={balance}
          chipNum={chipNum}
          setChipNum={setChipNum}
          handlePlay={handlePlay}
          betFunction={betFunc}
          chipSound={chipSound}
          openAlertBox={openAlertBox}
          remainingTime={countdown}
          isDisabled={isDisabled}
          betFunc={betFunc}
          play={play}
          betNumList={betNumList}
          duration={nextIntervalTime}
          totalWin={winAmount}
        />
      </Box>

      <MessageModal
        id="alert-modal"
        open={open}
        anchorEl={anchorEl}
        alertMessage={alertMessage}
        handleClose={handleClose}
      />

      <InfoModal
        open={infoModal}
        setinfoModal={setinfoModal}
        fetchBalance={fetchBalance}
      />

      <YouWin winAmount={winAmount} isOpen={isOpen} setIsOpen={setIsOpen} />

      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Spinner4
          wheelRef1={wheelRef1}
          wheelRef2={wheelRef2}
          currentRef={currentRef}
          innerWheelLight={innerWheelLight}
          greenLight={greenLight}
          redLight={redLight}
          orangeLight={orangeLight}
          spinnerWeel={spinnerWeel}
          spinnerRef={spinnerRef}
        />
      </Box>
    </Box>
  );
}

export default memo(HomeOpt);

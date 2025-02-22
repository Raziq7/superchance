// import React from 'react'
import anime from "animejs/lib/anime.es.js";
import gsap from "gsap";
import Header from "../../components/Header";
import Spinner from "../../components/Spinner/Spinner";
import { useEffect, useRef, useState, useCallback } from "react";
import { Box, Button, Popover, Typography } from "@mui/material";
import Historyinfo from "./components/Historyinfo";
import BetNumbers from "./components/BetNumbers";
import BottomPortion from "./components/BottomPortion";
// import StyledModal from "../../components/CustomComponent/StyledModal";
import InfoModal from "./components/InfoModal";
import Spinner2 from "../../components/Spinner/Spinner2";
import Spinner3 from "../../components/Spinner/Spinner3";
import Spinner4 from "../../components/Spinner/Spinner4";

import { useGSAP } from "@gsap/react";
import { Howl, Howler } from "howler";
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
  updateSpinner,
} from "../../api/gameData";
import moment from "moment";
import useLocalStorage from "../../utils/useLocalStorage";
import StarPattern from "../../public/svgs/StarPattern.svg";
import useSpinningGame from "../../hooks/useSpinningGame";
import YouWin from "./components/YouWin";
import { Back } from "gsap";
import midShefN from "../../public/midShfl/N.png";
import midShef2 from "../../public/midShfl/2X.png";
import midShef3 from "../../public/midShfl/3X.png";
import midShef4 from "../../public/midShfl/4X.png";
import midShef5 from "../../public/midShfl/5X.png";
import midShef6 from "../../public/midShfl/6X.png";
import midShef7 from "../../public/midShfl/7X.png";
import StarsBg from "../../public/backgrounds/StarsBg.png";

// const crypto = window.crypto || window.msCrypto;

// Setup the new Howl.
const chipSound = new Howl({
  src: [ChipSound],
});

const spinnerSound = new Howl({
  src: [SpinnerSound],
});

const noMoreBetsPlease = new Howl({
  src: [NoMoreBetsPlease],
});

const youWinSound = new Howl({
  src: [YouWinSound],
});

const lastChanceSound = new Howl({
  src: [LastChance],
});

const placeYourBetsSound = new Howl({
  src: [PlaceYourBets],
});

//Mute the voice
// Howler.mute(true);

function Home() {
  const [betNumList, setBetNumList] = useState([
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
      color: "#5550A7",
      token: "",
    },
    {
      num: 6,
      color: "#0D9E7D",
      token: "",
    },
    {
      num: 7,
      color: "#3D07A5",
      token: "",
    },
    {
      num: 8,
      color: "#EB1B90",
      token: "",
    },
    {
      num: 9,
      color: "#00A500",
      token: "",
    },
    {
      num: 0,
      color: "#06A5C1",
      token: "",
    },
  ]);

  const [idLocl, setLocalid] = useLocalStorage("userDetails", {});
  // const [duration, setDuration] = useState(moment());
  const [chipNum, setChipNum] = useState(null);
  // const [ismessModal, setIsmessageModal] = useState(false);
  const [play, setPlay] = useState(0);

  const [isDisableBet, setIsDisableBet] = useState(false);

  const [isDisabled, setIsDisabled] = useState(false);
  const [infoModal, setinfoModal] = useState(false);
  const [balance, setBalance] = useState(1000);
  const [winAmount, setWinAmount] = useState(0);
  const [betHistory, setBetHistory] = useState([]);
  const [gameID, setGameID] = useLocalStorage("gameID", "");
  const [isOpen, setIsOpen] = useState(false);
  const [local, setLocal] = useLocalStorage("name", {});
  // const [winPoint, setWinnigPoint] = useLocalStorage("winPoint", null);
  // const [winPoint, setWinnigPoint] = useState(null);
  const [isPrinterEnabled, setIsPrinterEnabled] = useLocalStorage(
    "isPrinterEnabled",
    true
  );

  const [userData, setuserData] = useState({
    id: "",
    fullName: "",
    userName: "",
    deviceId: "",
    balance: 0,
  });

  const [isAutoClaim, setIsAutoClaim] = useState(false);

  const generateHistoryData = () => {
    const data = [];
    const baseTime = new Date();

    for (let i = 0; i < 10; i++) {
      // Generate random number between 1 and 5
      const randomNum = Math.floor(Math.random() * 5) + 1;

      // Subtract 2 minutes for each entry
      const entryTime = new Date(baseTime - i * 2 * 60000);
      const formattedTime = entryTime.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      data.push({
        num: randomNum,
        time: formattedTime,
      });
    }
    return data;
  };

  const [historyList, setHistoryList] = useLocalStorage(
    "historyList",
    generateHistoryData()
  );

  const wheelRef1 = useRef(null);
  const wheelRef2 = useRef(null);
  const currentRef = useRef(null);
  const innerWheelLight = useRef(null);
  const redLight = useRef(null);
  const orangeLight = useRef(null);
  const greenLight = useRef(null);
  const spinnerWeel = useRef(null)
  const spinnerRef = useRef(null);
  const midImageRef = useRef(null);

  const boxRef = useRef(null);
  const hasCountdownStarted = useRef(false); // Tracks if onCountdownStart has been called
  const hasCountdownEnded = useRef(false); // Tracks if onCountdownEnd has been called

  const [currentMultiplier, setCurrentMultiplier] = useState(midShefN);
  const shuffleInterval = useRef(null);
  const isSpinning = useRef(false);
  
  const multiplierImages = [midShefN, midShef2, midShef3, midShef4, midShef5, midShef6, midShef7];

  const startImageShuffle = () => {
    isSpinning.current = true;
    let counter = 0;
    // Clear any existing interval
    if (shuffleInterval.current || wheelRef2.current) {
      clearInterval(shuffleInterval.current);
    }
    
    // Start new shuffle interval
    shuffleInterval.current = setInterval(() => {
      if (!isSpinning.current) return; // Don't update if we're stopping
      counter = (counter + 1) % multiplierImages.length;
      setCurrentMultiplier(multiplierImages[counter]);
    }, 100);

  };
  
  const stopImageShuffle = () => {
    isSpinning.current = false;
    if (shuffleInterval.current) {
      clearInterval(shuffleInterval.current);
      // Ensure we reset to normal multiplier after a brief delay
      setTimeout(() => {
        if (!isSpinning.current) { // Double check we haven't started spinning again
          setCurrentMultiplier(midShefN);
        }
      }, 50);
    }
  };

  const spinner = (targetNumber) => {
    startImageShuffle(); // Start shuffling when spin begins
    const sections = 10; // Number of sections
    const sectionAngle = 360 / sections; // Angle for each section
    const angleOffset = sectionAngle / 2; // Offset to align with the center of the section
    const initialRotation = -72; // Initial offset to align with "1"

    // Get the current rotation of the spinner
    const currentRotation =
      gsap.getProperty(wheelRef1.current, "rotation") || 0;

    // Calculate the target rotation to land on the desired number
    const targetRotation =
      360 - (targetNumber * sectionAngle + angleOffset) - initialRotation;

    // Ensure the spinner always rotates clockwise by adding extra full spins
    const randomExtraRotation = 360 * gsap.utils.random(5, 10, 1); // 5-10 full spins
    const rotationNext =
      currentRotation +
      randomExtraRotation +
      ((targetRotation - currentRotation) % 360);

    // Spin the wheel to land on the target number
    const luckywheelTimeline = gsap.timeline({
      onStart: () => {
        isSpinning.current = true;
      },
      onComplete: () => {
        stopImageShuffle()
        fetchGameResult()
        // console.log(localStorage.getItem("winAmount"), "winner");
        
        if (localStorage.getItem("winAmount") > 0) {
          handleYouWin();
          setWinAmount(localStorage.getItem("winAmount"));
          localStorage.removeItem("winAmount");
        }

        console.log(`Spinner landed on number: ${targetNumber}`);
        
        // Reset all paths and highlight the winning one
        const paths = spinnerRef.current.getElementsByTagName('path');
        Array.from(paths).forEach(path => {
            path.style.filter = 'brightness(0.5)'; // Darken non-winning sections
        });
        
        const winningPath = Array.from(paths).find(path => 
            path.getAttribute('index') === targetNumber.toString()
        );
        
        if (winningPath) {
            winningPath.style.filter = 'brightness(1)'; // Keep winning section bright
            
            // Reset all filters after 5 seconds
            setTimeout(() => {
                Array.from(paths).forEach(path => {
                    path.style.filter = 'brightness(1)';
                });
            }, 5000);
        }

        // var tl = anime.timeline({ easing: "linear", duration: 300, loop: 3 });
        // tl.add({
        //   targets: [
        //     greenLight.current.querySelectorAll("g"),
        //     greenLight.current.querySelectorAll("circle"),
        //   ],
        //   opacity: 0,
        // })
        //   .add({
        //     targets: [
        //       greenLight.current.querySelectorAll("g"),
        //       greenLight.current.querySelectorAll("circle"),
        //     ],
        //     opacity: 1,
        //     fillOpacity: 1,
        //   })
        //   .add({
        //     targets: [
        //       orangeLight.current.querySelectorAll("g"),
        //       orangeLight.current.querySelectorAll("circle"),
        //     ],
        //     opacity: 0,
        //   })
        //   .add({
        //     targets: [
        //       orangeLight.current.querySelectorAll("g"),
        //       orangeLight.current.querySelectorAll("circle"),
        //     ],
        //     opacity: 1,
        //     fillOpacity: 1,
        //   })
        //   .add({
        //     targets: [
        //       redLight.current.querySelectorAll("g"),
        //       redLight.current.querySelectorAll("circle"),
        //     ],
        //     opacity: 0,
        //   })
        //   .add({
        //     targets: [
        //       redLight.current.querySelectorAll("g"),
        //       redLight.current.querySelectorAll("circle"),
        //     ],
        //     opacity: 1,
        //     fillOpacity: 1,
        //   });

        // anime({
        //   targets: [
        //     greenLight.current.querySelectorAll("g"),
        //     redLight.current.querySelectorAll("g"),
        //     redLight.current.querySelectorAll("circle"),
        //     ,
        //     orangeLight.current.querySelectorAll("g"),
        //     orangeLight.current.querySelectorAll("circle"),
        //   ],
        //   fillOpacity: 0,
        //   delay: 1500,
        // });

        var tl=anime.timeline({direction:'alternate',duration:600,loop:4})
        tl.add({targets:[greenLight.current.querySelectorAll('g') , greenLight.current.querySelectorAll('circle')] ,
     opacity:[0,1,0],fillOpacity:[0,1,0]
        }).add({targets: redLight.current.querySelectorAll('circle') ,
          opacity:[0,1,0],fillOpacity:[0,1,0]
            }).add({ targets:orangeLight.current.querySelectorAll('circle'),
              opacity:[0,1,0],fillOpacity:[0,1,0]
         })
      },
    });

    luckywheelTimeline.to(wheelRef1.current, {
      duration: 11.3,
      rotation: rotationNext,
      transformOrigin: "50% 50%",
      ease: "power1.inOut",
    });

    // Optional: Spin the second wheel, if necessary
    if (wheelRef2) {
      luckywheelTimeline.to(
        wheelRef2.current,
        {
          duration: 11.3,
          rotation: rotationNext,
          transformOrigin: "50% 50%",
          ease: "power1.inOut",
        },
        "<" // Start both animations simultaneously
      );
    }
  };

  useGSAP(() => {
    gsap.set(wheelRef1.current, { rotation: 18, transformOrigin: "50% 50%" });
    gsap.set(wheelRef2.current, { rotation: 18, transformOrigin: "50% 50%" });
  }, []);

  // Outer Ring animation

  // useEffect(() => {
  //   console.log(spinnerWeel, "Somer is (((((((((((((((((((((((((())))))))))))))))))))))))))");
  // }, []);

  // Inner Ring animation

  useEffect(() => {
    var tl = anime.timeline({
      easing: "easeOutExpo",
    });

    // Add children
    const spots = innerWheelLight.current.querySelectorAll(`g`);
    for (let i = 0; i <= spots.length; i++) {
      if (i % 2 == 0) {
        let tl = anime.timeline({
          easing: "linear",
          direction: "alternate",
          duration: 500,
          loop: true,
        });
        tl.add({
          targets: spots[i],
          fillOpacity: 1,
        })
          .add({
            targets: spots[i],
            fillOpacity: 0,
          })
          .add({
            targets: spots[i],
            fillOpacity: 1,
          });
      }
      for (let i = 0; i < spots.length; i++) {
        if (!(i % 2 == 0)) {
          let tl = anime.timeline({
            easing: "linear",
            direction: "alternate",
            duration: 500,
            delay: 500,
            loop: true,
          });
          tl.add({
            targets: spots[i],
            fillOpacity: 1,
          })

            .add({
              targets: spots[i],
              fillOpacity: 0,
            })
            .add({
              targets: spots[i],
              fillOpacity: 1,
            });
        }
      }
    }
  }, []);

  function generateGameID() {
    const timestamp = Date.now();
    const lastSixTimestamp = timestamp.toString().slice(-6);
    const random = Math.floor(Math.random() * 100000)
      .toString()
      .padStart(5, "0");

    // Combine last digit of timestamp with 5 random digits
    const uniqueNumber = lastSixTimestamp.slice(-1) + random;

    return parseInt(uniqueNumber);
  }

  function generateUniqueCode() {
    // Generate 4 random digits
    const randomDigits = Math.floor(1000 + Math.random() * 9000).toString();

    // Generate 3 random uppercase letters
    const randomLetters = "SCP";

    // Generate 4 random digits
    const randomDigits2 = Math.floor(1000 + Math.random() * 9000).toString();

    // Combine into the desired format
    return `${randomDigits}-${randomLetters}${randomDigits2}`;
  }

  const betFunc = function () {
    betFunction("clear");
    setPlay(0);

    let betData = betNumList
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

    // Use the existing gameID from localStorage if available, otherwise generate new one
    const currentGameID = gameID || generateGameID().toString();
    if (!gameID) {
      setGameID(currentGameID);
    }
    // alert(isAutoClaim);
    const payload = {
      // ticket_id: generateUniqueCode().toString(),
      // game_id: currentGameID, // Use the currentGameID here
      date: moment().format("YYYY-MM-DD"),
      draw_time: moment(nextIntervalTime, "h:mm A").format("HH:mm:ss"),
      ticket_time: moment().format("HH:mm:ss"),
      data: betData,
      startPoint: balance,
      endPoint: balance - play,
      isAutoClaim,
    };

    create_game(payload).then((e) => {
      console.log(e.data, "game bet api");

      if (e.status === 201) {
        console.log("Bet submitted successfully:", e.data.bet.ticket_id);
        openAlertBox(
          `YOUR BET HAS BEEN ACCEPTED WITH ID: ${e.data.bet.ticket_id}`,
          "",
          ""
        );
        fetchBalance();
        setLocal([...betNumList]);

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

          // console.log("bill html isher 💁👌🎍😍", e.data.bet.ticket_id);

          window.electronAPI.printBill(billHTML, e.data.bet.ticket_id);
        }
      }
    });
  };

  const betButtonClick = function (index) {
    if (chipNum) {
      let newList = betNumList.map((e, i) => {
        if (index == i) {
          return {
            ...e,
            token: chipNum + Number(e.token),
          };
        }
        return e;
      });
      const totalTokens = newList.reduce((sum, item) => {
        const tokenValue = parseInt(item.token, 10) || 0; // Convert to integer, fallback to 0 if blank
        return sum + tokenValue;
      }, 0);
      setBalance(balance - chipNum);
      setPlay(totalTokens);
      setBetNumList(newList);
    }
    
  };

  const betremoveClick = function (index) {
    let newList = betNumList.map((e, i) => {
      if (index == i) {
        // If there's a token on this number, add its value back to the balance
        const currentToken = parseInt(e.token, 10) || 0;
        if (currentToken > 0) {
          setBalance(balance + currentToken);
        }
        // Remove the token by returning the object without the token property
        return {
          ...e,
          token: "", // or null, depending on how you want to represent no token
        };
      }
      return e;
    });

    // Recalculate total tokens after removal
    const totalTokens = newList.reduce((sum, item) => {
      const tokenValue = parseInt(item.token, 10) || 0;
      return sum + tokenValue;
    }, 0);

    setPlay(totalTokens);
    setBetNumList(newList);
  };

  const betFunction = function (betCase) {
    let newList;
    switch (betCase) {
      case "upperLine":
        newList = betNumList.map((e, i) => {
          if (i < 5) {
            return {
              ...e,
              token: chipNum,
            };
          }
          return e;
        });
        break;
      case "lowerLine":
        newList = betNumList.map((e, i) => {
          if (i > 4) {
            return {
              ...e,
              token: chipNum,
            };
          }
          return e;
        });
        break;
      case "odd":
        newList = betNumList.map((e, i) => {
          if (i % 2 === 0) {
            return {
              ...e,
              token: chipNum,
            };
          }
          return e;
        });
        break;
      case "even":
        newList = betNumList.map((e, i) => {
          if (i % 2 === 1) {
            return {
              ...e,
              token: chipNum,
            };
          }
          return e;
        });
        break;
      case "double":
        newList = betNumList.map((e, i) => ({
          ...e,
          token: e.token ? e.token * 2 : "",
        }));

        break;
      case "repeat":
        console.log(newList, local);
        newList = local;
        break;
      case "clear":
        newList = betNumList.map((e) => ({
          ...e,
          token: "",
        }));
        break;
      default:
        break;
    }
    // console.log(newList);
    const totalTokens = newList.reduce((sum, item) => {
      const tokenValue = parseInt(item.token, 10) || 0; // Convert to integer, fallback to 0 if blank
      return sum + tokenValue;
    }, 0);
    betCase === "clear"
      ? setBalance(play + balance)
      : setBalance(balance - totalTokens);
    setPlay(totalTokens);
    setBetNumList(newList);
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");

  const openAlertBox = (message, section, status) => {
    setAnchorEl(boxRef.current);
    setAlertMessage(message);
    if (section === "autoClaim") {
      setIsAutoClaim(status);
    }
  };

  // const [remainingTime, setRemainingTime] = useState(
  //   moment.duration(0, "seconds")
  // );
  const [isCounting, setIsCounting] = useState(false);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const time = 2;
  // const intervalMs = time * 60 * 1000;

  const fetchBalance = async function () {
    await get_gameUser().then((e) => {
      if (e.status === 200) {
        console.log(e.data.balance);

        setBalance(e.data.balance);
        setuserData(e.data);
      }
      // console.log(e.response.balance);
    });
  };

  // console.log(gameID);

  const fetchPredictWinner = async function () {
    const response = await predict_winner();
    // console.log(
    //   response.response.status,
    //   response.response.data,
    //   "No gameID available, using default prediction"
    // );
    console.log(response);
    if (response.status === 200) {
      // const win = response.message.general[0];
      localStorage.setItem(
        "winPoint",
        JSON.stringify(response.data.winningSlot)
      );
      console.log(response.data.totalSystemPlayedAmount, "Win Amount is this");
      // setWinAmount(response.data.totalSystemPlayedAmount);
      if (response.data.hasWon) {
        localStorage.setItem("winAmount", JSON.stringify(response.data.totalSystemPlayedAmount));
      }

      // console.log(response.data.totalSystemPlayedAmount);
    } else if (response.response.status === 404) {
      localStorage.setItem(
        "winPoint",
        JSON.stringify(response.response.data.winningSlot)
      );
    }
    // return;
  };

  const fetchGameResult = async () => {
    const response = await get_game_result();
    if (response.status === 200) {
      setBetHistory(response.data);
    }
  };

  // Handle Spin Button
  const handlePlay = (storedWinPoint) => {
    // localStorage.getItem('winPoint');
    // let spinum = JSON.parse(localStorage.getItem("winPoint"));
    // let spinum = winPoint;
    // let spinPoint = JSON.parse(localStorage.getItem("winPoint"));
    console.log(storedWinPoint, "some is here");

    // const newHistory = [...historyList];
    // newHistory.pop(); // Remove the last item
    // setHistoryList([
    //   {
    //     num: spinPoint,
    //     time: moment().format("h:mm A"),
    //   },
    //   ...newHistory,
    // ]);
    // spinner(8); // Spin and land on "1"
    // setTicketID(generateUniqueCode().toString());
    // fetchPredictWinner(); // Predict the winner
    spinnerSound.play();
    spinner(storedWinPoint); // Spin and land on "1"
    // setTimeout(() => {
    //   // location.reload();
    // }, 150);
    // if (isOpen === true) {
    //   handleYouWin();
    // }
  };

  const handleYouWin = () => {
    setIsOpen(true);
    youWinSound.play();
    // setAlertMessage("message");
    fetchBalance();
  };

  const handleClose = () => {
    setAnchorEl(null);
    setAlertMessage("");
  };

  const onEvery15sec = useCallback(() => {
    // fetchPredictWinner();
    // setIsDisabled(false);
    setWinAmount(0);
    openAlertBox(`PLACE YOUR BET`, "", "");
    placeYourBetsSound.play();
    console.log("Triggered at 15sec!");
  }, []);

  const onEvery1m40s = useCallback(() => {
    // fetchPredictWinner();
    // setIsDisabled(true);
    openAlertBox(`LAST CHANCE`, "", "");
    lastChanceSound.play();
    console.log("Triggered at 1 minute 40 seconds!");
  }, []);

  // Move these callback definitions before any other state or refs
  const onEvery1m45s = useCallback(() => {
    const currentGameID = localStorage.getItem("gameID");
    console.log("1m45s - Current gameID:", currentGameID);

    fetchPredictWinner();
    setIsDisabled(true);
    noMoreBetsPlease.play();
    openAlertBox(`NO MORE BETS PLEASE`, "", "");
  }, []);

  const onEvery2min = useCallback(async() => {
    // alert("2min - Starting new game cycle");
    const storedWinPoint = JSON.parse(localStorage.getItem("winPoint"));

    setTimeout(async () => {
      await updateSpinner(storedWinPoint);
    }, 1000);

    // First handle the play animation
    handlePlay(storedWinPoint);
    // fetchGameResult();
    // fetchPredictWinner();

    // Clear game state
    setIsDisabled(false);
    setGameID(""); // Clear React state
    localStorage.removeItem("gameID"); // Clear localStorage
    // setWinnigPoint(null);
    // localStorage.removeItem('winPoint');

    // Generate new gameID for next round
    // const newGameID = generateGameID().toString();
    // setTimeout(() => {
    //   setGameID(newGameID);
    //   localStorage.setItem('gameID', newGameID);
    //   console.log('New gameID set:', newGameID);
    // }, 2000); // Wait for 2 seconds before setting new gameID
  }, []);

  const { countdown, nextIntervalTime } = useSpinningGame(
    onEvery1m45s,
    onEvery2min,
    onEvery15sec,
    onEvery1m40s
  );

  useEffect(() => {
    if (anchorEl) {
      const timer = setTimeout(() => {
        handleClose();
      }, 3000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [anchorEl]);

  useEffect(() => {
    console.log("Disabled state changed:", isDisabled);
  }, [isDisabled]);

  useEffect(() => {
    console.log(
      "Balance effect - Balance:",
      balance,
      "IsCounting:",
      isCounting
    );
    if (balance <= 0) {
      setIsDisabled(true);
    } else if (!isCounting) {
      setIsDisabled(false);
    }
  }, [balance, isCounting]);

  useEffect(() => {
    fetchBalance();
    fetchGameResult();
    // setGameID(generateRandomInt(100000, 999999).toString());
  }, [local]);

  return (
    <>
    {/*  */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          width: "100vw",
          minHeight: "900px",
          // background: "rgb(171,44,4)",
          background:
            "linear-gradient(90deg, rgba(201,88,1,1) 33%, rgba(181,51,4,1) 58%, rgba(171,44,4,1) 70%, rgba(116,14,3,1) 100%)",
        }}
      >
        <Header
          balance={balance}
          openAlertBox={openAlertBox}
          userData={userData}
        />

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "838px",
            width: "100vw",
            position: "relative",
          }}
        >
          <Historyinfo betHistory={betHistory} setinfoModal={setinfoModal} />
          <img
            src={StarPattern}
            alt="StarPattern"
            style={{
              position: "absolute",
              top: "14%",
              "mix-blend-mode": "screen",
            }}
          />

          <img src={StarsBg} alt="" style={{ position: "absolute", top: "3%", left: "30%", }} />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              // pl: 2,
              pt: 9,
              position: "relative",
              height: "729px",
              zIndex: 0,
            }}
          >
            <Box
              aria-describedby={id}
              sx={{
                position: "absolute",
                left: -20,
                top: 45,
                width: "680px",
              }}
              ref={boxRef}
            >
              {/* <h1 >7x</h1> */}
              {/* <Spinner2
              wheelRef1={wheelRef1}
              wheelRef2={wheelRef2}
              currentRef={currentRef}
            /> */}
              {/* <Spinner3
              wheelRef1={wheelRef1}
              wheelRef2={wheelRef2}
              currentRef={currentRef}
            /> */}
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
                <img 
                  ref={midImageRef} 
                  src={currentMultiplier} 
                  alt="" 
                  style={{ 
                    position: "absolute", 
                    top: "55%", 
                    left: "53%", 
                    transform: "translate(-50%, -50%)", 
                    zIndex: 100,
                    transition: "opacity 0.1s ease-in-out" 
                  }} 
                />
              {/* <Spinner5

              wheelRef1={wheelRef1}
              wheelRef2={wheelRef2}
              currentRef={currentRef}
              innerWheelLight={innerWheelLight}
            /> */}
              <YouWin
                winAmount={winAmount}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
              />
            </Box>
            <Box sx={{ position: "absolute", right: "1.5rem", top: "6.5rem" }}>
              <BetNumbers
                isDisabled={isDisabled}
                betNumList={betNumList}
                betButtonClick={betButtonClick}
                betremoveClick={betremoveClick}
                chipSound={chipSound}
              />
            </Box>
          </Box>

          <BottomPortion
            balance={balance}
            chipNum={chipNum}
            handlePlay={handlePlay}
            setChipNum={setChipNum}
            betFunction={betFunction}
            chipSound={chipSound}
            openAlertBox={openAlertBox}
            remainingTime={countdown}
            isDisabled={isDisabled}
            betFunc={betFunc}
            play={play}
            betNumList={betNumList}
            duration={nextIntervalTime}
            // progressRef={progressRef}
            totalWin={winAmount}
          />
        </Box>
      </Box>

      <MessageModal
        id={id}
        open={open}
        anchorEl={anchorEl}
        alertMessage={alertMessage}
        handleClose={() => handleClose()}
      />
      <InfoModal open={infoModal} handleClose={() => setinfoModal(false)} fetchBalance={fetchBalance} />
    </>
  );
}

export default Home;

// Issues
// Double and Repete
// Print is not working
// History issue API not working properly

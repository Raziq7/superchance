// import React from 'react'

import { useRef } from "react";
import Spinner2 from "../../components/Spinner/Spinner2";
import Spinner3 from "../../components/Spinner/Spinner3";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Box, Button } from "@mui/material";
// import { useState } from "react";
// import useSpinningGame from "../../hooks/useSpinningGame";

function Lobby() {
  const wheelRef1 = useRef(null);
  const wheelRef2 = useRef(null);
  const currentRef = useRef(null);

  const newWeelRef1 = useRef(null);
  const newWeelRef2 = useRef(null);
  const newCurrentRef = useRef(null);

  useGSAP(() => {
    gsap.set(wheelRef1.current, { rotation: 18, transformOrigin: "50% 50%" });
    gsap.set(wheelRef2.current, { rotation: 18, transformOrigin: "50% 50%" });
  }, []);

  const oldSpinner = (targetNumber) => {
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
      onComplete: () => {
        console.log(`Spinner landed on number: ${targetNumber}`);
      },
    });

    luckywheelTimeline.to(wheelRef1.current, {
      duration: 11.3,
      rotation: rotationNext,
      transformOrigin: "50% 50%",
      ease: "power4",
    });

    // Optional: Spin the second wheel, if necessary
    if (wheelRef2) {
      luckywheelTimeline.to(
        wheelRef2.current,
        {
          duration: 11.3,
          rotation: rotationNext,
          transformOrigin: "50% 50%",
          ease: "power4",
        },
        "<" // Start both animations simultaneously
      );
    }
  };

  useGSAP(() => {
    gsap.set(newWeelRef1.current, { rotation: 18, transformOrigin: "50% 50%" });
    gsap.set(newWeelRef2.current, { rotation: 18, transformOrigin: "50% 50%" });
  }, []);

  const newSpinner = (targetNumber) => {
    const sections = 10; // Number of sections
    const sectionAngle = 360 / sections; // Angle for each section
    const angleOffset = sectionAngle / 2; // Offset to align with the center of the section
    const initialRotation = -72; // Initial offset to align with "1"

    // Get the current rotation of the spinner
    const currentRotation =
      gsap.getProperty(newWeelRef1.current, "rotation") || 0;

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
      onComplete: () => {
        console.log(`Spinner landed on number: ${targetNumber}`);
      },
    });

    luckywheelTimeline.to(newWeelRef1.current, {
      duration: 11.3,
      rotation: rotationNext,
      transformOrigin: "50% 50%",
      ease: "power4",
    });

    // Optional: Spin the second wheel, if necessary
    if (newWeelRef2) {
      luckywheelTimeline.to(
        newWeelRef2.current,
        {
          duration: 11.3,
          rotation: rotationNext,
          transformOrigin: "50% 50%",
          ease: "power4",
        },
        "<" // Start both animations simultaneously
      );
    }
  }

  // const { countdown, nextIntervalTime } = useSpinningGame(
  //   () => console.log("Triggered at 1 minute 45 seconds!"),
  //   () => console.log("Triggered every 2 minutes!")
  // );

  // const formatCountdown = (ms) => {
  //   const seconds = Math.floor((ms / 1000) % 60);
  //   const minutes = Math.floor((ms / (1000 * 60)) % 60);
  //   return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  // };

  return (
    <div>
      {/* <h1>Function</h1>
      <p>Next spin in: {formatCountdown(countdown)}</p> */}
      {/* <p>Next interval time: {nextIntervalTime}</p> */}
      {/* <p>Next interval time: {nextIntervalTime}</p> */}
      <Box sx={{ display: "flex", p: 3 }}>
        <Box sx={{ width: "686px" }}>
          <Button variant="contained" onClick={() => newSpinner(5)}>New Spinner</Button>
          <Spinner3
            wheelRef1={newWeelRef1}
            wheelRef2={newWeelRef2}
            currentRef={newCurrentRef}
          />
        </Box>
        <Box sx={{ width: "686px" }}>
          <Button variant="contained" onClick={() => oldSpinner(5)}>
            Old Spinner
          </Button>
          <Spinner2
            wheelRef1={wheelRef1}
            wheelRef2={wheelRef2}
            currentRef={currentRef}
          />
        </Box>
      </Box>
    </div>
  );
}

export default Lobby;

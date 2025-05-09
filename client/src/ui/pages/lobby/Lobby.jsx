// import React from 'react'

import { useEffect, useRef, useState } from "react";
// import Spinner2 from "../../components/Spinner/Spinner2";
// import Spinner3 from "../../components/Spinner/Spinner3";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
// import { Box, Button } from "@mui/material";
import midShefN from "../../public/midShfl/N.png";
import midShef2 from "../../public/midShfl/2X.png";
import midShef3 from "../../public/midShfl/3X.png";
import midShef4 from "../../public/midShfl/4X.png";
import midShef5 from "../../public/midShfl/5X.png";
import midShef6 from "../../public/midShfl/6X.png";
import midShef7 from "../../public/midShfl/7X.png";
// import StarsBg from "../../public/backgrounds/StarsBg.png";
// import { useState } from "react";
// import useSpinningGame from "../../hooks/useSpinningGame";

function Lobby() {
  // const wheelRef1 = useRef(null);
  // const wheelRef2 = useRef(null);
  // const currentRef = useRef(null);

  // const newWeelRef1 = useRef(null);
  // const newWeelRef2 = useRef(null);
  // const newCurrentRef = useRef(null);

  // useGSAP(() => {
  //   gsap.set(wheelRef1.current, { rotation: 18, transformOrigin: "50% 50%" });
  //   gsap.set(wheelRef2.current, { rotation: 18, transformOrigin: "50% 50%" });
  // }, []);

  // const oldSpinner = (targetNumber) => {
  //   const sections = 10; // Number of sections
  //   const sectionAngle = 360 / sections; // Angle for each section
  //   const angleOffset = sectionAngle / 2; // Offset to align with the center of the section
  //   const initialRotation = -72; // Initial offset to align with "1"

  //   // Get the current rotation of the spinner
  //   const currentRotation =
  //     gsap.getProperty(wheelRef1.current, "rotation") || 0;

  //   // Calculate the target rotation to land on the desired number
  //   const targetRotation =
  //     360 - (targetNumber * sectionAngle + angleOffset) - initialRotation;

  //   // Ensure the spinner always rotates clockwise by adding extra full spins
  //   const randomExtraRotation = 360 * gsap.utils.random(5, 10, 1); // 5-10 full spins
  //   const rotationNext =
  //     currentRotation +
  //     randomExtraRotation +
  //     ((targetRotation - currentRotation) % 360);

  //   // Spin the wheel to land on the target number
  //   const luckywheelTimeline = gsap.timeline({
  //     onComplete: () => {
  //       console.log(`Spinner landed on number: ${targetNumber}`);
  //     },
  //   });

  //   luckywheelTimeline.to(wheelRef1.current, {
  //     duration: 11.3,
  //     rotation: rotationNext,
  //     transformOrigin: "50% 50%",
  //     ease: "power4",
  //   });

  //   // Optional: Spin the second wheel, if necessary
  //   if (wheelRef2) {
  //     luckywheelTimeline.to(
  //       wheelRef2.current,
  //       {
  //         duration: 11.3,
  //         rotation: rotationNext,
  //         transformOrigin: "50% 50%",
  //         ease: "power4",
  //       },
  //       "<" // Start both animations simultaneously
  //     );
  //   }
  // };

  // useGSAP(() => {
  //   gsap.set(newWeelRef1.current, { rotation: 18, transformOrigin: "50% 50%" });
  //   gsap.set(newWeelRef2.current, { rotation: 18, transformOrigin: "50% 50%" });
  // }, []);

  // const newSpinner = (targetNumber) => {
  //   const sections = 10; // Number of sections
  //   const sectionAngle = 360 / sections; // Angle for each section
  //   const angleOffset = sectionAngle / 2; // Offset to align with the center of the section
  //   const initialRotation = -72; // Initial offset to align with "1"

  //   // Get the current rotation of the spinner
  //   const currentRotation =
  //     gsap.getProperty(newWeelRef1.current, "rotation") || 0;

  //   // Calculate the target rotation to land on the desired number
  //   const targetRotation =
  //     360 - (targetNumber * sectionAngle + angleOffset) - initialRotation;

  //   // Ensure the spinner always rotates clockwise by adding extra full spins
  //   const randomExtraRotation = 360 * gsap.utils.random(5, 10, 1); // 5-10 full spins
  //   const rotationNext =
  //     currentRotation +
  //     randomExtraRotation +
  //     ((targetRotation - currentRotation) % 360);

  //   // Spin the wheel to land on the target number
  //   const luckywheelTimeline = gsap.timeline({
  //     onComplete: () => {
  //       console.log(`Spinner landed on number: ${targetNumber}`);
  //     },
  //   });

  //   luckywheelTimeline.to(newWeelRef1.current, {
  //     duration: 11.3,
  //     rotation: rotationNext,
  //     transformOrigin: "50% 50%",
  //     ease: "power4",
  //   });

  //   // Optional: Spin the second wheel, if necessary
  //   if (newWeelRef2) {
  //     luckywheelTimeline.to(
  //       newWeelRef2.current,
  //       {
  //         duration: 11.3,
  //         rotation: rotationNext,
  //         transformOrigin: "50% 50%",
  //         ease: "power4",
  //       },
  //       "<" // Start both animations simultaneously
  //     );
  //   }
  // }

  const containerRef = useRef(null);
  const imagesRef = useRef([]);
  const timelineRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Your array of images
  const multiplierImages = [
    midShefN,
    midShef2,
    midShef3,
    midShef4,
    midShef5,
    midShef6,
    midShef7,
  ];
  
  // Function to add elements to the refs array
  const addToRefs = (el) => {
    if (el && !imagesRef.current.includes(el)) {
      imagesRef.current.push(el);
    }
  };

  // Reset to first image
  const resetToFirstImage = () => {
    // Hide all images
    gsap.set(imagesRef.current, {
      opacity: 0,
      scale: 0.8,
    });
    
    // Show only the first image
    gsap.set(imagesRef.current[0], {
      opacity: 1,
      scale: 1,
    });
  };

  useEffect(() => {
    // Initialize images (set all hidden except first)
    gsap.set(imagesRef.current, {
      opacity: 0,
      scale: 0.8,
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
    });

    // Show only the first image initially
    gsap.set(imagesRef.current[0], { opacity: 1, scale: 1 });
    
    // Create the timeline but don't play it yet
    timelineRef.current = createShuffleTimeline();
    
    // Pause the timeline initially
    timelineRef.current.pause();
    
    // Cleanup function when component unmounts
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
      imagesRef.current = [];
    };
  }, []);

  // Function to create the shuffle timeline
  const createShuffleTimeline = () => {
    const tl = gsap.timeline({ repeat: -1 });
    
    multiplierImages.forEach((_, index) => {
      const nextIndex = (index + 1) % multiplierImages.length;
      
      tl.to(imagesRef.current[index], {
        opacity: 0,
        scale: 1.2,
        duration: 0.5,
        ease: 'none',
      })
        .to(imagesRef.current[nextIndex], {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: 'none',
        }, '-=0.3')
        // .to({}, { duration: 2 }); // Pause between transitions
    });
    
    return tl;
  };

  // Function to toggle animation play/pause
  const toggleAnimation = () => {
    if (isPlaying) {
      // If currently playing, stop and reset to first image
      timelineRef.current.pause();
      resetToFirstImage();
    } else {
      // If not playing, start the animation
      timelineRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };


  return (
    <div>
      {/* <h1>Function</h1>
      <p>Next spin in: {formatCountdown(countdown)}</p> */}
      {/* <p>Next interval time: {nextIntervalTime}</p> */}
      {/* <p>Next interval time: {nextIntervalTime}</p> */}
      {/* <Box sx={{ display: "flex", p: 3 }}>
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
      </Box> */}
         <div>
      <div 
        ref={containerRef} 
        style={{ 
          position: 'relative', 
          width: '100%', 
          height: '400px', 
          overflow: 'hidden',
          marginBottom: '16px'
        }}
      >
        {multiplierImages.map((img, index) => (
          <img
            key={index}
            ref={addToRefs}
            src={img}
            alt={`Shuffling image ${index + 1}`}
            style={{ objectFit: 'cover' }}
          />
        ))}
      </div>
      
      <button 
        onClick={toggleAnimation}
        style={{
          padding: '10px 20px',
          backgroundColor: isPlaying ? '#f44336' : '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        {isPlaying ? 'Stop Animation' : 'Start Animation'}
      </button>
    </div>
    </div>
  );
}

export default Lobby;

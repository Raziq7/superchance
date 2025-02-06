import SpinnerResult from "../models/SpinnerResult.model.js";
import moment from "moment";

// Function to simulate spinning the spinner (random number from predefined set)
const spinSpinner = () => {
  const spinnerNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]; // Define spinner numbers
  const randomIndex = Math.floor(Math.random() * spinnerNumbers.length); // Get a random index
  return spinnerNumbers[randomIndex]; // Return the spinner number at the random index
};

// Controller function to spin the spinner and store the result
const spinAndStoreResult = async () => {
  const spinnerNumber = spinSpinner();
  console.log(`Spinner landed on number: ${spinnerNumber}, Date: ${Date.now()}`);

  // Store the result in the database
  const spinnerResult = new SpinnerResult({
    spinnerNumber,
  });

  await spinnerResult.save();
  console.log("Spinner result saved to the database:", spinnerResult);
  
  return spinnerResult;
};

// Ensure that the spinner runs at fixed intervals (2 minutes)
// Use a flag to prevent overlapping calls
let isSpinning = false;

const runSpinner = async () => {
  const time = 2; // Interval time in minutes
  const intervalMs = time * 60 * 1000;

  const now = moment();
  const midnight = moment().startOf("day");
  const elapsedTime = now.diff(midnight);
  const timeUntilNextInterval = intervalMs - (elapsedTime % intervalMs);
  const nextInterval = now.clone().add(timeUntilNextInterval, "milliseconds");

  // Log the time calculation
  console.log(`Time Until Next Interval: ${timeUntilNextInterval}ms, Next Interval: ${nextInterval.format("h:mm A")}`);

  // Make sure spinner runs after time is calculated
  if (isSpinning) {
    console.log("Skipping spinner run, previous run is still in progress.");
    return;
  }

  try {
    isSpinning = true; // Lock the spinner
    console.log("Starting the spinner...");
    await spinAndStoreResult(); // Trigger the spinner logic
    console.log("Spinner finished.");
  } catch (error) {
    console.error("Error during spinner operation:", error);
  } finally {
    isSpinning = false; // Unlock the spinner after the operation is done
  }

  setTimeout(runSpinner, timeUntilNextInterval); // Schedule the next spin
};

export { runSpinner }; // Ensure that runSpinner is exported

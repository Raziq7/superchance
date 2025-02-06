import SpinnerResult from "../models/SpinnerResult.model.js";

// Function to simulate spinning the spinner (random number from predefined set)
const spinSpinner = () => {
  const spinnerNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]; // Define spinner numbers
  const randomIndex = Math.floor(Math.random() * spinnerNumbers.length); // Get a random index
  return spinnerNumbers[randomIndex]; // Return the spinner number at the random index
};

// Controller function to spin the spinner and store the result
const spinAndStoreResult = async () => {
  // Step 1: Simulate the spinner
  const spinnerNumber = spinSpinner();
  console.log(`Spinner landed on number: ${spinnerNumber, "-",  Date.now()}`);

  // Step 2: Store the result in the database
  const spinnerResult = new SpinnerResult({
    spinnerNumber,
  });

  await spinnerResult.save();
  console.log("Spinner result saved to the database:", spinnerResult);
  
  return spinnerResult;
};

export { spinAndStoreResult };

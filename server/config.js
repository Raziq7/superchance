import dotenv from "dotenv";

// Load environment variables from the .env file
dotenv.config();

const getConfig = () => {
  return {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT ? process.env.PORT : undefined,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    // AWS_REGION: process.env.AWS_REGION,
    // AWS_ACCESS: process.env.AWS_ACCESS,
    // AWS_SECRETACCESS: process.env.AWS_SECRETACCESS,
  };
};

const getSanitizedConfig = (config) => {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(`Missing key ${key} in config.env`);
    }
  }
  return config;
};

const config = getConfig();

const sanitizedConfig = getSanitizedConfig(config);

export default sanitizedConfig;
import winston from "winston";

// Create a new Winston logger instance
const logger = winston.createLogger({
  level: "info", // Minimum level to log (options: error, warn, info, verbose, debug, silly)
  format: winston.format.combine(
    winston.format.timestamp(), // Add timestamp to log entries
    winston.format.json() // Format log entries as JSON
  ),
  transports: [
    // Define transports (where logs will be stored)
    new winston.transports.Console(), // Log to the console
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }), // Log errors to a file
    new winston.transports.File({ filename: "logs/combined.log" }), // Log all levels to a separate file
  ],
});

export default logger;

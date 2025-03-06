module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    setupFiles: ["dotenv/config"], // Loads .env.test file
    testTimeout: 10000, // Adjust if necessary
};

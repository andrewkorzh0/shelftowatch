import type { Config } from "jest";

const config: Config = {
    preset: "ts-jest",
    testEnvironment: "jsdom",
};
module.exports = {
    preset: "ts-jest",
    testEnvironment: "jsdom", // Ensure this is set
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/resources/js/$1", // Adjust if needed
    },
};

export default config;

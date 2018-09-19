// Using ES5 strict mode
'use strict';

// Base Jest config file

module.exports = {
    "roots": [
        "<rootDir>/src"
    ],
    // The transform config just tells jest to use ts-jest for ts / tsx files.
    "transform": {
        "^.+\\.tsx?$": "ts-jest"
    },
    // The testRegex tells Jest to look for tests in any __tests__ folder 
    // AND also any files anywhere that use the (.test|.spec).(ts|tsx) extension e.g. 
    // asdf.test.tsx etc.
    "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
    // The moduleFileExtensions tells jest to recognize our file extensions. 
    // This is needed as we add ts/tsx into the defaults (js|jsx|json|node).
    "moduleFileExtensions": [
        "ts",
        "tsx",
        "js",
        "jsx",
        "json",
        "node"
    ],
}
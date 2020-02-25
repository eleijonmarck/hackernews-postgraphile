"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const morgan_1 = tslib_1.__importDefault(require("morgan"));
const isDev = process.env.NODE_ENV === "development";
exports.default = (app) => {
    if (isDev) {
        // To enable logging on development, uncomment the next line:
        // app.use(morgan("tiny"));
    }
    else {
        app.use(morgan_1.default(isDev ? "tiny" : "combined"));
    }
};
//# sourceMappingURL=installLogging.js.map
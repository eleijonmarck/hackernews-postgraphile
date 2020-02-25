"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const { utimes, open } = fs_1.promises;
exports.touch = async (filepath) => {
    try {
        const time = new Date();
        await utimes(filepath, time, time);
    }
    catch (err) {
        const filehandle = await open(filepath, "w");
        await filehandle.close();
    }
};
//# sourceMappingURL=fs.js.map
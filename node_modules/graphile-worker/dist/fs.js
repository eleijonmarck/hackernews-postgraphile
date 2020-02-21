"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rawFs = require("fs");
const util_1 = require("util");
exports.stat = util_1.promisify(rawFs.stat);
exports.readFile = util_1.promisify(rawFs.readFile);
exports.readdir = util_1.promisify(rawFs.readdir);
async function tryStat(pathToStat) {
    try {
        return await exports.stat(pathToStat);
    }
    catch (e) {
        return null;
    }
}
exports.tryStat = tryStat;
//# sourceMappingURL=fs.js.map